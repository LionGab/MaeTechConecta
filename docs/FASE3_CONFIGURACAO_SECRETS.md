# 📋 FASE 3: CONFIGURAÇÃO DE SECRETS

**Tempo estimado:** 1 hora

## 3.1 GitHub Secrets

### Localização

Configurar em: `https://github.com/SEU-USUARIO/nossa-maternidade/settings/secrets/actions`

### Secrets Necessários

#### Expo

```
EXPO_TOKEN=your-expo-token
```

#### Supabase

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ACCESS_TOKEN=your-access-token
SUPABASE_PROJECT_ID=your-project-id
```

#### APIs de IA

```
ANTHROPIC_API_KEY=sk-ant-your-key
OPENAI_API_KEY=sk-proj-your-key (opcional)
GOOGLE_AI_API_KEY=your-gemini-key
```

#### Monitoring (Opcional)

```
SENTRY_DSN=https://your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-token
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-sentry-project
```

#### Security Scanning (Opcional)

```
SNYK_TOKEN=your-snyk-token
```

### Como Obter Tokens

#### Expo Token

1. **Instalar CLI:**

   ```bash
   npm install -g eas-cli
   ```

2. **Login:**

   ```bash
   eas login
   ```

3. **Gerar token:**
   ```bash
   eas build:configure
   ```
   O token será gerado automaticamente e você pode obtê-lo em:
   - https://expo.dev/accounts/[seu-usuario]/settings/access-tokens

#### Supabase Tokens

1. **Acesse:** https://supabase.com/dashboard
2. **Selecione seu projeto**
3. **Settings > API:**
   - **URL:** `SUPABASE_URL`
   - **anon public:** `SUPABASE_ANON_KEY`
   - **service_role:** `SUPABASE_SERVICE_ROLE_KEY`

4. **Settings > Access Tokens:**
   - Clique em **"Generate new token"**
   - Copie o token gerado: `SUPABASE_ACCESS_TOKEN`

5. **Settings > General:**
   - **Reference ID:** `SUPABASE_PROJECT_ID`

#### Anthropic API Key

1. **Acesse:** https://console.anthropic.com/
2. **Vá em:** API Keys
3. **Clique em:** "Create Key"
4. **Copie a chave:** `ANTHROPIC_API_KEY`

#### Google Gemini API Key

1. **Acesse:** https://makersuite.google.com/app/apikey
2. **Faça login** com sua conta Google
3. **Clique em:** "Create API Key"
4. **Copie a chave:** `GOOGLE_AI_API_KEY` ou `GEMINI_API_KEY`

#### OpenAI API Key (Opcional)

1. **Acesse:** https://platform.openai.com/api-keys
2. **Clique em:** "Create new secret key"
3. **Copie a chave:** `OPENAI_API_KEY`

#### Sentry (Opcional)

1. **Acesse:** https://sentry.io/settings/account/api/auth-tokens/
2. **Clique em:** "Create New Token"
3. **Selecione:** scopes `project:read`, `project:releases`, `org:read`
4. **Copie o token:** `SENTRY_AUTH_TOKEN`
5. **Organização e Projeto:** `SENTRY_ORG` e `SENTRY_PROJECT`

### Configuração no GitHub

1. **Acesse:** https://github.com/SEU-USUARIO/nossa-maternidade/settings/secrets/actions
2. **Clique em:** "New repository secret"
3. **Preencha:**
   - **Name:** Nome do secret (ex: `EXPO_TOKEN`)
   - **Secret:** Valor do secret
4. **Clique em:** "Add secret"
5. **Repita para todos os secrets necessários**

### Checklist GitHub Secrets

- [ ] `EXPO_TOKEN` configurado
- [ ] `SUPABASE_URL` configurado
- [ ] `SUPABASE_ANON_KEY` configurado
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurado
- [ ] `SUPABASE_ACCESS_TOKEN` configurado
- [ ] `SUPABASE_PROJECT_ID` configurado
- [ ] `ANTHROPIC_API_KEY` configurado
- [ ] `GOOGLE_AI_API_KEY` ou `GEMINI_API_KEY` configurado
- [ ] `OPENAI_API_KEY` configurado (se necessário)
- [ ] `SENTRY_AUTH_TOKEN` configurado (opcional)
- [ ] `SENTRY_ORG` configurado (opcional)
- [ ] `SENTRY_PROJECT` configurado (opcional)
- [ ] Todos os secrets protegidos (não commitados no código)

---

## 3.2 Supabase Secrets

### Método 1: Via CLI (Recomendado)

Use os scripts fornecidos:

**Linux/macOS:**

```bash
chmod +x scripts/setup-secrets.sh
./scripts/setup-secrets.sh
```

**Windows (PowerShell):**

```powershell
.\scripts\setup-secrets.ps1
```

### Método 2: Via CLI Manual

```bash
# Configurar secrets nas Edge Functions
supabase secrets set GEMINI_API_KEY=your-gemini-key
supabase secrets set ANTHROPIC_API_KEY=sk-ant-your-key
supabase secrets set OPENAI_API_KEY=sk-proj-your-key

