# 🚀 MVP ULTRATHIN - Deploy Hoje

**Tempo estimado:** 2-3 horas  
**Objetivo:** App funcionando no ar hoje

---

## ✅ CHECKLIST RÁPIDO

- [ ] 1. Variáveis de ambiente configuradas (10min)
- [ ] 2. Supabase migrations aplicadas (5min)
- [ ] 3. Edge Functions deployadas (15min)
- [ ] 4. Build EAS Preview (30min)
- [ ] 5. Teste no dispositivo (10min)

**Total:** ~70 minutos

---

## PASSO 1: Variáveis de Ambiente (10min)

### 1.1 Criar `.env.local` na raiz

```powershell
# Na raiz do projeto
@"
# Supabase (OBRIGATÓRIO)
EXPO_PUBLIC_SUPABASE_URL=https://mnszbkeuerjcevjvdqme.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY_AQUI

# Gemini AI (OBRIGATÓRIO para chat funcionar)
EXPO_PUBLIC_GEMINI_API_KEY=SUA_GEMINI_KEY_AQUI

# Opcional - Sentry (monitoramento)
EXPO_PUBLIC_SENTRY_DSN=SUA_SENTRY_DSN_AQUI
"@ | Out-File -FilePath .env.local -Encoding utf8
```

### 1.2 Obter credenciais

**Supabase:**

1. Acesse: https://supabase.com/dashboard/project/mnszbkeuerjcevjvdqme
2. Settings → API
3. Copie:
   - Project URL → `EXPO_PUBLIC_SUPABASE_URL`
   - anon/public key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

**Gemini API Key:**

1. Acesse: https://makersuite.google.com/app/apikey
2. Crie nova key
3. Cole em `EXPO_PUBLIC_GEMINI_API_KEY`

### 1.3 Verificar arquivo criado

```powershell
Get-Content .env.local
```

**Deve mostrar:** 3 variáveis preenchidas ✓

---

## PASSO 2: Supabase Migrations (5min)

### 2.1 Verificar conexão Supabase

```powershell
supabase status
```

**Se não conectado:**

```powershell
supabase link --project-ref mnszbkeuerjcevjvdqme
```

### 2.2 Aplicar migrations

```powershell
supabase db push
```

**Aguarde:** Todas as migrations aplicadas ✓

### 2.3 Verificar extensões (SQL Editor no Supabase)

```sql
SELECT extname FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto');
```

**Deve retornar:** 2 linhas (uuid-ossp e pgcrypto)

**Se faltar:** Dashboard → Database → Extensions → Enable

---

## PASSO 3: Edge Functions (15min)

### 3.1 Configurar secrets no Supabase

```powershell
# Gemini (OBRIGATÓRIO)
supabase secrets set GEMINI_API_KEY="SUA_GEMINI_KEY_AQUI"

# Provider ativo
supabase secrets set LLM_PROVIDER="gemini"
```

### 3.2 Deploy functions essenciais

```powershell
# Chat com IA (OBRIGATÓRIO)
supabase functions deploy nathia-chat

# Dica diária (OBRIGATÓRIO)
supabase functions deploy personalize-tip

# Curadoria (OPCIONAL - pode pular se não tiver Perplexity)
supabase functions deploy curate-articles
```

**Aguarde:** Cada function deve mostrar "Function deployed successfully!" ✓

### 3.3 Testar function (opcional)

```powershell
curl -X POST https://mnszbkeuerjcevjvdqme.supabase.co/functions/v1/nathia-chat `
  -H "Authorization: Bearer SUA_ANON_KEY" `
  -H "Content-Type: application/json" `
  -d '{\"userId\":\"test\",\"message\":\"Olá\"}'
```

**Deve retornar:** `{"response":"..."}` ✓

---

## PASSO 4: Build EAS Preview (30min)

### 4.1 Instalar EAS CLI (se não tiver)

```powershell
npm install -g eas-cli
```

### 4.2 Login no EAS

```powershell
eas login
```

**Use:** Conta Expo/EAS

### 4.3 Configurar projeto EAS

```powershell
cd apps/mobile
eas build:configure
```

**Escolha:** "Use existing configuration" (já tem eas.json)

### 4.4 Build Preview Android

```powershell
eas build --platform android --profile preview
```

**Aguarde:** Build iniciado (pode levar 15-30min)

**Status:** Você receberá link para acompanhar

### 4.5 Build Preview iOS (opcional - se tiver Mac)

```powershell
eas build --platform ios --profile preview
```

---

## PASSO 5: Teste no Dispositivo (10min)

### 5.1 Instalar app no Android

**Opção A - QR Code:**

1. Após build concluir, escaneie QR code
2. Instale APK no dispositivo

**Opção B - Link direto:**

1. Acesse link do build no navegador
2. Baixe APK
3. Instale no dispositivo

### 5.2 Testar fluxo crítico

1. ✅ App abre sem travar
2. ✅ Onboarding aparece (primeira vez)
3. ✅ Home carrega com dica do dia
4. ✅ NathIA Chat responde mensagens
5. ✅ Hábitos aparecem na tela

**Se algo falhar:** Ver logs no console do Expo

---

## 🐛 TROUBLESHOOTING RÁPIDO

### Erro: "Missing environment variables"

**Solução:**

```powershell
# Verificar se .env.local existe
Test-Path .env.local

# Se não existir, criar novamente (Passo 1)
```

### Erro: "Function not found"

**Solução:**

```powershell
# Verificar functions deployadas
supabase functions list

# Redeploy se necessário
supabase functions deploy nathia-chat
```

### Erro: "Build failed"

**Solução:**

```powershell
# Limpar cache
cd apps/mobile
pnpm clean:all

# Tentar build novamente
eas build --platform android --profile preview --clear-cache
```

### App não conecta ao Supabase

**Solução:**

1. Verificar `.env.local` tem `EXPO_PUBLIC_` prefix
2. Reiniciar Metro bundler: `pnpm dev --clear`
3. Verificar URL do Supabase está correta

---

## ✅ VALIDAÇÃO FINAL

Execute antes de considerar MVP pronto:

```powershell
# Type check
pnpm typecheck

# Lint (pode ter warnings, mas não erros críticos)
pnpm lint

# Testes básicos
pnpm test:unit
```

**Se passar:** MVP pronto! 🎉

---

## 📱 PRÓXIMOS PASSOS (Pós-MVP)

1. **Deploy para lojas** (Play Store / App Store)
2. **Configurar Sentry** (monitoramento de erros)
3. **Otimizações de performance**
4. **Testes E2E completos**

---

## 🎯 MVP MÍNIMO FUNCIONAL

**O que funciona:**

- ✅ Onboarding básico
- ✅ Home com dica do dia
- ✅ Chat NathIA (Gemini)
- ✅ Hábitos básicos
- ✅ Feed MundoNath (se tiver conteúdo)

**O que NÃO funciona (pode deixar para depois):**

- ❌ Curadoria MãeValente (precisa Perplexity)
- ❌ Gamificação completa
- ❌ Notificações push
- ❌ Pagamentos/Stripe

---

**Tempo total:** ~70 minutos  
**Status:** ☐ Completo
