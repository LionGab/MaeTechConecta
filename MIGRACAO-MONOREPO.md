# 🚀 Migração para Monorepo - Nossa Maternidade

## ✅ Status Atual

### Estrutura Base Criada
- ✅ `pnpm-workspace.yaml` - Workspace configurado
- ✅ `turbo.json` - Turborepo configurado
- ✅ `tsconfig.base.json` - TypeScript base
- ✅ `package.json` root - Scripts turbo
- ✅ `.github/workflows/ci.yml` - CI PR
- ✅ `.github/workflows/e2e-android.yml` - E2E Maestro
- ✅ `.github/workflows/release.yml` - Release EAS
- ✅ `.github/pull_request_template.md` - PR template
- ✅ `CODEOWNERS` - Code ownership

## 📋 Próximos Passos (FASE A)

### A.2: Migrar App RN para `apps/mobile/`

**Estrutura atual:**
- `src/` → `apps/mobile/src/`
- `App.tsx` → `apps/mobile/App.tsx`
- `app.json` → `apps/mobile/app.json`
- `assets/` → `apps/mobile/assets/`

**Ações:**
```bash
# Mover arquivos
mv src apps/mobile/src
mv App.tsx apps/mobile/App.tsx
mv app.json apps/mobile/app.json
mv assets apps/mobile/assets
mv babel.config.js apps/mobile/babel.config.js
mv tsconfig.json apps/mobile/tsconfig.json
```

**Criar `apps/mobile/package.json`:**
```json
{
  "name": "@nossa-maternidade/mobile",
  "version": "1.0.0",
  "private": true,
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "dev": "expo start",
    "build": "expo export",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "coverage": "jest --coverage",
    "e2e": "maestro test e2e/maestro/smoke-flow.yaml"
  },
  "dependencies": {
    "@expo/metro-runtime": "~3.2.3",
    "@nossa-maternidade/shared": "workspace:*",
    "@nossa-maternidade/shared-types": "workspace:*",
    // ... outras dependências
  }
}
```

### A.3: Migrar Supabase para `infra/supabase/`

**Estrutura atual:**
- `supabase/functions/` → `infra/supabase/functions/`
- `supabase/migrations/` → `infra/supabase/migrations/`

**Ações:**
```bash
# Mover Supabase
mv supabase/functions infra/supabase/functions
mv supabase/migrations infra/supabase/migrations
mv supabase/*.sql infra/supabase/schema/  # Se existir
```

### A.4: Extrair Shared (já feito parcialmente)

**Estrutura atual:**
- ✅ `packages/shared/` já existe
- ✅ `packages/shared-types/` já existe

**Verificar:**
- Mover `src/lib/nat-ai/` para `packages/shared/src/nat-ai/` (se necessário)
- Mover `src/theme/` para `packages/shared/src/theme/` (se necessário)

## 📋 FASE B - CI/CD

### B.1: CI PR ✅
- ✅ Workflow criado em `.github/workflows/ci.yml`

### B.2: E2E Android ✅
- ✅ Workflow criado em `.github/workflows/e2e-android.yml`

### B.3: Release ✅
- ✅ Workflow criado em `.github/workflows/release.yml`

### B.4: Sentry (Pendente)
- Criar `apps/mobile/sentry.config.js`
- Configurar release tracking

## 📋 FASE C - Testes

### Configurar Jest para Mobile
**Criar `apps/mobile/jest.config.js`:**
```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Configurar Vitest para Shared
**Criar `packages/shared/vitest.config.ts`:**
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
  },
});
```

### Maestro E2E
**Criar `e2e/maestro/smoke-flow.yaml`:**
```yaml
appId: com.nossa.maternidade
---
- launchApp
- tapOn: "Login"
- inputText: "test@example.com"
- tapOn: "Entrar"
- assertVisible: "Dashboard"
```

## 📋 FASE D - Ambientes

### Criar `.env.example`
```env
# Expo
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=xxx

# Sentry
SENTRY_DSN=xxx
SENTRY_AUTH_TOKEN=xxx

# EAS
EXPO_TOKEN=xxx
EAS_PROJECT_ID=xxx
```

### Criar `docs/ENVIRONMENTS.md`
Documentar:
- Dev, Staging, Prod
- Secrets e rotação (90d)
- Variáveis por ambiente

## 📋 FASE E - Observabilidade

### Sentry App
**Criar `apps/mobile/sentry.config.js`:**
```javascript
module.exports = {
  dsn: process.env.SENTRY_DSN,
  enableInExpoDevelopment: false,
  debug: false,
};
```

**Atualizar `apps/mobile/app.json`:**
```json
{
  "expo": {
    "plugins": ["sentry-expo"],
    "extra": {
      "sentry": {
        "dsn": "process.env.SENTRY_DSN"
      }
    }
  }
}
```

### Sentry Functions
**Criar wrapper em `infra/supabase/functions/_shared/sentry.ts`:**
```typescript
export function withSentry(handler: Function) {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error) {
      // Log to Sentry
      console.error(error);
      throw error;
    }
  };
}
```

## 📋 FASE F - Documentação

### Consolidar Docs
**Mover para `docs/`:**
- `ARCHITECTURE.md`
- `DEPLOY_PRODUCTION.md`
- `ENVIRONMENTS.md`
- `DOCUMENTATION.md` (criar índice)

## 🎯 Checklist de Migração

### Código
- [ ] Migrar React Native → `apps/mobile`
- [ ] Migrar Edge Functions → `infra/supabase/functions`
- [ ] Validar shared packages
- [ ] Atualizar imports (usar `@shared/*`)

### Infra
- [x] GitHub Actions (CI, E2E, Release)
- [ ] Expo EAS configurado
- [ ] Sentry app+functions
- [ ] Secrets no GitHub

### Docs
- [ ] README consolidado
- [ ] `docs/DOCUMENTATION.md`
- [ ] `docs/DEPLOY_PRODUCTION.md`
- [ ] `docs/ARCHITECTURE.md`
- [ ] `docs/ENVIRONMENTS.md`

### Testes
- [ ] Unit (mobile + shared)
- [ ] Edge Functions
- [ ] E2E (Maestro)
- [ ] Integração (mínimos)

### Deploy
- [ ] EAS Build/Submit ok
- [ ] Monitoramento em prod

## 🚀 Comandos Úteis

```bash
# Instalar dependências
pnpm install

# Desenvolvimento
pnpm dev

# Build
pnpm build

# Testes
pnpm test
pnpm coverage
pnpm e2e

# Lint/Typecheck
pnpm lint
pnpm typecheck
```

## 📝 Notas Importantes

1. **Rate Limiting**: Já implementado em `supabase/functions/_shared/rateLimiter.ts` (event-based)
2. **RLS**: Verificar policies em todas as tabelas
3. **Cobertura**: Gate ≥ 70% (pode começar menor)
4. **CI**: < 10min por PR (jobs paralelos)
5. **E2E**: Maestro no Android (smoke flow)

