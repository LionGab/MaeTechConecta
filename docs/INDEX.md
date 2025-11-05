# Índice de Documentação - Nossa Maternidade

**Última atualização**: 2025-01-XX

---

## 🚀 Início Rápido

- **[README.md](../README.md)** - Visão geral do projeto
- **[docs/DEPLOY_PRODUCTION.md](./DEPLOY_PRODUCTION.md)** - Como fazer deploy em produção
- **[docs/ENVIRONMENTS.md](./ENVIRONMENTS.md)** - Configuração de ambientes e secrets

---

## 📋 Setup e Configuração

- **[docs/ENVIRONMENTS.md](./ENVIRONMENTS.md)** - Ambientes (dev/staging/prod) e secrets
- **[.env.example](../.env.example)** - Template de variáveis de ambiente

---

## 🏗️ Arquitetura

- **[docs/ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitetura do sistema (1 página)
- **[turbo.json](../turbo.json)** - Configuração do monorepo (Turborepo)
- **[pnpm-workspace.yaml](../pnpm-workspace.yaml)** - Workspaces do pnpm

---

## 🚢 Deploy e Release

- **[docs/DEPLOY_PRODUCTION.md](./DEPLOY_PRODUCTION.md)** - Deploy completo (Expo + EAS + stores)
  - Release train (cronograma semanal/quinzenal)
  - Canais EAS (internal → beta → production)
  - Build e submit automático por tag
  - Sentry releases e source maps

---

## 🔒 Segurança e Compliance

- **[docs/SECURITY.md](./SECURITY.md)** - Segurança (RLS + moderação + LGPD)
- **[docs/CONTRACT_TESTS.md](./CONTRACT_TESTS.md)** - Contract tests (RLS + Edge Functions)

---

## 🧪 Testes

- **[e2e/README.md](../e2e/README.md)** - Testes E2E com Maestro
- **[docs/CONTRACT_TESTS.md](./CONTRACT_TESTS.md)** - Contract tests (RLS + Functions)
- **[vitest.config.ts](../vitest.config.ts)** - Configuração Vitest

---

## 📦 Estrutura do Monorepo

```
nossa-maternidade/
├── apps/
│   └── mobile/          # App React Native (Expo)
├── packages/
│   ├── shared/          # Código compartilhado (IA, schemas, tema)
│   └── shared-types/    # Tipos TypeScript compartilhados
├── infra/
│   └── supabase/        # Edge Functions + migrations
├── .github/workflows/   # CI/CD (GitHub Actions)
├── e2e/                 # Testes E2E (Maestro)
└── docs/                # Documentação (você está aqui)
```

---

## 🔧 CI/CD

Workflows GitHub Actions:

- **`.github/workflows/ci.yml`** - CI completo (lint, typecheck, test, security)
- **`.github/workflows/e2e-android.yml`** - E2E Android (Maestro, smoke tests)
- **`.github/workflows/release.yml`** - Release automático (tag v*.*.* → EAS Build/Submit + Sentry)

---

## 📚 Documentação por Categoria

### Desenvolvimento

- **[docs/ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitetura e decisões técnicas
- **[.cursorrules](../.cursorrules)** - Regras do Cursor (code style, padrões)

### Operações

- **[docs/DEPLOY_PRODUCTION.md](./DEPLOY_PRODUCTION.md)** - Deploy e release train
- **[docs/ENVIRONMENTS.md](./ENVIRONMENTS.md)** - Ambientes e secrets

### Qualidade

- **[docs/CONTRACT_TESTS.md](./CONTRACT_TESTS.md)** - Contract tests
- **[e2e/README.md](../e2e/README.md)** - E2E testing

### Performance

- **[docs/PERFORMANCE.md](./PERFORMANCE.md)** - SLOs, métricas e otimizações

### Segurança

- **[docs/SECURITY.md](./SECURITY.md)** - Segurança e compliance

---

## 🆘 Troubleshooting

Problemas comuns e soluções:

- **Build falha**: Verificar [docs/DEPLOY_PRODUCTION.md](./DEPLOY_PRODUCTION.md)
- **Secrets faltando**: Verificar [docs/ENVIRONMENTS.md](./ENVIRONMENTS.md)
- **Testes falhando**: Verificar [e2e/README.md](../e2e/README.md)
- **RLS problemas**: Verificar [docs/CONTRACT_TESTS.md](./CONTRACT_TESTS.md)

---

## 📝 Contribuindo

1. Ler [docs/ARCHITECTURE.md](./ARCHITECTURE.md) para entender a arquitetura
2. Seguir padrões em [.cursorrules](../.cursorrules)
3. Executar testes localmente: `pnpm test && pnpm e2e:android`
4. Criar PR seguindo template (se existir)
5. Aguardar CI verde antes de merge

---

**Mantido por**: Time Nossa Maternidade

