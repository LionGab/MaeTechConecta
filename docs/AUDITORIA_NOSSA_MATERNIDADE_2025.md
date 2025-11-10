# Auditoria Técnica 360º - Nossa Maternidade

## 1. Objetivo, Critérios e Escopo

- **Objetivo**: avaliar maturidade técnica, segurança, operações e governança do ecossistema Nossa Maternidade para suportar expansão mobile-first com IA assistiva.
- **Critérios de conformidade**: LGPD (Lei 13.709/18), OWASP Mobile Top 10 (2024), OWASP API Security Top 10 (2023), recomendações Supabase RLS, guias Expo/React Native para apps em produção.
- **Referências principais**: `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/CONSOLIDACAO_DEVOPS.md`, `docs/ENVIRONMENTS.md`, `docs/DEPLOY_PRODUCTION.md`, `.github/workflows/*.yml`, `src/services/*`, `apps/mobile`.
- **Escopo cobre**:
  - Aplicativo mobile (`apps/mobile`) e bibliotecas compartilhadas (`packages/shared`).
  - Serviços backend via Supabase (`supabase/`), Edge Functions e integrações IA (`src/services/gemini`, `src/lib/nat-ai`).
  - Integrações externas (Supabase, Gemini, Anthropic, Amplitude, Sentry, Vercel/EAS, MCP/GitHub).
  - Pipelines CI/CD (`.github/workflows`, `scripts/`).
  - Documentação operacional e de segurança (`docs/`), processos de equipe e governança (auto-approve, agentes Cursor).
- **Fora de escopo (não avaliados)**: contratos legais com parceiros, infraestrutura física de dispositivos de time, suporte ao app de fotos (`fotosapp/`).

## 2. Metodologia de Auditoria

1. Revisão documental (arquitetura, devops, segurança, envs).
2. Inspeção de código e configuração (TypeScript, Expo, Supabase, pipelines). Ferramentas: busca semântica (`grep`), leitura dirigida.
3. Análise de segurança (credenciais, RLS, guardrails IA, autenticação).
4. Avaliação operacional (deploy, monitoramento, backups, logs, agentes automatizados).
5. Matriz de riscos com priorização (probabilidade x impacto) e verificação de controles.
6. Recomendações classificadas por prazo (imediato, curto, médio) e área responsável.

## 3. Visão Geral da Arquitetura e Fluxos de Dados

### 3.1 Componentes Principais

- **Frontend Mobile** (`apps/mobile`): React Native + Expo (SDK 51+), integrações com tema `mom-blue`, componentes em `src/components`.
- **Shared Libraries** (`packages/shared`): analytics, UI compartilhada, tipos.
- **Serviços Aplicacionais** (`src/services`): wrappers para Supabase (`supabase.ts`), IA (Gemini, Anthropic), notificações Expo, pagamentos, onboarding.
- **IA & Guardrails** (`src/lib/nat-ai`, `services/gemini`): context manager, risk analyzer, guardrails obrigatórios conforme `docs/SECURITY.md`.
- **Backend Supabase** (`supabase/`): schema SQL, policies RLS, edge functions (moderation, risk-classifier, lgpd).
- **Infra CI/CD**: GitHub Actions workflows (lint, build, e2e, release, deploy), integração com Vercel previews (`docs/CONSOLIDACAO_DEVOPS.md`).
- **Agentes Automatizados** (`scripts/auto-approve.js`, `agents/*`): aprovam builds, assistem revisões.

### 3.2 Fluxos de Dados Críticos

- **Autenticação**: Supabase Auth; tokens consumidos via `SUPABASE_URL` e `SUPABASE_ANON_KEY` (App, Edge Functions). Service Role reservado para CI/funções (`docs/ENVIRONMENTS.md`).
- **Chat IA (NathIA)**: fluxo `src/services/gemini/*` → guardrails (`nat-ai/guardrails.ts`) → moderação → risk analyzer (Edge Functions). Logs críticos enviados ao Sentry.
- **Conteúdo personalizado**: hooks (`src/hooks/usePersonalizedContent.ts`) e `services/personalization.ts` consomem dados Supabase, IA.
- **Analytics**: `packages/shared/src/analytics` integra Amplitude; status de adoção parcial (ver resultados).
- **Push & Notifications**: `services/notifications.ts` + Expo.
- **Deploy Mobile**: EAS Build (tokens via secrets), pipeline GitHub (`.github/workflows/deploy.yml`).

