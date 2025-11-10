# 🌍 Matriz de Ambientes e Secrets - Nossa Maternidade

**Última atualização**: 2025-01-XX  
**Versão**: 1.0.0

---

## 📋 Matriz de Ambientes

| Ambiente        | Branch    | URL App     | URL Supabase    | Propósito             | Acesso   |
| --------------- | --------- | ----------- | --------------- | --------------------- | -------- |
| **Development** | `develop` | Local       | Dev Project     | Desenvolvimento local | Devs     |
| **Staging**     | `develop` | EAS Preview | Staging Project | Testes pré-produção   | Time     |
| **Production**  | `main`    | Stores      | Prod Project    | Produção              | Usuários |

---

## 🔑 Inventário de Secrets

### GitHub Secrets

#### Expo (EAS)

| Secret           | Descrição                 | Ambiente | Obrigatório |
| ---------------- | ------------------------- | -------- | ----------- |
| `EXPO_TOKEN`     | Token de autenticação EAS | Todos    | ✅          |
| `EAS_PROJECT_ID` | ID do projeto EAS         | Todos    | ✅          |

#### Supabase

| Secret                      | Descrição                              | Ambiente | Obrigatório |
| --------------------------- | -------------------------------------- | -------- | ----------- |
| `SUPABASE_URL`              | URL do projeto Supabase                | Todos    | ✅          |
| `SUPABASE_ANON_KEY`         | Chave anônima (pública no app)         | Todos    | ✅          |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço (admin, nunca no app) | Todos    | ✅          |
| `SUPABASE_ACCESS_TOKEN`     | Token de acesso Supabase CLI           | Todos    | ✅          |
| `SUPABASE_PROJECT_ID`       | ID do projeto Supabase                 | Todos    | ✅          |

#### Supabase (Staging)

| Secret                      | Descrição                       | Ambiente | Obrigatório |
| --------------------------- | ------------------------------- | -------- | ----------- |
| `SUPABASE_URL_STAGING`      | URL do projeto Supabase Staging | Staging  | ⚠️          |
| `SUPABASE_ANON_KEY_STAGING` | Chave anônima Staging           | Staging  | ⚠️          |

#### Sentry

| Secret              | Descrição                        | Ambiente | Obrigatório |
| ------------------- | -------------------------------- | -------- | ----------- |
| `SENTRY_DSN`        | DSN do Sentry                    | Todos    | ✅          |
| `SENTRY_AUTH_TOKEN` | Token para upload de source maps | Todos    | ✅          |
| `SENTRY_ORG`        | Organização Sentry               | Todos    | ✅          |
| `SENTRY_PROJECT`    | Projeto Sentry                   | Todos    | ✅          |

#### IA (Edge Functions)

| Secret               | Descrição                       | Ambiente | Obrigatório |
| -------------------- | ------------------------------- | -------- | ----------- |
| `GEMINI_API_KEY`     | Chave da API Gemini             | Todos    | ✅          |
| `ANTHROPIC_API_KEY`  | Chave da API Anthropic (Claude) | Todos    | ⚠️          |
| `OPENAI_API_KEY`     | Chave da API OpenAI             | Todos    | ⚠️          |
| `PERPLEXITY_API_KEY` | Chave da API Perplexity         | Todos    | ⚠️          |

#### Analytics

| Secret              | Descrição       | Ambiente | Obrigatório |
| ------------------- | --------------- | -------- | ----------- |
| `AMPLITUDE_API_KEY` | Chave Amplitude | Todos    | ⚠️          |
| `MIXPANEL_TOKEN`    | Token Mixpanel  | Todos    | ⚠️          |

#### Vercel (Preview)

| Secret              | Descrição                | Ambiente | Obrigatório |
| ------------------- | ------------------------ | -------- | ----------- |
| `VERCEL_TOKEN`      | Token Vercel             | Preview  | ⚠️          |
| `VERCEL_ORG_ID`     | ID da organização Vercel | Preview  | ⚠️          |
| `VERCEL_PROJECT_ID` | ID do projeto Vercel     | Preview  | ⚠️          |

#### Turborepo (Remote Cache)

