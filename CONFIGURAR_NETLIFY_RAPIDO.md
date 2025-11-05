# ⚡ Configurar Netlify Rápido - Nossa Maternidade

## 🚨 URGENTE: Revogar Chaves Antigas Primeiro!

**⚠️ As chaves abaixo foram EXPOSTAS!**

1. **Revogue as chaves antigas imediatamente** (veja `REVOGAR_CHAVES_URGENTE.md`)
2. **Gere novas chaves** em cada plataforma
3. **Configure as novas chaves** no Netlify

## 📋 Variáveis Mínimas para o App Funcionar

### No Netlify Dashboard

Acesse: https://app.netlify.com → Seu site → **Site settings** → **Environment variables**

Adicione estas variáveis:

```
EXPO_PUBLIC_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[SUA-CHAVE-ANON-ATUALIZADA]
```

## 📋 Variáveis Completas (Recomendado)

```
# Supabase (Obrigatório)
EXPO_PUBLIC_SUPABASE_URL=https://bbcwitnbnosyfpfjtzkr.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[SUA-CHAVE-ANON-ATUALIZADA]

# APIs de IA (Opcional - para funcionalidades completas)
EXPO_PUBLIC_GEMINI_API_KEY=[SUA-CHAVE-GEMINI-ATUALIZADA]
EXPO_PUBLIC_CLAUDE_API_KEY=[SUA-CHAVE-CLAUDE-ATUALIZADA]
EXPO_PUBLIC_OPENAI_API_KEY=[SUA-CHAVE-OPENAI-ATUALIZADA]
EXPO_PUBLIC_PERPLEXITY_API_KEY=[SUA-CHAVE-PERPLEXITY-ATUALIZADA]
```

## ✅ Após Configurar

1. Vá em **Deploys** → **Trigger deploy** → **Deploy site**
2. Aguarde o deploy completar
3. Teste o app

## 📝 Notas

- Use `EXPO_PUBLIC_` como prefixo para variáveis expostas no frontend
- Use variáveis sem prefixo apenas para backend (Edge Functions)
- NUNCA exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend

---

**Status:** ⚠️ **Revogue as chaves antigas primeiro!** | ✅ Configure no Netlify