### 3.3 Integrações Externas e Estado

| Integração                           | Uso                           | Configuração Atual                                              | Observações                                                       |
| ------------------------------------ | ----------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Supabase**                         | Auth, DB, Edge Functions, RLS | Chaves listadas em `docs/ENVIRONMENTS.md`; SQL em `supabase/`   | Policies documentadas; necessidade de validar testes de contrato. |
| **Gemini (Google)**                  | Geração de conteúdos IA       | Chaves `GEMINI_API_KEY` (CI/EAS)                                | Guardrails presentes, falta evidência de auditoria de limites.    |
| **Anthropic**                        | Alternativa IA (NathIA)       | `ANTHROPIC_API_KEY`                                             | Documentado, não há código ativo recente (verificar).             |
| **Sentry**                           | Monitoramento de erros        | `SENTRY_DSN`, `sentry.config.js`                                | Performance monitoring pendente (`docs/CONSOLIDACAO_DEVOPS.md`).  |
| **Amplitude**                        | Analytics                     | `packages/shared/src/analytics`                                 | Integração inicial, falta confirmação de eventos em app.          |
| **Expo EAS**                         | Build & OTA                   | `eas.json`, tokens em secrets                                   | Fluxo `docs/DEPLOY_PRODUCTION.md` bem definido.                   |
| **Vercel**                           | Preview Web                   | Configs referenciadas (ver doc); repo não contém app web ativo. |
| **MCP Servers (GitHub, Sentry, FS)** | Automações Cursor/Copilot     | Config em `ARCHITECTURE.md`                                     | Exigem revisão de permissões periódica.                           |

## 4. Análise Técnica do Código e Pipelines

### 4.1 Práticas de Versionamento e Scripts

- `pnpm` workspace com monorepo (apps + packages). Comandos `validate`, `validate:full`, `ci` abrangem lint, type-check, testes.
- Husky + lint-staged configurados (`package.json`).
- Turborepo caches (`turbo.json`) otimizam builds; workflows reusam caches (confirmado em `docs/CONSOLIDACAO_DEVOPS.md`).

### 4.2 Cobertura de Testes e Qualidade

- Testes unitários com Vitest (`vitest.config.ts`). Suites principais em `__tests__/` (chat, contracts, services). Cobertura objetivo 70% (documentado). Falta relatório atual de cobertura; recomenda rodar `pnpm run test:coverage` no CI periódico.
- Não há testes end-to-end mobile automatizados além de `e2e/maestro` (scripts presentes). Necessidade de integrar pipeline `e2e-android.yml` com triggers regulares.
- Code style reforçado (`docs/CURSOR_2.0_BEST_PRACTICES.md`). Componentes usam TypeScript estrito em sua maioria.

### 4.3 Pipelines CI/CD

- Workflows: `ci.yml` (lint/typecheck/tests), `build.yml`, `deploy.yml` (EAS), `post-merge-validation.yml`, `codeql.yml`, `observability.yml`. Necessário garantir que `codeql` está habilitado (ver alert backlog).
- Scripts de agentes: `scripts/auto-approve.js` confirma auto-aprovação (risco de bypass review se mal gerenciado).
- Falta pipeline documentado para contract tests e segurança (Snyk, npm audit). `package.json` inclui script `audit` mas não automatizado.

## 5. Avaliação de Segurança

### 5.1 Gestão de Credenciais

- Secrets definidos em `docs/ENVIRONMENTS.md`; rotação recomendada a cada 90 dias. Não há evidência de automação para rotacionar ou monitorar expiração.
- `.env.example` (verificar) deve evitar credenciais reais. Recomenda validar se existe script `validate:env` (referenciado) implementado.

### 5.2 Autenticação e Autorização

