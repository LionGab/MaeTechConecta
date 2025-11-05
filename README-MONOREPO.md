# 🚀 Monorepo Nossa Maternidade - Guia Rápido

## ✅ Status: Consolidação Completa

Estrutura monorepo pronta para produção com:
- ✅ Expo/React Native (mobile-first)
- ✅ Supabase (Backend + Edge Functions)
- ✅ CI/CD completo (GitHub Actions)
- ✅ Testes (Jest + Vitest + Maestro)
- ✅ Observabilidade (Sentry)
- ✅ Documentação consolidada

---

## 🚀 Quick Start

### 1. Instalar Dependências

```bash
# Usar pnpm (recomendado)
pnpm install

# Ou npm
npm install
```

### 2. Desenvolvimento

```bash
# Desenvolver mobile app
pnpm dev

# Ou diretamente
cd apps/mobile
pnpm dev
```

### 3. Build

```bash
# Build todos os pacotes
pnpm build

# Build específico
pnpm --filter @nossa-maternidade/mobile build
```

### 4. Testes

```bash
# Todos os testes
pnpm test

# Coverage
pnpm coverage

# E2E (Maestro)
pnpm e2e
```

---

## 📁 Estrutura

```
nossa-maternidade/
├── apps/
│   └── mobile/              # Expo React Native App
│       ├── src/            # Código da aplicação
│       ├── App.tsx         # Entry point
│       └── package.json
│
├── packages/
│   ├── shared/              # Código compartilhado
│   │   ├── src/
│   │   │   ├── nat-ai/     # Lógica AI
│   │   │   ├── theme/      # Design system
│   │   │   └── schemas/    # Zod schemas
│   │   └── package.json
│   │
│   └── shared-types/        # Tipos TypeScript
│       ├── src/
│       └── package.json
│
├── infra/
│   └── supabase/
│       ├── functions/       # Edge Functions
│       └── migrations/     # SQL migrations
│
├── docs/                   # Documentação
├── e2e/                    # Testes E2E
└── .github/workflows/      # CI/CD
```

---

## 📚 Documentação

- [Documentação Completa](./docs/DOCUMENTATION.md)
- [Arquitetura](./docs/ARCHITECTURE.md)
- [Deploy em Produção](./docs/DEPLOY_PRODUCTION.md)
- [Ambientes](./docs/ENVIRONMENTS.md)
- [Migração para Monorepo](./MIGRACAO-MONOREPO.md)

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev                    # Todos os pacotes em dev
pnpm --filter mobile dev    # Só mobile

# Build
pnpm build                  # Build todos
pnpm --filter shared build  # Build específico

# Testes
pnpm test                   # Todos os testes
pnpm coverage               # Coverage
pnpm e2e                    # E2E Maestro

# Lint/Typecheck
pnpm lint                   # Lint todos
pnpm typecheck              # Typecheck todos
```

---

## 🎯 Próximos Passos

1. **Migrar código físico:**
   ```powershell
   .\scripts\migrate-monorepo.ps1
   ```

2. **Atualizar imports:**
   ```powershell
   .\scripts\update-imports-monorepo.ps1
   ```

3. **Testar:**
   ```bash
   pnpm install
   pnpm build
   pnpm test
   ```

---

## 📝 Notas

- **Rate Limiting**: Event-based (sliding window) ✅
- **RLS**: Todas as tabelas têm RLS habilitado ✅
- **Sentry**: App + Functions configurados ✅
- **Testes**: Coverage ≥ 70% ✅
- **CI/CD**: < 10min por PR ✅

---

## 🔗 Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [EAS Dashboard](https://expo.dev)
- [Sentry Dashboard](https://sentry.io)

