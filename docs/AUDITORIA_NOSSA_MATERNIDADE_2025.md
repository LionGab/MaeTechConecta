# Auditoria Técnica 360º - Nossa Maternidade

## 1. Objetivo, Critérios e Escopo
- **Objetivo**: avaliar maturidade técnica, segurança, confiabilidade operacional e governança do projeto Nossa Maternidade para suportar MVP mobile-first com IA assistiva.
- **Normas/Referências**: LGPD, OWASP Mobile Top 10 (2024), OWASP API Security Top 10 (2023), boas práticas Supabase RLS, Expo/React Native production checklist, Vercel/Next.js deploy guidance.
- **Escopo**:
  - Frontend: `apps/mobile`, `src/components`, `src/screens`, `packages/shared`.
  - Serviços: `src/services` (Supabase, IA, notifications, payments), `src/lib/nat-ai`.
  - Backend/Supabase: diretório `supabase/` (schemas, policies, functions).
  - Infra/ops: scripts (`scripts/`), documentação em `docs/`, workflows GitHub (ausentes), automações (`auto-approve`).
  - Integrações externas: Supabase, Gemini, Anthropic, Sentry, Amplitude, Expo EAS, MCP servers.
- **Fora de escopo**: contratos legais, hardware da equipe, apps experimentais (`fotosapp/`).

## 2. Metodologia
1. Revisão documental (`ARCHITECTURE.md`, `SECURITY.md`, `CONSOLIDACAO_DEVOPS.md`, `ENVIRONMENTS.md`).
2. Inspeção de código (`src/services`, `src/lib/nat-ai`, `scripts/auto-approve.js`, `supabase/**/*.sql`).
3. Verificação de infraestrutura (ausência de `.github/workflows`, scripts de deploy, configurações EAS/Vercel).
4. Avaliação de segurança (credenciais, RLS, autenticação, criptografia, logs, guardrails IA).
5. Revisão operacional (backup/DR, monitoramento, auto-approve, segregação de funções).
6. Mapeamento de riscos (impacto x probabilidade) e recomendações priorizadas.

## 3. Arquitetura e Fluxos
### 3.1 Componentes
- **Mobile app** (`apps/mobile`): Expo/React Native, integra temas (`src/theme`, `src/components`).
- **Shared libs** (`packages/shared`): analytics, UI, tipos.
- **Services** (`src/services`): wrappers Supabase (`supabase.ts`), autenticação, IA (`gemini`, `nat-ai`), notificações.
- **IA stack** (`src/lib/nat-ai/*`): context manager, guardrails, risk analyzer integrados a edge functions.
- **Supabase** (`supabase/`): schemas SQL, edge functions (moderation, risk-classifier, lgpd) e RLS policies.
- **Automação**: scripts `auto-approve.js`, `auto-review-changes.js`, agentes Cursor.

### 3.2 Fluxos de Dados
- **Autenticação**: Supabase Auth via `SUPABASE_ANON_KEY` (cliente), Service Role reservado para backend/CI (`ENVIRONMENTS.md`).
- **Chat IA**: `services/gemini` → guardrails (`nat-ai/guardrails.ts`) → edge functions de moderação/risk antes de responder.
- **Conteúdo personalizado**: hooks `usePersonalizedContent`, `services/personalization.ts` consumindo dados Supabase.
- **Analytics**: `packages/shared/src/analytics` integra Amplitude (status de adoção parcial).
- **Notificações**: `services/notifications.ts` usa Expo.

### 3.3 Integrações & Estado
| Integração | Uso | Evidência | Observações |
| --- | --- | --- | --- |
| Supabase | Auth, DB, Edge Functions | `src/services/supabase.ts`, `supabase/**/*.sql` | RLS documentado em `docs/SECURITY.md`, mas testes pendentes.
| Gemini | IA generativa | `src/services/gemini/*` | Guardrails presentes, falta monitoramento de limites.
| Anthropic | IA alternativa | `src/services/claudeService.ts` | Não usado ativamente; revisar chaves.
| Sentry | Observabilidade | `sentry.config.js`, docs | Performance monitoring pendente.
| Amplitude | Analytics | `packages/shared/src/analytics` | Necessário validar eventos.
| Expo EAS | Builds | `eas.json`, docs | Depende de secrets configurados.
| MCP Servers | Automação | `ARCHITECTURE.md` | Requer auditoria periódica de permissões.
| Vercel | Previews web | `docs/CONSOLIDACAO_DEVOPS.md` | Workflows referenciados, mas repos não contém `.github`.

