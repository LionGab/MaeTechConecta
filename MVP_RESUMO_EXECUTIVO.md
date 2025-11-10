# 🚀 MVP ULTRATHIN - RESUMO EXECUTIVO

**Objetivo:** Colocar app no ar HOJE  
**Tempo:** 70 minutos  
**Complexidade:** Baixa

---

## ⚡ EXECUÇÃO RÁPIDA (1 comando)

```powershell
.\scripts\deploy-mvp-completo.ps1
```

**OU execute manualmente:**

---

## 📋 CHECKLIST MANUAL (5 passos)

### ✅ PASSO 1: Variáveis de Ambiente (10min)

```powershell
.\scripts\setup-mvp-ultrathin.ps1
# Edite .env.local e preencha as keys
```

**O que precisa:**
- Supabase URL + Anon Key (Dashboard → Settings → API)
- Gemini API Key (https://makersuite.google.com/app/apikey)

---

### ✅ PASSO 2: Migrations (5min)

```powershell
supabase link --project-ref mnszbkeuerjcevjvdqme
supabase db push
```

**Verificar:** Extensões `uuid-ossp` e `pgcrypto` habilitadas

---

### ✅ PASSO 3: Edge Functions (15min)

```powershell
.\scripts\deploy-edge-functions.ps1
```

**OU manualmente:**
```powershell
supabase secrets set GEMINI_API_KEY="SUA_KEY"
supabase secrets set LLM_PROVIDER="gemini"
supabase functions deploy nathia-chat
supabase functions deploy personalize-tip
```

---

### ✅ PASSO 4: Validação (5min)

```powershell
pnpm typecheck
pnpm lint
```

**Aceitar:** Warnings são OK, erros críticos não

---

### ✅ PASSO 5: Build EAS (30min)

```powershell
.\scripts\build-eas-preview.ps1
```

**OU manualmente:**
```powershell
cd apps/mobile
eas login
eas build --platform android --profile preview
```

---

## 🎯 O QUE FUNCIONA NO MVP

✅ Onboarding básico  
✅ Home com dica do dia  
✅ Chat NathIA (Gemini)  
✅ Hábitos básicos  
✅ Feed MundoNath  

---

## ❌ O QUE NÃO FUNCIONA (deixar para depois)

❌ Curadoria MãeValente (precisa Perplexity)  
❌ Gamificação completa  
❌ Notificações push  
❌ Pagamentos  

---

## 🐛 PROBLEMAS COMUNS

**Erro: "Missing environment variables"**
→ Verificar `.env.local` existe e tem `EXPO_PUBLIC_` prefix

**Erro: "Function not found"**
→ Redeploy: `supabase functions deploy nathia-chat`

**Erro: "Build failed"**
→ Limpar cache: `cd apps/mobile && pnpm clean:all`

---

## 📱 TESTE FINAL

1. Instalar APK no dispositivo
2. Abrir app
3. Completar onboarding
4. Testar chat: "Olá"
5. Verificar dica do dia aparece

**Se tudo funcionar:** MVP pronto! 🎉

---

**Guia completo:** `MVP_ULTRATHIN_DEPLOY_HOJE.md`

