# Ambientes e Secrets - Nossa Maternidade

## Matriz de Ambientes

| Ambiente | Origem       | Supabase | Sentry  | EAS Channel |
| -------- | ------------ | -------- | ------- | ----------- |
| dev      | local        | dev      | dev     | -           |
| staging  | PR (preview) | staging  | staging | preview     |
| prod     | tag v*.*.\*  | prod     | prod    | production  |

## Secrets GitHub (CI/CD)

### Obrigatórios

```
EAS_TOKEN
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY   # Usar somente em CI/functions, NUNCA no app
ANTHROPIC_API_KEY
GEMINI_API_KEY
SENTRY_DSN
SENTRY_AUTH_TOKEN
```

### Opcionais

```
SUPABASE_ACCESS_TOKEN       # (opcional) para supabase CLI no CI
SUPABASE_PROJECT_REF        # (opcional) para deploy de functions
TURBO_TOKEN                 # (opcional)
TURBO_TEAM                  # (opcional)
CODECOV_TOKEN               # (opcional)
SNYK_TOKEN                  # (opcional)
SENTRY_ORG                  # (opcional)
```

## Secrets Expo EAS (Runtime)

Espelha os secrets que o app mobile consome em runtime:

```
SUPABASE_URL
SUPABASE_ANON_KEY
ANTHROPIC_API_KEY
GEMINI_API_KEY
SENTRY_DSN
```

**IMPORTANTE**: Service Role Key NUNCA deve ser usado no app mobile, apenas em Edge Functions e CI.

## Configuração Local (dev)

Crie `.env.local` na raiz (gitignored) ou em `apps/mobile/.env.local`:

```bash
cp .env.example .env.local
# Edite .env.local com valores reais
```

## Rotação de Secrets

- **Supabase Keys**: Rotacionar a cada 90 dias (boas práticas)
- **API Keys IA**: Monitorar uso, rotacionar se vazamento suspeito
- **EAS Token**: Gerar novo se expirado ou comprometido
- **Sentry DSN**: Rotacionar apenas se projeto recriado

## Como Adicionar Secrets

### GitHub

1. Settings → Secrets and variables → Actions
2. New repository secret
3. Adicionar nome e valor

### Expo EAS

```bash
cd apps/mobile
eas secret:create --name SUPABASE_URL --value "https://..."
eas secret:create --name SUPABASE_ANON_KEY --value "eyJ..."
# ... etc
```

## Validação

Verifique se todos os secrets estão configurados:

```bash
# Local (verificar .env.example)
pnpm run validate:env

# CI (verificar logs do workflow)
# Os workflows devem falhar cedo se secrets faltando
```