- Supabase Auth + RLS policies (exemplos em `supabase/`). Checklist em `docs/SECURITY.md`. Necessário validar se todas tabelas têm RLS e se tests `__tests__/contracts` cobrem.
- Edge Functions exigem ANON key via header; garantir ausência de Service Role no app (`ENVIRONMENTS.md` reforça).

### 5.3 Criptografia e Dados Sensíveis

- Depende da camada Supabase (TLS). No app, verificar armazenamento local (AsyncStorage) para tokens – recomenda criptografia ou revogação periódica.

### 5.4 IA Guardrails

- `src/lib/nat-ai/guardrails.ts` implementa moderação e risk classifier; compliance com doc. Checar logs e fallback quando serviços indisponíveis.

### 5.5 Vulnerabilidades e Ferramentas

- Não há integração obrigatória com CodeQL/Snyk confirmada. Workflow `codeql.yml` existe, mas recomenda verificar execução semanal e triagem de alertas.
- `scripts/validate-logger-errors.ts` útil para logs, mas não substitui SAST/DAST.

## 6. Revisão Operacional e Controles

### 6.1 Backup e Disaster Recovery

- Dependência do Supabase (backups automáticos). Não há plano documentado de restore ni ciclos testados. Recomenda adicionar runbook.
- Expo EAS + OTA: requer fallback plan se build falhar; `docs/DEPLOY_PRODUCTION.md` cobre manualmente.

### 6.2 Logs e Observabilidade

- Sentry configurado (erros); monitoramento de performance pendente (doc). Edge Functions log via Supabase. Falta agregação centralizada (ex.: Logflare ou BigQuery) para auditoria.

### 6.3 Gestão de Mudanças e Segregação

- Auto-approve scripts aprovam builds automaticamente; risco se agentes acionados sem supervisão. Recomenda restringir a branches confiáveis ou revisar logs.
- Não há menção a ambientes com roles distintos (dev/staging/prod) quanto a permissões de deploy. Documentos sugerem gating por tags.

### 6.4 Operação de Agentes e Automação

- Cursor auto-approve e multi-agente configurados; precisa monitorar outputs. Documentar responsabilidades dos operadores humanos.

## 7. Mapeamento de Riscos e Lacunas

| Risco                                            | Categoria         | Evidência                                                 | Impacto                     | Probabilidade | Avaliação       | Controle Atual                  | Lacuna                                                    |
| ------------------------------------------------ | ----------------- | --------------------------------------------------------- | --------------------------- | ------------- | --------------- | ------------------------------- | --------------------------------------------------------- |
| Falta de testes de contrato para RLS em produção | Segurança / Dados | Checklist em `docs/SECURITY.md` marcado como pendente     | Alto (exposição de dados)   | Médio         | **Crítico (5)** | Documentação, intenção de tests | Implementar e automatizar testes RLS                      |
| Auto-aprovação indiscriminada de builds          | Governança        | `scripts/auto-approve.js all` ligado a auto-approve geral | Alto (mudanças sem revisão) | Alta          | **Crítico (5)** | Script manual + doc             | Adicionar controles (branch allowlist, logs, require ack) |
| Falta de evidência de backup/restore testes      | Operacional       | Documentação não menciona runbooks                        | Alto                        | Médio         | **Alto (4)**    | Supabase backups padrão         | Criar DR plan com testes trimestrais                      |
| Performance monitoring pendente                  | Operacional       | `docs/CONSOLIDACAO_DEVOPS.md` status ⚠️                   | Médio                       | Médio         | **Médio (3)**   | Sentry errors                   | Implementar Sentry Performance + dashboards               |
| Falta de SAST/DAST automatizados                 | Segurança         | `codeql.yml` sem confirmação + sem Snyk                   | Alto                        | Médio         | **Alto (4)**    | Manual `audit`                  | Ativar CodeQL semanal, integrar Snyk/OWASP ZAP            |
| Integração Amplitude não verificada              | Dados/Produto     | Doc indica pendente de validação                          | Médio                       | Médio         | **Médio (3)**   | SDK configurado                 | Criar checklist de eventos e monitoramento                |
| Segregação de funções limitada                   | Governança        | Pequena equipe, auto-approve, sem RBAC deploy             | Médio                       | Alto          | **Alto (4)**    | Documentos checklists           | Definir processo formal de revisão & approval             |

