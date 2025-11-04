# SEÇÃO 1 — PLANO DE CONSOLIDAÇÃO MONOREPO

## Objetivo

Consolidar repositório atual em estrutura monorepo mobile-first (Expo/React Native) com backend Supabase, CI/CD completo, testes automatizados (≥70% coverage), E2E smoke tests (Maestro), observabilidade (Sentry) e documentação consolidada, pronto para produção com custo baixo e DX alto.

---

## FASE A: Estrutura Base (6-8 horas)

### A.1. Validação e Criação da Árvore de Pastas

**Tempo**: 30min | **Risco**: Baixo

- Validar estrutura atual vs estrutura-alvo
- Criar pastas: `apps/mobile`, `infra/supabase`, `packages/shared`
- Criar estrutura de documentação: `docs/` com índice único
- Criar `.env.example` unificado

**Arquivos Afetados**:

- Criação de novas pastas
- Movimentação de arquivos existentes

**Riscos**:

- Quebra de imports durante movimentação
- Perda de referências de caminhos

**Mitigação**:

- Usar `tsconfig.json` paths aliases
- Testar imports após cada movimentação

---

### A.2. Migração do App React Native

**Tempo**: 2-3h | **Risco**: Médio

- Mover `src/` → `apps/mobile/src/`
- Mover `App.tsx`, `app.json`, `babel.config.js` → `apps/mobile/`
- Mover `assets/` → `apps/mobile/assets/`
- Ajustar `package.json` do mobile (apps/mobile/package.json)
- Criar `apps/mobile/tsconfig.json` com paths relativos

**Arquivos Afetados**:

- `src/**/*` → `apps/mobile/src/**/*`
- `App.tsx` → `apps/mobile/App.tsx`
- `app.json` → `apps/mobile/app.json`
- `babel.config.js` → `apps/mobile/babel.config.js`
- `assets/` → `apps/mobile/assets/`

**Riscos**:

- Imports quebrados
- Configurações do Expo perdidas
- Metro bundler não encontra arquivos

**Mitigação**:

- Atualizar `tsconfig.json` paths
- Testar `npm start` após migração
- Validar `metro.config.js` se necessário

---

### A.3. Migração do Supabase

**Tempo**: 1-2h | **Risco**: Baixo

- Mover `supabase/functions/` → `infra/supabase/functions/`
- Mover `supabase/migrations/` → `infra/supabase/migrations/`
- Mover SQLs de schema → `infra/supabase/schema/`
- Criar `infra/supabase/README.md` com instruções de deploy

**Arquivos Afetados**:

- `supabase/functions/**/*` → `infra/supabase/functions/**/*`
- `supabase/migrations/**/*` → `infra/supabase/migrations/**/*`
- SQLs → `infra/supabase/schema/`

**Riscos**:

- Referências quebradas em Edge Functions
- Secrets do Supabase precisam ser reconfigurados

**Mitigação**:

- Validar paths relativos nas Edge Functions
- Documentar reconfiguração de secrets

---

### A.4. Extração do Sistema de IA para packages/shared

**Tempo**: 2-3h | **Risco**: Médio

- Mover `src/lib/nat-ai/` → `packages/shared/src/nat-ai/`
- Extrair `src/theme/` → `packages/shared/src/theme/`
- Extrair `src/constants/theme.ts` → `packages/shared/src/constants/`
- Criar `packages/shared/package.json` com exports
- Criar `packages/shared/tsconfig.json`
- Adicionar Zod schemas para validação (criar novos se necessário)
- Criar `packages/shared/src/schemas/` para validação de dados

**Arquivos Afetados**:

- `src/lib/nat-ai/**/*` → `packages/shared/src/nat-ai/**/*`
- `src/theme/**/*` → `packages/shared/src/theme/**/*`
- `src/constants/theme.ts` → `packages/shared/src/constants/theme.ts`
- Criar `packages/shared/src/schemas/` (novo)

**Riscos**:

- Imports quebrados no app mobile
- Dependências circulares
- Zod não está instalado (precisa adicionar)

**Mitigação**:

- Usar workspace references no TypeScript
- Testar imports após extração
- Adicionar `zod` como dependência

---

### A.5. Configuração do Monorepo (Root)

**Tempo**: 1h | **Risco**: Baixo

- Criar `package.json` root com workspaces
- Criar `tsconfig.json` root com references
- Criar `.npmrc` ou `pnpm-workspace.yaml` (se usar pnpm)
- Configurar paths aliases no root

