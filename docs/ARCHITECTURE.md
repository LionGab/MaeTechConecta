# 🏗️ Arquitetura - Nossa Maternidade

## 📊 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE APP (Expo RN)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Screens    │  │  Components  │  │    Hooks     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              @nossa-maternidade/shared                │  │
│  │  (nat-ai, theme, utils, schemas)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS
                        │ (ANON_KEY)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Edge Functions (Deno)                    │  │
│  │  - nathia-chat     - nat-ai-chat                     │  │
│  │  - risk-classifier - moderation-service              │  │
│  │  - transcribe-audio - behavior-analysis              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PostgreSQL + RLS                         │  │
│  │  - auth.users      - chat_messages                   │  │
│  │  - user_profiles  - rate_limit_events              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ External APIs
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                              │
│  - Gemini AI (Edge Functions)                               │
│  - Sentry (Error Tracking)                                  │
│  - Stripe (Payments)                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏛️ Estrutura do Monorepo

```
nossa-maternidade/
├── apps/
│   └── mobile/              # Expo React Native App
│       ├── src/             # Código da aplicação
│       ├── App.tsx          # Entry point
│       ├── app.json         # Expo config
│       └── package.json     # Dependências mobile
│
├── packages/
│   ├── shared/              # Código compartilhado
│   │   ├── src/
│   │   │   ├── nat-ai/      # Lógica AI (guardrails, context, etc)
│   │   │   ├── theme/       # Design system
│   │   │   └── schemas/     # Zod schemas
│   │   └── package.json
│   │
│   └── shared-types/        # Tipos TypeScript
│       ├── src/
│       └── package.json     # ESM+CJS via tsup
│
├── infra/
│   └── supabase/
│       ├── functions/       # Edge Functions
│       │   ├── _shared/    # Rate limiting, Sentry
│       │   ├── nathia-chat/
│       │   └── ...
│       └── migrations/      # SQL migrations
│
├── docs/                    # Documentação consolidada
├── e2e/                     # Testes E2E (Maestro)
└── .github/workflows/       # CI/CD
```

---

## 🔐 Segurança

### RLS (Row Level Security)

- ✅ Todas as tabelas têm RLS habilitado
- ✅ Policies por usuário autenticado
- ✅ NUNCA usar `SERVICE_ROLE_KEY` em rotas de usuário

### Rate Limiting

- ✅ Event-based (sliding window)
- ✅ Por endpoint e usuário
- ✅ Configurável por endpoint

### Autenticação

- ✅ Supabase Auth (email/password)
- ✅ JWT tokens via `Authorization` header
- ✅ Refresh tokens automáticos

---

## 📊 Fluxo de Dados

### Chat Flow

```
App → Edge Function (nathia-chat)
  ↓
Rate Limit Check
  ↓
RLS Query (chat_messages)
  ↓
Gemini AI Process
  ↓
Guardrails Check
  ↓
Risk Analysis
  ↓
Response → App
```

### Data Flow

```
App → Supabase Client (ANON_KEY)
  ↓
RLS Policies
  ↓
PostgreSQL
  ↓
Response → App
```

---

## 🧪 Testes

### Estrutura

- **Unit Tests**: Jest (mobile) + Vitest (shared)
- **E2E Tests**: Maestro (Android)
- **Contract Tests**: RLS/Functions
- **Coverage**: ≥ 70%

---

## 🚀 CI/CD

### Workflows

1. **CI** (PR): lint → typecheck → test → coverage
2. **E2E** (PR): Maestro smoke flow
3. **Release** (tag): EAS build → submit stores

---

## 📚 Tecnologias

- **Mobile**: Expo/React Native
- **Backend**: Supabase (Postgres + Edge Functions)
- **AI**: Gemini API
- **Auth**: Supabase Auth
- **Monitoring**: Sentry
- **Testing**: Jest + Vitest + Maestro
- **CI/CD**: GitHub Actions
- **Build**: EAS Build
- **Monorepo**: pnpm + Turborepo
