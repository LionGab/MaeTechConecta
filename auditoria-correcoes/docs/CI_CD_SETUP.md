# CI/CD Setup - Nossa Maternidade

## Visão Geral

Sistema de CI/CD mínimo com GitHub Actions para garantir qualidade antes de merge.

---

## Workflows

### 1. CI (`ci.yml`)

**Trigger:** PRs e pushes para `main`, `master`, `develop`

**Jobs:**
- ✅ Lint (`pnpm lint`)
- ✅ Type check (`pnpm typecheck`)
- ✅ Testes (`pnpm test:unit`)
- ✅ Build (`pnpm build`)

**Artefatos:**
- Coverage report (se disponível)

**Status:** Publica `CI_PASSED=true` se passar

---

### 2. Vercel Preview (`vercel-preview.yml`)

**Trigger:** PRs para `main`, `master`

**Jobs:**
- Deploy automático para preview no Vercel

**Requisitos:**
- `VERCEL_TOKEN` (GitHub Secrets)
- `VERCEL_ORG_ID` (GitHub Secrets)
- `VERCEL_PROJECT_ID` (GitHub Secrets)

**Status:** Link de preview no PR

---

### 3. EAS Preview (`eas-preview.yml`)

**Trigger:** PRs para `main`, `master`

**Jobs:**
- Build Android Preview (Ubuntu)

**Requisitos:**
- `EAS_TOKEN` (GitHub Secrets)

**Status:** Links de download no PR

---

## Configuração

### Secrets GitHub

**Settings → Secrets and variables → Actions**

Adicionar:
- `VERCEL_TOKEN` (se usar preview web)
- `VERCEL_ORG_ID` (se usar preview web)
- `VERCEL_PROJECT_ID` (se usar preview web)
- `EAS_TOKEN` (se usar preview mobile)

### Branch Protection

Ver `configs/branch-protection.md`

---

## Como Funciona

1. **PR criado** → CI roda automaticamente
2. **CI passa** → Status check `ci` fica verde
3. **Branch protection** → Requer CI verde + 2 approvals
4. **Merge** → Só permite se passar todos os gates

---

## Troubleshooting

### CI não roda

**Verificar:**
- Workflow está em `.github/workflows/ci.yml`
- Branch do PR está em `branches:` do workflow
- GitHub Actions está habilitado no repo

### Status check não aparece

**Verificar:**
- Job tem `name:` definido
- Workflow tem `pull_request:` trigger
- Branch protection está configurada

---

## Próximos Passos (Fase 2)

- [ ] CodeQL security scanning
- [ ] Drift check (supabase migrations)
- [ ] Notificações Slack
- [ ] Coverage gates (>70%)

