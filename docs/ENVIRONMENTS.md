# Ambientes - Nossa Maternidade

## Matriz de Ambientes

| Ambiente    | URL Supabase            | Expo Profile  | App Store Track | Descrição             |
| ----------- | ----------------------- | ------------- | --------------- | --------------------- |
| **dev**     | `dev-*.supabase.co`     | `development` | -               | Desenvolvimento local |
| **staging** | `staging-*.supabase.co` | `preview`     | `internal`      | Testes e validação    |
| **prod**    | `prod-*.supabase.co`    | `production`  | `production`    | Produção              |

## Inventário de Segredos

### GitHub Secrets

| Secret                  | Ambiente         | Descrição                    |
| ----------------------- | ---------------- | ---------------------------- |
| `EXPO_TOKEN`            | All              | Token do Expo para EAS       |
| `SENTRY_AUTH_TOKEN`     | All              | Token do Sentry              |
| `SENTRY_ORG`            | All              | Organização Sentry           |
| `SENTRY_PROJECT`        | All              | Projeto Sentry               |
| `SUPABASE_ACCESS_TOKEN` | All              | Token do Supabase CLI        |
| `SUPABASE_PROJECT_ID`   | All              | Project ID do Supabase       |
| `SUPABASE_URL`          | dev/staging/prod | URL do Supabase por ambiente |
| `SUPABASE_ANON_KEY`     | dev/staging/prod | Chave anônima por ambiente   |
| `ANTHROPIC_API_KEY`     | All              | Chave Claude API             |
| `GEMINI_API_KEY`        | All              | Chave Gemini API             |

### Supabase Secrets

Configurar no Dashboard → Edge Functions → Secrets:

| Secret                      | Ambiente | Descrição                             |
| --------------------------- | -------- | ------------------------------------- |
| `GEMINI_API_KEY`            | All      | Para nathia-chat e moderation-service |
| `ANTHROPIC_API_KEY`         | All      | Para risk-classifier                  |
| `SUPABASE_SERVICE_ROLE_KEY` | All      | Para todas as Edge Functions          |

## Rotação de Secrets (90 dias)

### Processo

1. **Gerar novos tokens/keys** (30 dias antes do vencimento)
2. **Atualizar em todos os ambientes**
3. **Validar funcionamento** (testar em staging)
4. **Invalidar tokens antigos** (após 7 dias de validação)
5. **Documentar data de rotação** neste arquivo

## Mapeamento GitHub Environments

Configurar em Settings → Environments:

- **dev**: `SUPABASE_URL_DEV`, `SUPABASE_ANON_KEY_DEV`
- **staging**: `SUPABASE_URL_STAGING`, `SUPABASE_ANON_KEY_STAGING`
- **prod**: `SUPABASE_URL_PROD`, `SUPABASE_ANON_KEY_PROD`

## Mapeamento Expo/EAS

Configurar via `eas secret:create`:

```bash
eas secret:create --name EXPO_TOKEN --value <token> --scope project
```

## Checklist

- [ ] GitHub Secrets configurados
- [ ] Expo/EAS Secrets configurados
- [ ] Supabase Secrets configurados
- [ ] `.env.example` atualizado
- [ ] Documentação de rotação atualizada
