# 🔐 Configurar .env.local

## ⚠️ IMPORTANTE: Segurança

O arquivo `.env.local` contém **chaves sensíveis** e **NUNCA deve ser commitado**. Ele já está no `.gitignore`.

## 📝 Passos para Configurar

### 1. Criar o arquivo `.env.local`

Crie um arquivo `.env.local` na raiz do projeto (mesmo nível que `package.json`).

### 2. Copiar o template

Use o arquivo `.env.example` como base:

```bash
# No PowerShell
Copy-Item .env.example .env.local
```

### 3. Preencher com suas chaves reais

**IMPORTANTE:** O projeto usa **Expo**, que requer prefixo `EXPO_PUBLIC_*` para variáveis acessíveis no cliente.

### 4. Variáveis Obrigatórias

```bash
# Supabase (público - acessível no cliente)
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon

# Supabase (privado - apenas server-side)
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# APIs de IA (público - se necessário no cliente)
EXPO_PUBLIC_CLAUDE_API_KEY=sua-chave-anthropic
EXPO_PUBLIC_OPENAI_API_KEY=sua-chave-openai
EXPO_PUBLIC_GEMINI_API_KEY=sua-chave-gemini
EXPO_PUBLIC_PERPLEXITY_API_KEY=sua-chave-perplexity

# APIs de IA (privado - apenas server-side)
ANTHROPIC_API_KEY=sua-chave-anthropic
OPENAI_API_KEY=sua-chave-openai
GOOGLE_AI_API_KEY=sua-chave-gemini
PERPLEXITY_API_KEY=sua-chave-perplexity
```

### 5. Exemplo Completo (.env.local)

```bash
# =============================================================================
# NOSSA MATERNIDADE - Environment Variables (.env.local)
# =============================================================================

# ----------------------------------------------------------------------------- 
# SUPABASE - Database & Authentication
# -----------------------------------------------------------------------------
EXPO_PUBLIC_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui

# Redirect URLs
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/onboarding
NEXT_PUBLIC_PROD_SUPABASE_REDIRECT_URL=https://nossamaternidade.netlify.app/onboarding

# ----------------------------------------------------------------------------- 
# ANTHROPIC - Claude AI
# -----------------------------------------------------------------------------
EXPO_PUBLIC_CLAUDE_API_KEY=sua-chave-anthropic-aqui
ANTHROPIC_API_KEY=sua-chave-anthropic-aqui

# ----------------------------------------------------------------------------- 
# OPENAI - GPT-4 / GPT-4o
# -----------------------------------------------------------------------------
EXPO_PUBLIC_OPENAI_API_KEY=sua-chave-openai-aqui
OPENAI_API_KEY=sua-chave-openai-aqui

# ----------------------------------------------------------------------------- 
# GOOGLE AI (Gemini)
# -----------------------------------------------------------------------------
EXPO_PUBLIC_GEMINI_API_KEY=sua-chave-gemini-aqui
GOOGLE_AI_API_KEY=sua-chave-gemini-aqui

# ----------------------------------------------------------------------------- 
# PERPLEXITY - IA de busca contextual
# -----------------------------------------------------------------------------
EXPO_PUBLIC_PERPLEXITY_API_KEY=sua-chave-perplexity-aqui
PERPLEXITY_API_KEY=sua-chave-perplexity-aqui

# ----------------------------------------------------------------------------- 
# CONFIGURAÇÕES DE AMBIENTE
# -----------------------------------------------------------------------------
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ----------------------------------------------------------------------------- 
# FEATURE FLAGS
# -----------------------------------------------------------------------------
EXPO_PUBLIC_ENABLE_AI_FEATURES=true
EXPO_PUBLIC_ENABLE_GAMIFICATION=true
EXPO_PUBLIC_ENABLE_ANALYTICS=false

# ----------------------------------------------------------------------------- 
# RATE LIMITING
# -----------------------------------------------------------------------------
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

## 🔍 Verificar Configuração

Após criar o `.env.local`, verifique se está correto:

```powershell
# Verificar se o arquivo existe
Test-Path .env.local

# Verificar se está no .gitignore (deve retornar True)
Select-String -Path .gitignore -Pattern "\.env\.local"
```

## 📋 Checklist

- [ ] Arquivo `.env.local` criado na raiz do projeto
- [ ] Todas as variáveis obrigatórias preenchidas
- [ ] Variáveis com prefixo `EXPO_PUBLIC_*` para acesso no cliente
- [ ] `SUPABASE_SERVICE_ROLE_KEY` **SEM** prefixo `EXPO_PUBLIC_*`
- [ ] Arquivo `.env.local` está no `.gitignore` (já está)
- [ ] **NUNCA** commitar o arquivo `.env.local`

## 🚀 Próximos Passos

1. Configure as mesmas variáveis no **Netlify Dashboard** para produção
2. Configure as variáveis no **GitHub Secrets** para CI/CD
3. Configure as variáveis no **Supabase Secrets** para Edge Functions

## ⚠️ Segurança

- **NUNCA** exponha `SUPABASE_SERVICE_ROLE_KEY` publicamente
- **NUNCA** commite o arquivo `.env.local`
- **SEMPRE** revogue chaves antigas ao gerar novas
- **SEMPRE** use prefixo `EXPO_PUBLIC_*` apenas para variáveis que precisam ser acessíveis no cliente