**Arquivos Afetados**:

- `package.json` (root) - novo
- `tsconfig.json` (root) - novo
- `.npmrc` ou `pnpm-workspace.yaml` - novo

**Riscos**:

- Workspace não funciona com npm
- Paths aliases não resolvem corretamente

**Mitigação**:

- Usar npm workspaces (padrão)
- Testar resolução de paths

---

## FASE B: CI/CD (4-6 horas)

### B.1. Workflow CI (ci.yml)

**Tempo**: 1-2h | **Risco**: Baixo

- Criar `.github/workflows/ci.yml` com:
  - Lint (ESLint)
  - Type check (TypeScript)
  - Unit tests + coverage (Vitest) com gate ≥70%
  - npm audit (security scan)
  - Job paralelos para performance
  - Timeout total < 10min

**Arquivos Afetados**:

- `.github/workflows/ci.yml` - novo/atualizar

**Riscos**:

- Coverage não alcança 70%
- CI muito lento (>10min)

**Mitigação**:

- Configurar threshold no vitest.config.ts
- Otimizar jobs paralelos
- Cache de dependências

---

### B.2. Workflow E2E Android (e2e-android.yml)

**Tempo**: 2-3h | **Risco**: Médio

- Criar `.github/workflows/e2e-android.yml` com:
  - Setup Android SDK
  - Instalar Maestro CLI
  - Executar smoke tests (login → dashboard)
  - Android headless (emulator)
  - Timeout apropriado

**Arquivos Afetados**:

- `.github/workflows/e2e-android.yml` - novo
- `e2e/maestro/` - criar fluxos smoke

**Riscos**:

- Maestro não está configurado
- Emulator Android falha no CI
- Testes E2E muito lentos

**Mitigação**:

- Usar Maestro cloud ou local
- Configurar Android emulator corretamente
- Limitar smoke tests a fluxos críticos

---

### B.3. Workflow Release (release.yml)

**Tempo**: 1-2h | **Risco**: Médio

- Criar `.github/workflows/release.yml` com:
  - Trigger: tag `v*.*.*`
  - EAS build Android + iOS
  - EAS submit para tracks internas
  - Conditional para iOS (macos-latest)
  - Notificações de sucesso/falha

**Arquivos Afetados**:

- `.github/workflows/release.yml` - novo/atualizar

**Riscos**:

- EAS token não configurado
- Submit falha por credenciais
- Build muito lento

**Mitigação**:

- Validar secrets no GitHub
- Testar build local antes
- Usar cache do EAS

---

### B.4. Workflow Observabilidade (observability.yml)

**Tempo**: 1h | **Risco**: Baixo

- Criar `.github/workflows/observability.yml` com:
  - Sentry releases automáticas (app + functions)
  - Trigger: push para main ou tag
  - Source maps upload
  - Release tracking

**Arquivos Afetados**:

- `.github/workflows/observability.yml` - novo

**Riscos**:

- Sentry DSN não configurado
- Source maps não gerados

**Mitigação**:

- Configurar Sentry no app e functions
- Validar source maps no build

---

## FASE C: Testes (5-7 horas)

### C.1. Config Vitest + Coverage Gate

**Tempo**: 1-2h | **Risco**: Baixo

- Atualizar `vitest.config.ts` com:
  - Coverage threshold ≥70%
  - Reporter json-summary
  - Excludes apropriados
- Criar `scripts/check-coverage.js` para gate
- Adicionar script `test:coverage:check` no package.json

**Arquivos Afetados**:

- `vitest.config.ts` - atualizar
- `scripts/check-coverage.js` - novo
- `package.json` - adicionar script

**Riscos**:

- Coverage atual < 70%
- Threshold muito restritivo

**Mitigação**:

- Começar com threshold menor e aumentar gradualmente
- Adicionar testes para componentes críticos

---

### C.2. Suite E2E Maestro (Smoke)

**Tempo**: 2-3h | **Risco**: Médio

- Criar `e2e/maestro/` com:
  - `smoke-flow.yaml` - login → dashboard
  - Configurar Android app ID
  - Documentar setup local (Detox opcional)
  - Adicionar `e2e/maestro/README.md`

**Arquivos Afetados**:

- `e2e/maestro/smoke-flow.yaml` - novo
- `e2e/maestro/README.md` - novo

**Riscos**:

