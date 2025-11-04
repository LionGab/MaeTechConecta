# 🤰 Nossa Maternidade

> Aplicativo mobile React Native (Expo) para mães, gestantes e tentantes brasileiras - 100% configurado, testado e pronto para produção

## ✅ Status do Projeto

```
✅ Build: Passing
✅ Tests: Configured (≥70% coverage)
✅ CI/CD: Active
✅ Docs: Complete
✅ Deploy: Ready
✅ Production: Ready
```

## 📋 Sobre o Projeto

**Nossa Maternidade** é um aplicativo React Native (Expo) desenvolvido para apoiar mães, gestantes e tentantes brasileiras durante toda a jornada da maternidade. O app oferece uma assistente virtual inteligente (NathIA) com sistema completo de segurança, moderação e detecção de crises.

### 🎯 Objetivos

- Apoiar mães brasileiras da classe C-D com informações acessíveis e confiáveis
- Oferecer assistente virtual empática com sistema completo de segurança
- Garantir proteção legal (sem conselhos médicos)
- Detecção automática de crises emocionais
- Experiência de usuário acessível e profissional

## 🚀 Quick Start

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

**Variáveis Obrigatórias**:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`
- `GEMINI_API_KEY`

### 3. Executar Localmente

```bash
pnpm --filter apps/mobile run start
```

## 📦 Estrutura Monorepo

```
nossa-maternidade/
├─ apps/
│  └─ mobile/              # App React Native
├─ infra/
│  └─ supabase/             # Edge Functions + Migrations + Schema
├─ packages/
│  └─ shared/               # Sistema de IA + Schemas Zod + Tema
├─ __tests__/               # Testes unitários + contract tests
├─ e2e/                     # Testes E2E (Maestro)
└─ docs/                    # Documentação consolidada
```

## 🧪 Testes

### Unitários

```bash
pnpm test              # Executar testes
pnpm run test:coverage # Com coverage
pnpm run test:coverage:check # Verificar ≥70%
```

### E2E (Maestro)

```bash
pnpm run e2e:smoke     # Smoke tests
```

### Contract Tests

```bash
pnpm test __tests__/contracts/
```

## 🚀 Deploy

### Release Train

1. **Versionar**:

   ```bash
   npm version patch|minor|major
   ```

2. **Criar Tag**:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **Build Automático**: GitHub Actions executa EAS build + submit

### Edge Functions

```bash
supabase functions deploy nathia-chat
supabase functions deploy moderation-service
# ... outras funções
```

## 📚 Documentação

- **[docs/DOCUMENTATION.md](./docs/DOCUMENTATION.md)** - Índice único
- **[docs/ONBOARDING.md](./docs/ONBOARDING.md)** - Guia de onboarding para novos devs
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Arquitetura 1-página
- **[docs/DEPLOY_PRODUCTION.md](./docs/DEPLOY_PRODUCTION.md)** - Deploy e release train
- **[docs/ENVIRONMENTS.md](./docs/ENVIRONMENTS.md)** - Ambientes e segredos
- **[RELEASE_NOTES.md](./RELEASE_NOTES.md)** - Release Notes v1.0.0

## 🔐 Segurança

- ✅ Row Level Security (RLS) no Supabase
- ✅ Guardrails contra conselhos médicos (40+ termos)
- ✅ Detecção automática de crises (0-10)
- ✅ Moderação em 3 camadas
- ✅ Rate limiting (30 req/min)
- ✅ Protocolo de crise (CVV 188, SAMU 192)

## 📊 CI/CD

- **CI**: Lint, types, tests, coverage (≥70%), npm audit
- **E2E**: Maestro smoke tests (Android headless)
- **Release**: Tag v*.*.\* → EAS build + submit
- **Observability**: Sentry releases automáticas

## 🛠️ Scripts Disponíveis

```bash
pnpm lint                # Lint
pnpm typecheck          # Type check
pnpm test               # Testes
pnpm run test:coverage  # Coverage
pnpm run e2e:smoke      # E2E smoke
pnpm run build:mobile:android  # Build Android
pnpm run build:mobile:ios      # Build iOS
```

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para mães de todo o Brasil**
