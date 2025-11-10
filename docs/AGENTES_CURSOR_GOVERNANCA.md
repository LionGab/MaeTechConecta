# 🛡️ Governança dos Agentes Cursor

## 🎯 Objetivo
Garantir que automações e agentes Cursor atuem com rastreabilidade completa, sem burlar as proteções de revisão humana, especialmente em fluxos críticos (CI/CD, releases rápidos para influenciadoras, hotfixes).

---

## 🔐 Guardrails Obrigatórios
- **Auto-approve bloqueado por padrão**: `scripts/auto-approve.js` exige `CI_PASSED=true`, branch na allowlist (`release/agents`, `infra/automation`, `infra/ci`) e grava auditoria em `logs/approvals/YYYY-MM-DD.json`.
- **Override controlado**: use `AUTO_APPROVE_OVERRIDE=true` ou `--force` somente em incidentes, com justificativa registrada (campo `notes`).
- **Registro de ações**: toda execução automatizada deve chamar `scripts/register-agent-activity.ts` para gravar `logs/agents/YYYY-MM-DD.json`.
- **Branch protection**: `main` e `develop` requerem os checks `CI / Lint`, `CI / Type Check`, `CI / Unit Tests`, `CI / Format Check`, `CI / Coverage & Reports` e `Vercel Preview Deploy / Deploy Preview`.

---

## 🧭 Workflow de Execução
```bash
# 1. Rodar validações locais
pnpm run validate

# 2. Registrar ação do agente (antes de auto-approve)
pnpm exec tsx scripts/register-agent-activity.ts \
  --agent "cursor-auto" \
  --action "prepare-auto-approve" \
  --target "${GITHUB_REF_NAME}" \
  --status "pending" \
  --notes "Aguardando CI verde"

# 3. Aprovar somente após CI
CI_PASSED=true AUTO_APPROVE_BRANCHES=release/agents node scripts/auto-approve.js all

# 4. Registrar resultado
pnpm exec tsx scripts/register-agent-activity.ts \
  --agent "cursor-auto" \
  --action "auto-approve" \
  --target "${GITHUB_REF_NAME}" \
  --status "success"
```

---

## 📂 Estrutura de Logs
```
logs/
  approvals/
    approvals-2025-01-10.json   # Decisões do auto-approve
  agents/
    agents-2025-01-10.json      # Ações dos agentes Cursor
```
Cada entrada contém `timestamp`, `actor`, `branch`, `ci_pipeline_id`, `decision` e metadados específicos da ação.

---

## 🧾 Checklist Semanal de Auditoria
- [ ] Revisar `logs/approvals` e confirmar que toda aprovação teve CI verde.
- [ ] Conferir `logs/agents` e cruzar com PRs/commits criados por agentes.
- [ ] Validar se branches fora da allowlist receberam revisão humana.
- [ ] Atualizar `docs/AGENTES_CURSOR_GOVERNANCA.md` com exceções aprovadas.
- [ ] Reportar achados no standup de DevOps.

---

## 🚨 Procedimento de Incidente
1. Suspender `AUTO_APPROVE_OVERRIDE` imediatamente.
2. Rodar `git log --author="Cursor" --since="7 days"` e revisar commits.
3. Criar issue `Security` descrevendo impacto e mitigação.
4. Forçar revalidação (`workflow_dispatch`) do commit afetado.
5. Atualizar matriz de riscos em `docs/AUDITORIA_NOSSA_MATERNIDADE_2025.md`.

---

## 📎 Referências
- `scripts/auto-approve.js`
- `scripts/register-agent-activity.ts`
- `.github/workflows/ci.yml`
- `.github/workflows/post-merge-validation.yml`
- `.github/workflows/vercel-preview.yml`