- Maestro não funciona no CI
- App ID não configurado
- Fluxo de login quebra

**Mitigação**:

- Testar Maestro localmente primeiro
- Usar app ID correto do EAS
- Validar fluxo de login antes

---

### C.3. Contract Tests RLS/Functions

**Tempo**: 2-3h | **Risco**: Médio

- Criar `__tests__/contracts/` com:
  - `rls-policies.test.ts` - 4-6 casos de RLS
  - `edge-functions.test.ts` - 4-6 casos de functions
  - Testar: SELECT/INSERT/UPDATE/DELETE por role
  - Cobrir: moderação, risco, chat, user_profiles

**Arquivos Afetados**:

- `__tests__/contracts/rls-policies.test.ts` - novo
- `__tests__/contracts/edge-functions.test.ts` - novo

**Riscos**:

- Supabase local não configurado
- RLS policies não testáveis facilmente
- Edge Functions precisam de secrets

**Mitigação**:

- Usar Supabase local ou testcontainers
- Mockar quando necessário
- Documentar setup de secrets para testes

---

## FASE D: Ambientes (2-3 horas)

### D.1. Documentação de Ambientes

**Tempo**: 1-2h | **Risco**: Baixo

- Criar `docs/ENVIRONMENTS.md` com:
  - Matriz dev/staging/prod
  - Inventário de segredos por ambiente
  - Fluxo de rotação (90 dias)
  - Mapeamento GitHub Environments
  - Mapeamento EAS environments
  - Mapeamento Supabase projects

**Arquivos Afetados**:

- `docs/ENVIRONMENTS.md` - novo

**Riscos**:

- Expor secrets acidentalmente
- Informações desatualizadas

**Mitigação**:

- Usar placeholders apenas
- Documentar processo de atualização

---

### D.2. .env.example Unificado

**Tempo**: 1h | **Risco**: Baixo

- Criar `.env.example` root com:
  - Variáveis para dev/staging/prod
  - Comentários explicativos
  - Mapeamento para GitHub/Expo/Supabase
  - Placeholders seguros (sem valores reais)

**Arquivos Afetados**:

- `.env.example` - novo/atualizar

**Riscos**:

- Expor valores reais
- Variáveis faltantes

**Mitigação**:

- Usar placeholders claros
- Validar com checklist

---

## FASE E: Observabilidade (2-3 horas)

### E.1. Sentry App Integration

**Tempo**: 1-2h | **Risco**: Baixo

- Validar `src/services/sentry.ts` existente
- Configurar source maps no build
- Adicionar release tracking
- Criar exemplo de erro simulado com toggle

**Arquivos Afetados**:

- `apps/mobile/src/services/sentry.ts` - mover/atualizar
- `apps/mobile/App.tsx` - validar integração
- Criar exemplo de erro simulado

**Riscos**:

- Source maps não gerados
- Sentry não captura erros

**Mitigação**:

- Configurar EAS build com source maps
- Testar localmente com DSN de teste

---

### E.2. Sentry Functions Integration

**Tempo**: 1h | **Risco**: Baixo

- Adicionar Sentry nas Edge Functions
- Configurar release tracking
- Criar exemplo de erro simulado

**Arquivos Afetados**:

- `infra/supabase/functions/**/index.ts` - adicionar Sentry
- Criar exemplo de erro simulado

**Riscos**:

- Sentry não funciona em Deno
- Secrets não configurados

**Mitigação**:

- Usar @sentry/deno compatível
- Documentar configuração de secrets

---

## FASE F: Documentação (2-3 horas)

### F.1. Índice Único (DOCUMENTATION.md)

**Tempo**: 1h | **Risco**: Baixo

- Criar `docs/DOCUMENTATION.md` como índice único
- Consolidar referências de outras docs
- Estruturar navegação clara

**Arquivos Afetados**:

- `docs/DOCUMENTATION.md` - novo/atualizar

**Riscos**:

- Links quebrados
- Informações duplicadas

**Mitigação**:

- Validar todos os links
- Remover duplicações

---

### F.2. DEPLOY_PRODUCTION.md

**Tempo**: 1h | **Risco**: Baixo

- Criar/atualizar `docs/DEPLOY_PRODUCTION.md` com:
  - EAS build + submit
  - Release train
  - Processo de versionamento
  - Rollback procedures

**Arquivos Afetados**:

- `docs/DEPLOY_PRODUCTION.md` - novo/atualizar

**Riscos**:

