# Checklist de Migração - Nossa Maternidade

## ✅ Pré-Migração

- [ ] Backup do código legado
- [ ] Backup do banco de dados
- [ ] Documentar dependências atuais
- [ ] Listar todos os secrets em uso

## 📦 Estrutura

- [ ] Criar estrutura de pastas (`src/`, `supabase/functions/`, etc.)
- [ ] Migrar código React Native para `src/`
- [ ] Migrar Edge Functions para `supabase/functions/`
- [ ] Remover duplicações de código
- [ ] Consolidar imports

## 🔧 Configuração

- [ ] Atualizar `package.json` com dependências
- [ ] Configurar `tsconfig.json` com paths
- [ ] Configurar `vitest.config.ts` com coverage ≥70%
- [ ] Configurar `eas.json` para builds
- [ ] Criar `.env.example` unificado

## 🧪 Testes

- [ ] Criar testes unitários (≥3 exemplos)
- [ ] Criar testes E2E (Maestro + Detox)
- [ ] Validar coverage ≥70%
- [ ] Testes passando localmente

## 🔄 CI/CD

- [ ] Criar `.github/workflows/ci.yml`
- [ ] Criar `.github/workflows/build.yml`
- [ ] Criar `.github/workflows/deploy.yml`
- [ ] Validar workflows em PR
- [ ] Testar build automático

## 📝 Documentação

- [ ] Criar `docs/DOCUMENTATION.md` (índice)
- [ ] Criar `docs/ARCHITECTURE.md` (1-página)
- [ ] Criar `docs/DEPLOY_PRODUCTION.md` (deploy)
- [ ] Criar `docs/ENVIRONMENTS.md` (ambientes)
- [ ] Atualizar `README.md`

## 🔐 Secrets

- [ ] Configurar GitHub Secrets
- [ ] Configurar Expo/EAS Secrets
- [ ] Configurar Supabase Secrets
- [ ] Validar acesso em todos os ambientes

## 🚀 Deploy

- [ ] Testar build local (EAS)
- [ ] Testar deploy Edge Functions
- [ ] Validar Sentry releases
- [ ] Testar deploy completo em staging
- [ ] Validar deploy em produção

## ✅ Pós-Migração

- [ ] Remover código legado duplicado
- [ ] Validar funcionamento completo
- [ ] Documentar mudanças para o time
- [ ] Atualizar onboarding de novos devs
