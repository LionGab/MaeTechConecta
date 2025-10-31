# 🔐 Configuração de Chaves de API - Nossa Maternidade

## ✅ Arquivo .env.local Criado

O arquivo `.env.local` foi criado com as seguintes chaves:

### Supabase
- ✅ EXPO_PUBLIC_SUPABASE_URL
- ✅ EXPO_PUBLIC_SUPABASE_ANON_KEY

### APIs de IA
- ✅ EXPO_PUBLIC_GEMINI_API_KEY
- ✅ EXPO_PUBLIC_CLAUDE_API_KEY
- ✅ EXPO_PUBLIC_OPENAI_API_KEY
- ✅ EXPO_PUBLIC_PERPLEXITY_API_KEY

---

## 🔐 Configurar Secrets no Supabase (Edge Functions)

**IMPORTANTE:** A Edge Function `nathia-chat` precisa da chave do Gemini configurada no Supabase Dashboard.

### Passo a Passo:

1. **Acesse Supabase Dashboard:**
   - URL: https://supabase.com/dashboard
   - Projeto: `bbcwitnbnosyfpjtzkr`

2. **Vá em Edge Functions:**
   - Menu lateral → **Edge Functions**
   - Clique em **Secrets** ou **Manage Secrets**

3. **Adicione o Secret:**
   ```
   Nome: GEMINI_API_KEY
   Valor: AIzaSyC9YVWRmnGyGu4c9y7g-mNkkipDqb5JBZg
   ```

4. **Salve**

---

## 📋 Chaves Configuradas

### ✅ Frontend (.env.local)
- Supabase URL e Anon Key ✅
- Gemini API Key ✅
- Claude API Key ✅
- OpenAI API Key ✅
- Perplexity API Key ✅

### ⚠️ Pendente: Backend (Supabase Secrets)
- [ ] GEMINI_API_KEY (configurar no Supabase Dashboard)

---

## 🚀 Próximos Passos

1. **Configurar GEMINI_API_KEY no Supabase:**
   - Dashboard → Edge Functions → Secrets
   - Adicionar: `GEMINI_API_KEY`

2. **Executar Schema SQL:**
   - Dashboard → SQL Editor
   - Executar: `supabase/schema-nossa-maternidade-completo.sql`

3. **Deploy Edge Function:**
   ```bash
   supabase functions deploy nathia-chat
   ```

4. **Testar:**
   ```bash
   npm start
   ```

---

## ✅ Checklist Final

- [x] `.env.local` criado com todas as chaves
- [ ] GEMINI_API_KEY configurado no Supabase (fazer manualmente)
- [ ] Schema SQL executado no Supabase (fazer manualmente)
- [ ] Edge Function `nathia-chat` deployada (fazer manualmente)

---

**⚠️ IMPORTANTE:** O arquivo `.env.local` está no `.gitignore` e NÃO será commitado no Git.