## 4. Análise Técnica
### 4.1 Versionamento & Scripts
- `pnpm` monorepo com comandos `validate`, `validate:full`, `ci` (lint/typecheck/test) — ver `package.json`.
- Husky + lint-staged configurados para format/lint (JS/TS/MD).
- Turborepo cache (`turbo.json`) otimizado, mas sem workflows os benefícios não se materializam.

### 4.2 Testes & Qualidade
- Vitest configurado (`vitest.config.ts`). Suites em `__tests__/` cobrem chat, services, contracts, etc.
- Contract tests RLS (`__tests__/contracts/rls-policies.test.ts`) usam `testUserId` sem criação real → esqueleto.
- E2E Maestro scripts (`e2e/maestro/*.yaml`) existem, porém não integrados a CI.

### 4.3 Pipelines
- **Ausência de `.github/workflows`**: não há automação em repositório atual (risco crítico). Docs referenciam pipelines (`ci.yml`, `deploy.yml`, `post-merge-validation.yml`, `codeql.yml`), mas arquivos não presentes.
- Scripts `auto-approve.js` e `auto-review-changes.js` aprovam mudanças automaticamente sem validação manual (risco de governança).
- Sem pipeline para `pnpm audit`, CodeQL, Snyk ou contract tests.

## 5. Segurança
### 5.1 Credenciais
- Secrets listados em `docs/ENVIRONMENTS.md`; rotação recomendada, porém sem evidência de automação.
- `.env.example` não possui valores reais; script `validate:env` citado na doc não existe → gap de verificação.
- Expo/Supabase tokens dependem de manutenção manual; ausência de inventário de expiração.

### 5.2 Autenticação e Autorização
- `supabase.ts` usa somente ANON key (bom). Funções `createTemporaryUser`, `saveChatMessage` dependem de RLS.
- Edge functions documentadas para exigir header `Authorization` (ANON). Necessário validar enforcement.

### 5.3 Proteção de Dados
- Sessões armazenadas em `AsyncStorage` (não criptografado). Recomendado SecureStore ou force reauthentication.
- Funções `sanitizeObject` aplicadas antes de persistir mensagens/perfis.

### 5.4 IA
- Guardrails `nat-ai/guardrails.ts`, `risk-analyzer.ts` seguem doc; fallback quando serviços falham apenas loga erro (não há plano de contingência).

### 5.5 Ferramentas de Segurança
- Sem CodeQL, Dependabot, Snyk ou outra SAST/DAST ativa (por ausência de workflows).
- `scripts/validate-logger-errors.ts` apenas revisa logs; não substitui SAST.

## 6. Operações & Governança
### 6.1 Backup & DR
- Dependência em backups automáticos do Supabase. `docs/CONSOLIDACAO_DEVOPS.md` indica pendente a criação de runbook/teste de restore.
- Expo EAS/OTA: docs descrevem processos, mas não há checklist de rollback ou owners.

### 6.2 Logs & Observabilidade
- Sentry configurado para erros; performance monitoring não implementado.
- Edge functions logam no console Supabase, sem centralização (Logflare/Datadog).
- Logs locais podem ser varridos por `scripts/validate-logger-errors.ts` (manual).

### 6.3 Mudanças & Segregação
- Auto-approve sem restrição = mudanças podem ser aprovadas sem revisão humana.
- Sem branch protection/status checks (faltam workflows). Não há definição de papéis (dev, reviewer, ops).

### 6.4 Automação de Agentes
- Agentes Cursor com permissões amplas; sem SLA de revisão ou trilha de auditoria descrita.

## 7. Matriz de Riscos
| Risco | Categoria | Evidência | Impacto | Prob. | Avaliação | Controle Atual | Lacuna |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Ausência de pipelines CI/CD | Governança | `list_dir` sem `.github/workflows` | Alto (builds sem gate) | Alta | **Crítico (5)** | Documentação indica intenção | Restaurar workflows e branch protection |
| Auto-approve irrestrito | Governança | `scripts/auto-approve.js` auto aprova tudo | Alto | Alta | **Crítico (5)** | Logs simples no `.cursor` | Restringir a branches, exigir aprovação humana |
| Contract tests RLS incompletos | Segurança/Dados | `__tests__/contracts/rls-policies.test.ts` sem seeds | Alto | Médio | **Crítico (5)** | Testes esqueleto | Criar seeds e executar em CI |
| Backup/restore não testado | Operacional | `docs/CONSOLIDACAO_DEVOPS.md` (pendente) | Alto | Médio | **Alto (4)** | Backups automáticos Supabase | Runbook e teste trimestral |
| Falta de SAST/DAST | Segurança | Sem CodeQL/Snyk | Alto | Médio | **Alto (4)** | `pnpm audit` manual | Reativar CodeQL, Dependabot, Snyk |
| Sessions em AsyncStorage | Segurança | `src/services/supabase.ts` | Médio | Médio | **Médio (3)** | Nenhum | Usar SecureStore/rotacionar tokens |
| Observabilidade parcial | Operacional | Sentry sem performance, logs dispersos | Médio | Médio | **Médio (3)** | Sentry errors | Implementar Sentry Performance/log aggregation |
| Segregação de funções frágil | Governança | Falta de papéis e gates | Médio | Alto | **Alto (4)** | Checklists em docs | Definir owners e approvals |
| Amplitude sem validação | Produto/Dados | SDK sem evidência de uso | Médio | Médio | **Médio (3)** | Integração parcial | Checklist de eventos e dashboards |

