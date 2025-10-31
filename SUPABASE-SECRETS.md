# 🔐 Supabase Edge Functions - Secrets

## Configurar no Supabase Dashboard

Acesse: **Supabase Dashboard > Edge Functions > Secrets**

Adicione as seguintes variáveis de ambiente:

### 1. GEMINI_API_KEY
```
AIzaSyC9YVWRmnGyGu4c9y7g-mNkkipDqb5JBZg
```

**Como configurar:**
1. Acesse Supabase Dashboard
2. Vá em **Edge Functions > Secrets**
3. Clique em **Add Secret**
4. Nome: `GEMINI_API_KEY`
5. Valor: `AIzaSyC9YVWRmnGyGu4c9y7g-mNkkipDqb5JBZg`
6. Salve

---

### 2. SUPABASE_URL (Opcional, já configurado)
```
https://bbcwitnbnosyfpjtzkr.supabase.co
```

---

### 3. SUPABASE_ANON_KEY (Opcional, já configurado)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiY3dpdG5ibm9zeWZwZmp0emtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODI3NjgsImV4cCI6MjA3NTg1ODc2OH0.a9g_JqrWWnLli_PV0sPikz8KPAWiKY81mQ1hJAbNtCo
```

---

## ✅ Checklist

- [ ] GEMINI_API_KEY configurado no Supabase Dashboard
- [ ] Edge Function `nathia-chat` pode acessar a variável

---

**⚠️ IMPORTANTE:** Nunca commite o arquivo `.env.local` no Git!
Ele já está no `.gitignore`.

