# 📊 Status da Consolidação Monorepo

## ✅ Completado (FASE A + B parcial)

### Estrutura Base Monorepo ✅
- ✅ `pnpm-workspace.yaml` - Workspace configurado
- ✅ `turbo.json` - Turborepo configurado
- ✅ `tsconfig.base.json` - TypeScript base
- ✅ `package.json` root - Scripts turbo (atualizado)

### CI/CD ✅
- ✅ `.github/workflows/ci.yml` - CI PR (lint, typecheck, tests, coverage)
- ✅ `.github/workflows/e2e-android.yml` - E2E Maestro Android
- ✅ `.github/workflows/release.yml` - Release EAS (Android + iOS)
- ✅ `.github/pull_request_template.md` - PR template
- ✅ `CODEOWNERS` - Code ownership

### Rate Limiting ✅
- ✅ `infra/supabase/functions/_shared/rate-limit.ts` - Helper rate limiting
- ✅ `infra/supabase/migrations/20250104_rate_limiting_event_based.sql` - Migration

### Configuração ✅
- ✅ `ENV_EXAMPLE.txt` - Variáveis de ambiente (renomear para .env.example)
- ✅ `packages/shared-types/package.json` - Configurado com tsup

### Documentação ✅
- ✅ `MIGRACAO-MONOREPO.md` - Guia completo de migração
- ✅ `RESUMO-CONSOLIDACAO.md` - Resumo do que foi feito

## 🚧 Pendente

### FASE A - Migração de Código
- [ ] Migrar `src/` → `apps/mobile/src/`
- [ ] Migrar `supabase/` → `infra/supabase/`
- [ ] Criar `apps/mobile/package.json` completo
- [ ] Atualizar imports para usar `@shared/*`

### FASE B - Observabilidade
- [ ] Sentry app configurado
- [ ] Sentry functions wrapper

### FASE C - Testes
- [ ] Jest mobile configurado
- [ ] Vitest shared configurado
- [ ] Maestro E2E criado
- [ ] Testes RLS

### FASE D - Ambientes
- [ ] `.env.example` criado (usar ENV_EXAMPLE.txt)
- [ ] `docs/ENVIRONMENTS.md` criado

### FASE E - Observabilidade
- [ ] Sentry app completo
- [ ] Sentry functions completo

### FASE F - Documentação
- [ ] `docs/DOCUMENTATION.md` (índice)
- [ ] `docs/DEPLOY_PRODUCTION.md`
- [ ] `docs/ARCHITECTURE.md`
- [ ] `docs/ENVIRONMENTS.md`

## 📋 Próximos Passos

1. **Migrar código** (seguir `MIGRACAO-MONOREPO.md`)
2. **Configurar testes** (Jest + Vitest + Maestro)
3. **Integrar Sentry** (app + functions)
4. **Consolidar documentação** (mover para `docs/`)

## 🎯 Comandos para Commit

```bash
# Adicionar arquivos criados
git add pnpm-workspace.yaml turbo.json tsconfig.base.json package.json
git add .github/workflows/* .github/pull_request_template.md CODEOWNERS
git add infra/supabase/functions/_shared/rate-limit.ts
git add infra/supabase/migrations/20250104_rate_limiting_event_based.sql
git add packages/shared-types/package.json
git add ENV_EXAMPLE.txt
git add MIGRACAO-MONOREPO.md RESUMO-CONSOLIDACAO.md CONSOLIDACAO-STATUS.md

# Commit
git commit -m "feat: Estrutura base monorepo + CI/CD + Rate Limiting

- Configura monorepo com pnpm + turbo
- Cria workflows CI/CD (CI, E2E, Release)
- Implementa rate limiting event-based (sliding window)
- Adiciona PR template e CODEOWNERS
- Prepara estrutura para migração de código

FASE A (parcial) + FASE B (CI/CD) completos
FASES C-F pendentes (ver MIGRACAO-MONOREPO.md)"
```