## 8. Recomendações Prioritárias

### 8.1 Imediatas (0-2 semanas)

1. **Restringir Auto-Approve**: ajustar `scripts/auto-approve.js` para exigir branch allowlist e logging de auditoria; incluir alerta Slack.
2. **Implementar Contract Tests RLS**: usar `docs/CONTRACT_TESTS.md` para criar suite automatizada (`pnpm run test:contracts`) e adicioná-la ao CI.
3. **Ativar CodeQL e dependabot alerts**: garantir execução agendada e triagem semanal; adicionar Snyk (ou `pnpm audit`) no CI.
4. **Runbook DR Supabase**: documentar e testar restore; armazenar snapshots controlados.

### 8.2 Curto Prazo (2-6 semanas)

1. **Performance Monitoring**: integrar Sentry Performance + métricas custom no app; configurar alertas.
2. **Analytics QA**: checklist de eventos, dashboards Amplitude, validação de dados.
3. **Gestão de Secrets**: automatizar rotação (ex.: script `scripts/rotate-secrets.ts`) e monitor; auditar `.env.example`.
4. **Revisão de Edge Functions**: adicionar testes unitários/integration para `moderation`, `risk-classifier`, `lgpd` com mocks controlados.

### 8.3 Médio Prazo (6-12 semanas)

1. **Segregação e Governança**: definir papéis (dev, reviewer, release manager), atualizar processos no `docs/` e Slack.
2. **Centralização de Logs**: integrar Supabase logs + app logs em plataforma (Logflare/Datadog) com retenção >30 dias.
3. **Hardening Mobile**: revisar armazenamento local, habilitar obfuscation (Metro bundler), aplicar recomendações OWASP Mobile.

## 9. Painel de Ações Prioritárias

| Prioridade | Ação                                       | Responsável  | Prazo      | KPI de Sucesso                            |
| ---------- | ------------------------------------------ | ------------ | ---------- | ----------------------------------------- |
| Alta       | Limitar auto-approve e registrar auditoria | Eng. Líder   | 1 semana   | 100% builds com log de aprovação          |
| Alta       | Adicionar contract tests RLS no CI         | Backend      | 2 semanas  | Testes passam 100% das execuções          |
| Alta       | Testar restore Supabase e documentar       | DevOps       | 2 semanas  | Relatório de restore e tempo <30min       |
| Média      | Instrumentar Sentry Performance            | Mobile       | 4 semanas  | Dashboards p95 < objetivos                |
| Média      | Validar eventos Amplitude                  | Produto/Data | 4 semanas  | Painel com eventos críticos confirmados   |
| Média      | Automatizar rotação de secrets             | DevOps       | 6 semanas  | Planilha de rotação e script automatizado |
| Média      | Centralizar logs críticos                  | DevOps       | 8 semanas  | Log retention 90 dias com alertas         |
| Baixa      | Revisão OWASP Mobile & Hardening           | Mobile       | 12 semanas | Checklist OWASP ≥80% completo             |

## 10. Conclusão

O projeto possui boa base documental, pipelines estruturados e foco em segurança (RLS, guardrails IA). Entretanto, controles críticos dependem de execução manual (tests RLS, rotação de secrets, revisão de builds). Implementar as recomendações elevará maturidade e reduzirá riscos de vazamento, mudança não revisada e indisponibilidade.

## 11. Evidências Consultadas

- `docs/ARCHITECTURE.md`, linhas iniciais (arquitetura, MCP servers).
- `docs/SECURITY.md` (RLS, guardrails IA, LGPD, rate limiting).
- `docs/CONSOLIDACAO_DEVOPS.md` (melhorias DevOps, pendências).
- `docs/ENVIRONMENTS.md` (secrets e rotação).
- `.github/workflows/*.yml` (CI/CD pipelines variados).
- `src/services/*`, `src/lib/nat-ai/*` (implementação de serviços e guardrails).
- `scripts/auto-approve.js`, `scripts/auto-review-changes.js` (governança de aprovações).
- `supabase/**/*.sql` (políticas e schema).