# Verificar
supabase secrets list
```

### Método 3: Via Dashboard

1. **Acesse:** https://supabase.com/dashboard
2. **Selecione seu projeto**
3. **Vá em:** Edge Functions > Secrets
4. **Clique em:** "Add Secret"
5. **Preencha:**
   - **Name:** Nome do secret (ex: `GEMINI_API_KEY`)
   - **Value:** Valor do secret
6. **Clique em:** "Save"
7. **Repita para todos os secrets necessários**

### Secrets Necessários no Supabase

| Secret              | Uso                                                | Obrigatório          |
| ------------------- | -------------------------------------------------- | -------------------- |
| `GEMINI_API_KEY`    | nathia-chat, moderation-service, behavior-analysis | ✅                   |
| `ANTHROPIC_API_KEY` | nat-ai-chat, risk-classifier                       | ✅                   |
| `OPENAI_API_KEY`    | transcribe-audio                                   | ⚠️ Opcional          |
| `SUPABASE_URL`      | Todas as Edge Functions                            | ✅ (geralmente auto) |
| `SUPABASE_ANON_KEY` | Todas as Edge Functions                            | ✅ (geralmente auto) |

### Verificar Secrets Configurados

```bash
# Listar todos os secrets
supabase secrets list

# Ou usar o script de validação
./scripts/validate-secrets.sh
```

### Checklist Supabase Secrets

- [ ] `GEMINI_API_KEY` configurado
- [ ] `ANTHROPIC_API_KEY` configurado
- [ ] `OPENAI_API_KEY` configurado (se necessário)
- [ ] `SUPABASE_URL` configurado (geralmente automático)
- [ ] `SUPABASE_ANON_KEY` configurado (geralmente automático)
- [ ] Secrets acessíveis pelas Edge Functions
- [ ] Edge Functions testadas e funcionando

---

## 3.3 Validação Completa

### Script de Validação

Execute o script de validação para verificar se tudo está configurado:

```bash
# Linux/macOS
chmod +x scripts/validate-secrets.sh
./scripts/validate-secrets.sh
```

### Validação Manual

1. **GitHub Secrets:**
   - Acesse: https://github.com/SEU-USUARIO/nossa-maternidade/settings/secrets/actions
   - Verifique se todos os secrets estão listados

2. **Supabase Secrets:**

   ```bash
   supabase secrets list
   ```

   - Verifique se todos os secrets necessários estão presentes

3. **Testar Edge Functions:**
   ```bash
   # Testar uma Edge Function
   curl -X POST https://your-project.supabase.co/functions/v1/nathia-chat \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{"message": "teste"}'
   ```

### Checklist Final

- [ ] Todos os secrets do GitHub configurados
- [ ] Todos os secrets do Supabase configurados
- [ ] Expo token válido
- [ ] Supabase credentials corretas
- [ ] APIs de IA configuradas
- [ ] Secrets protegidos (não commitados)
- [ ] Edge Functions testadas e funcionando
- [ ] Validação completa executada

---

## 3.4 Troubleshooting

### Erro: "Secret not found"

**Problema:** Edge Function não consegue acessar o secret.

**Solução:**

1. Verifique se o secret está configurado: `supabase secrets list`
2. Verifique se o nome do secret está correto (case-sensitive)
3. Faça redeploy da Edge Function: `supabase functions deploy function-name`

### Erro: "Invalid API Key"

**Problema:** API Key inválida ou expirada.

**Solução:**

1. Gere uma nova API Key no provider (Anthropic, Google, OpenAI)
2. Atualize o secret: `supabase secrets set SECRET_NAME=new-key`
3. Teste novamente

### Erro: "Expo token invalid"

**Problema:** Token do Expo inválido ou expirado.

**Solução:**

1. Gere um novo token: https://expo.dev/accounts/[usuario]/settings/access-tokens
2. Atualize o secret no GitHub: Settings > Secrets > EXPO_TOKEN
3. Teste novamente

### Erro: "Supabase access token invalid"

**Problema:** Token do Supabase CLI inválido.

**Solução:**

1. Gere um novo token: https://supabase.com/dashboard/account/tokens
2. Atualize o secret no GitHub: Settings > Secrets > SUPABASE_ACCESS_TOKEN
3. Teste novamente

---

## 3.5 Próximos Passos

Após configurar todos os secrets:

1. ✅ **Fase 3 completa** - Configuração de Secrets
2. ➡️ **Fase 4** - Configuração de CI/CD
3. ➡️ **Fase 5** - Testes e Validação

---

**Última atualização:** 2025-01-04
