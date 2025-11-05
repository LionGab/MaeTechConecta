# 🔐 Supabase Edge Functions - Secrets

## Configurar no Supabase Dashboard

Acesse: **Supabase Dashboard > Edge Functions > Secrets**

Adicione as seguintes variáveis de ambiente:

### 1. GEMINI_API_KEY

**Como obter:**
1. Acesse: https://aistudio.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada

**Como configurar:**

1. Acesse Supabase Dashboard
2. Vá em **Edge Functions > Secrets**
3. Clique em **Add Secret**
4. Nome: `GEMINI_API_KEY`
5. Valor: `your-gemini-api-key-here` (cole a chave obtida acima)
6. Salve

---

### 2. SUPABASE_URL (Opcional, já configurado)

```
https://bbcwitnbnosyfpjtzkr.supabase.co
```

---

### 3. SUPABASE_ANON_KEY (Opcional, já configurado)

**Como obter:**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings > API**
4. Copie a chave **anon public**

**Nota:** A chave anon é pública e pode ser usada no frontend, mas ainda assim é recomendado não commitá-la diretamente.

---

## ✅ Checklist

- [ ] GEMINI_API_KEY configurado no Supabase Dashboard
- [ ] Edge Function `nathia-chat` pode acessar a variável

---

**⚠️ IMPORTANTE:** Nunca commite o arquivo `.env.local` no Git!
Ele já está no `.gitignore`.
