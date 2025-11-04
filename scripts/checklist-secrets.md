# ✅ Checklist de Configuração de Secrets

## 📋 GitHub Secrets

### Expo

- [ ] `EXPO_TOKEN` - Token do Expo/EAS
  - Obter em: https://expo.dev/accounts/[usuario]/settings/access-tokens
  - Ou via: `eas login` e `eas build:configure`

### Supabase

- [ ] `SUPABASE_URL` - URL do projeto Supabase
  - Obter em: Dashboard > Settings > API > Project URL
- [ ] `SUPABASE_ANON_KEY` - Chave anônima pública
  - Obter em: Dashboard > Settings > API > anon public
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Chave service_role (privada)
  - Obter em: Dashboard > Settings > API > service_role
  - ⚠️ **NUNCA exponha publicamente**
- [ ] `SUPABASE_ACCESS_TOKEN` - Token de acesso do CLI
  - Obter em: Dashboard > Settings > Access Tokens > Generate new token
- [ ] `SUPABASE_PROJECT_ID` - ID do projeto (Reference ID)
  - Obter em: Dashboard > Settings > General > Reference ID

### APIs de IA

- [ ] `ANTHROPIC_API_KEY` - Chave Claude API
  - Obter em: https://console.anthropic.com/ > API Keys > Create Key
  - Formato: `sk-ant-...`
- [ ] `GOOGLE_AI_API_KEY` ou `GEMINI_API_KEY` - Chave Gemini API
  - Obter em: https://makersuite.google.com/app/apikey > Create API Key
  - Formato: `AIza...`
- [ ] `OPENAI_API_KEY` - Chave OpenAI API (opcional)
  - Obter em: https://platform.openai.com/api-keys > Create new secret key
  - Formato: `sk-proj-...`

### Monitoring (Opcional)

- [ ] `SENTRY_DSN` - DSN do Sentry
  - Obter em: Sentry > Settings > Projects > [projeto] > Client Keys (DSN)
- [ ] `SENTRY_AUTH_TOKEN` - Token de autenticação do Sentry
  - Obter em: https://sentry.io/settings/account/api/auth-tokens/ > Create New Token
  - Scopes: `project:read`, `project:releases`, `org:read`
- [ ] `SENTRY_ORG` - Slug da organização Sentry
  - Obter em: Sentry > Settings > Organization Settings
- [ ] `SENTRY_PROJECT` - Slug do projeto Sentry
  - Obter em: Sentry > Settings > Projects > [projeto]

### Security Scanning (Opcional)

- [ ] `SNYK_TOKEN` - Token do Snyk
  - Obter em: https://app.snyk.io/account > API Tokens

---

## 📋 Supabase Secrets

### APIs de IA

- [ ] `GEMINI_API_KEY` - Chave Gemini API
  - Usado em: `nathia-chat`, `moderation-service`, `behavior-analysis`
  - Configurar via: `supabase secrets set GEMINI_API_KEY=your-key`
- [ ] `ANTHROPIC_API_KEY` - Chave Claude API
  - Usado em: `nat-ai-chat`, `risk-classifier`
  - Configurar via: `supabase secrets set ANTHROPIC_API_KEY=sk-ant-your-key`
- [ ] `OPENAI_API_KEY` - Chave OpenAI API (opcional)
  - Usado em: `transcribe-audio`
  - Configurar via: `supabase secrets set OPENAI_API_KEY=sk-proj-your-key`

### Supabase (geralmente automático)

- [ ] `SUPABASE_URL` - URL do projeto
  - Geralmente configurado automaticamente
  - Verificar: `supabase secrets list`
- [ ] `SUPABASE_ANON_KEY` - Chave anônima
  - Geralmente configurado automaticamente
  - Verificar: `supabase secrets list`

---

## 🔍 Validação

### Verificar GitHub Secrets

- [ ] Acessar: https://github.com/SEU-USUARIO/nossa-maternidade/settings/secrets/actions
- [ ] Verificar se todos os secrets necessários estão presentes
- [ ] Verificar se não há secrets expostos no código

### Verificar Supabase Secrets

- [ ] Executar: `supabase secrets list`
- [ ] Verificar se todos os secrets necessários estão presentes
- [ ] Testar Edge Functions para garantir acesso aos secrets

### Testar Edge Functions

- [ ] Testar `nathia-chat` - Verificar se acessa `GEMINI_API_KEY`
- [ ] Testar `nat-ai-chat` - Verificar se acessa `ANTHROPIC_API_KEY`
- [ ] Testar `moderation-service` - Verificar se acessa `GEMINI_API_KEY`
- [ ] Testar `risk-classifier` - Verificar se acessa `ANTHROPIC_API_KEY`
- [ ] Testar `transcribe-audio` - Verificar se acessa `OPENAI_API_KEY` (se configurado)

---

## 📝 Notas

### Segurança

- ⚠️ **NUNCA** commite secrets no código
- ⚠️ **NUNCA** exponha `SUPABASE_SERVICE_ROLE_KEY` publicamente
- ✅ Use sempre GitHub Secrets para CI/CD
- ✅ Use sempre Supabase Secrets para Edge Functions
- ✅ Rotacione secrets a cada 90 dias

### Rotação de Secrets

- Data última rotação: **\*\***\_\_\_**\*\***
- Próxima rotação: **\*\***\_\_\_**\*\***
- Responsável: **\*\***\_\_\_**\*\***

---

**Status:** ⬜ Não iniciado | 🟡 Em progresso | ✅ Completo

**Data de conclusão:** **\*\***\_\_\_**\*\***

**Responsável:** **\*\***\_\_\_**\*\***