| Secret        | Descrição       | Ambiente | Obrigatório |
| ------------- | --------------- | -------- | ----------- |
| `TURBO_TOKEN` | Token Turborepo | Todos    | ⚠️          |
| `TURBO_TEAM`  | Time Turborepo  | Todos    | ⚠️          |

---

## 📝 Variáveis de Ambiente (.env)

### Development (apps/mobile/.env.local)

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=REDACTED_JWT...

# Sentry
EXPO_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Analytics
EXPO_PUBLIC_AMPLITUDE_API_KEY=xxxxx

# Ambiente
EXPO_PUBLIC_ENV=development
```

### Staging (EAS Preview)

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx-staging.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=REDACTED_JWT...

# Sentry
EXPO_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Analytics
EXPO_PUBLIC_AMPLITUDE_API_KEY=xxxxx

# Ambiente
EXPO_PUBLIC_ENV=staging
```

### Production (EAS Production)

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx-prod.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=REDACTED_JWT...

# Sentry
EXPO_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Analytics
EXPO_PUBLIC_AMPLITUDE_API_KEY=xxxxx

# Ambiente
EXPO_PUBLIC_ENV=production
```

---

## 🔄 Rotação de Secrets (90 dias)

### Processo de Rotação

1. **Gerar novos secrets** (30 dias antes do vencimento)
2. **Atualizar em staging** (testar)
3. **Atualizar em produção** (via CI/CD)
4. **Invalidar secrets antigos** (após 7 dias de janela)

### Checklist de Rotação

- [ ] Gerar novos secrets
- [ ] Atualizar `.env.example`
- [ ] Atualizar GitHub Secrets
- [ ] Atualizar Supabase Secrets
- [ ] Testar em staging
- [ ] Deploy em produção
- [ ] Invalidar secrets antigos

---

## 🔐 Segurança de Secrets

### Regras de Ouro

1. **Nunca** commitar secrets no código
2. **Sempre** usar `.env.example` como template
3. **Sempre** usar variáveis de ambiente em produção
4. **Sempre** rotacionar secrets a cada 90 dias
5. **Nunca** usar `SERVICE_ROLE` no frontend

### Prefixos

- **`EXPO_PUBLIC_`**: Variáveis expostas no frontend (mobile)
- **Sem prefixo**: Variáveis apenas para backend (Edge Functions)

---

## 📋 Checklist de Configuração

### GitHub Secrets

- [ ] `EXPO_TOKEN` configurado
- [ ] `EAS_PROJECT_ID` configurado
- [ ] `SUPABASE_URL` configurado
- [ ] `SUPABASE_ANON_KEY` configurado
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurado
- [ ] `SUPABASE_ACCESS_TOKEN` configurado
- [ ] `SUPABASE_PROJECT_ID` configurado
- [ ] `SENTRY_DSN` configurado
- [ ] `SENTRY_AUTH_TOKEN` configurado
- [ ] `SENTRY_ORG` configurado
- [ ] `SENTRY_PROJECT` configurado
- [ ] `GEMINI_API_KEY` configurado
- [ ] `AMPLITUDE_API_KEY` configurado (opcional)
- [ ] `VERCEL_TOKEN` configurado (opcional)
- [ ] `VERCEL_ORG_ID` configurado (opcional)
- [ ] `VERCEL_PROJECT_ID` configurado (opcional)
- [ ] `TURBO_TOKEN` configurado (opcional)
- [ ] `TURBO_TEAM` configurado (opcional)

### Supabase Secrets (Edge Functions)

- [ ] `GEMINI_API_KEY` configurado
- [ ] `ANTHROPIC_API_KEY` configurado (opcional)
- [ ] `OPENAI_API_KEY` configurado (opcional)
- [ ] `PERPLEXITY_API_KEY` configurado (opcional)

### Local (.env.local)

- [ ] `.env.local` criado (não commitado)
- [ ] Variáveis preenchidas
- [ ] Testado localmente

---

## 📚 Referências

- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Supabase Environment Variables](https://supabase.com/docs/guides/functions/secrets)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)

---

**Última atualização**: 2025-01-XX  
**Mantido por**: Time Nossa Maternidade