- Informações desatualizadas
- Processo incompleto

**Mitigação**:

- Validar com checklist real
- Testar deploy em staging

---

### F.3. ARCHITECTURE.md (1-página)

**Tempo**: 1h | **Risco**: Baixo

- Criar/atualizar `docs/ARCHITECTURE.md` com:
  - Visão 1-página do sistema
  - Diagrama de arquitetura
  - Fluxos principais
  - Stack tecnológico

**Arquivos Afetados**:

- `docs/ARCHITECTURE.md` - novo/atualizar

**Riscos**:

- Diagrama muito complexo
- Informações técnicas demais

**Mitigação**:

- Manter foco em visão geral
- Limitar a 1 página

---

## FASE G: Scripts e Validação (1-2 horas)

### G.1. Scripts NPM

**Tempo**: 30min | **Risco**: Baixo

- Adicionar scripts no root `package.json`:
  - `test:coverage:check` - gate de coverage
  - `test:e2e:smoke` - smoke tests Maestro
  - `build:mobile` - build mobile
  - `deploy:functions` - deploy edge functions

**Arquivos Afetados**:

- `package.json` (root) - adicionar scripts

**Riscos**:

- Scripts não funcionam em monorepo
- Paths incorretos

**Mitigação**:

- Testar scripts localmente
- Validar paths relativos

---

### G.2. Validação Local

**Tempo**: 1h | **Risco**: Baixo

- Criar `scripts/validate-local.sh` ou `.ps1`
- Validar: lint, types, tests, coverage
- Documentar comandos de verificação

**Arquivos Afetados**:

- `scripts/validate-local.sh` ou `.ps1` - novo

**Riscos**:

- Script não funciona em todos OS
- Validação incompleta

**Mitigação**:

- Criar versão Windows (.ps1) e Unix (.sh)
- Validar todos os checks

---

## Resumo de Tempo e Riscos

| Fase                | Tempo Estimado | Risco Geral | Bloqueadores                        |
| ------------------- | -------------- | ----------- | ----------------------------------- |
| A - Estrutura Base  | 6-8h           | Médio       | Imports quebrados, workspace config |
| B - CI/CD           | 4-6h           | Médio       | Maestro setup, EAS credentials      |
| C - Testes          | 5-7h           | Médio       | Coverage <70%, Supabase local       |
| D - Ambientes       | 2-3h           | Baixo       | Nenhum                              |
| E - Observabilidade | 2-3h           | Baixo       | Sentry DSN config                   |
| F - Documentação    | 2-3h           | Baixo       | Nenhum                              |
| G - Scripts         | 1-2h           | Baixo       | Nenhum                              |
| **TOTAL**           | **22-34h**     | **Médio**   |                                     |

---

## Ordem de Execução Recomendada

1. **Fase A** (Estrutura) - Base para tudo
2. **Fase G** (Scripts) - Facilitar validação
3. **Fase C** (Testes) - Validar estrutura
4. **Fase B** (CI/CD) - Automatizar validação
5. **Fase D** (Ambientes) - Configurar deployments
6. **Fase E** (Observabilidade) - Monitorar produção
7. **Fase F** (Documentação) - Documentar tudo

---

## Critérios de Aceite (Checklist)

- [ ] CI total < 10min em PR (lint, types, unit+coverage≥70%, npm audit)
- [ ] E2E smoke (Maestro) rodando em Android headless no CI
- [ ] Tag vX.Y.Z dispara builds EAS + submit para tracks internas
- [ ] Sentry recebe release e captura erro simulado em ≤15min
- [ ] `docs/ENVIRONMENTS.md` e `.env.example` publicados e coerentes
- [ ] Contract tests RLS/Functions passando para 4-6 regras críticas
- [ ] Estrutura monorepo funcionando (apps/mobile, infra/supabase, packages/shared)
- [ ] Todos os imports funcionando após migração
- [ ] Coverage ≥70% com gate configurado
- [ ] Documentação consolidada e indexada

---

## Próximos Passos

Aguardando aprovação do plano. Quando receber "APROVAR PLANO", executarei as SEÇÕES 2-10 com:

- Árvore final do repo
- Diffs detalhados por arquivo
- Workflows YAML completos
- Testes (unit + E2E + contract)
- Configuração de ambientes
- Setup de observabilidade
- Documentação consolidada
- Comandos de verificação local
- Procedimentos de rollback
- Notas de LGPD/segurança