## 8. Recomendações
### 8.1 Imediatas (0-2 semanas)
1. **Restaurar pipelines CI/CD**: recriar `.github/workflows` com lint, typecheck, tests, build, CodeQL; configurar branch protection.
2. **Restringir auto-approve**: limitar script a branches autorizadas, exigir aprovação humana ou desativar; registrar auditoria.
3. **Finalizar contract tests RLS**: criar seeds supabase, parametrizar `testUserId`, rodar `pnpm run test:contracts` no CI.
4. **Ativar CodeQL/Dependabot/Snyk**: garantir execução agendada e triagem semanal.
5. **Runbook DR Supabase**: script de restore, teste e registro de tempos (RPO/RTO).

### 8.2 Curto Prazo (2-6 semanas)
1. **Instrumentar Sentry Performance & métricas custom**.
2. **Validar Amplitude**: painel de eventos críticos, monitoramento semanal.
3. **Automatizar rotação de secrets**: inventário com datas e script de rotação.
4. **Testes Edge Functions**: unit/integration para moderation, risk-classifier, lgpd.

### 8.3 Médio Prazo (6-12 semanas)
1. **Segregação de Funções**: definir papéis (dev, reviewer, release manager) e atualizar docs.
2. **Centralizar logs**: pipeline para Supabase + app (Logflare/Datadog) com retenção >30 dias.
3. **Hardening Mobile**: armazenamento seguro (SecureStore), obfuscation, checklist OWASP Mobile.

## 9. Painel de Ações Prioritárias
| Prioridade | Ação | Responsável | Prazo | KPI |
| --- | --- | --- | --- | --- |
| Alta | Restaurar workflows CI/CD completos | DevOps | 1 semana | Workflows verdes em 2 execuções |
| Alta | Limitar auto-approve e registrar auditoria | Eng. Líder | 1 semana | 100% builds com log + aprovação humana |
| Alta | Adicionar contract tests RLS no CI | Backend | 2 semanas | Suite passa 100% |
| Alta | Testar restore Supabase e documentar | DevOps | 2 semanas | Tempo de restore <30min |
| Média | Instrumentar Sentry Performance | Mobile | 4 semanas | p95 monitorado em dashboard |
| Média | Validar eventos Amplitude | Produto/Data | 4 semanas | Painel com eventos críticos |
| Média | Automatizar rotação de secrets | DevOps | 6 semanas | Matriz de expiração + script |
| Média | Centralizar logs críticos | DevOps | 8 semanas | Retenção 90 dias + alertas |
| Baixa | Revisão OWASP Mobile | Mobile | 12 semanas | Checklist ≥80% completo |

## 10. Conclusão
Projeto possui base técnica sólida e documentação extensa, porém controles críticos (CI, revisão humana, testes RLS) estão desativados ou incompletos. Recomendações imediatas priorizam restabelecer governança de build, garantir confidencialidade via RLS testado e preparar rollback/DR. Implementar follow-up de segurança e observabilidade fortalece sustentação do MVP.

## 11. Evidências Consultadas
- `ARCHITECTURE.md` (arquitetura, MCP).
- `docs/SECURITY.md` (RLS, guardrails, LGPD).
- `docs/CONSOLIDACAO_DEVOPS.md` (pendências DevOps).
- `docs/ENVIRONMENTS.md` (secrets/rotation).
- `scripts/auto-approve.js` (auto aprovação).
- `src/services/supabase.ts`, `src/lib/nat-ai/*`, `src/services/gemini/*` (fluxos e segurança).
- `__tests__/contracts/rls-policies.test.ts` (contract tests incompletos).
- Ausência de `.github/workflows` (via `list_dir`).
