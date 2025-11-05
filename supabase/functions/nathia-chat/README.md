# NathIA Chat - Edge Function

Edge Function para chat com NathIA usando Gemini 2.0 Flash.

## 📋 Configuração

### 1. Variáveis de Ambiente

Configure no Supabase Dashboard:

**Settings → Edge Functions → Secrets**

```
GEMINI_API_KEY=sua-chave-api-gemini-aqui
```

### 2. Obter API Key do Gemini

1. Acesse: https://makersuite.google.com/app/apikey
2. Crie uma API Key
3. Copie e cole no Supabase Dashboard

## 🚀 Deploy

```bash
# No terminal, dentro da pasta do projeto
supabase functions deploy nathia-chat
```

## 📝 Uso

### Request

```typescript
POST /functions/v1/nathia-chat
Headers:
  Authorization: Bearer <supabase-token>
  Content-Type: application/json
Body:
{
  "message": "Oi NathIA, estou me sentindo ansiosa hoje..."
}
```

### Response

```json
{
  "response": "Olá! Entendo sua ansiedade...",
  "rateLimit": {
    "remaining": 29
  }
}
```

## ⚙️ Funcionalidades

- ✅ Auth check (Supabase)
- ✅ Rate limiting (30 req/min por usuário)
- ✅ Busca contexto (últimas 20 mensagens + perfil)
- ✅ Integração Gemini 2.0 Flash
- ✅ Salvamento automático no Supabase
- ✅ Prompt system completo (PT-BR, empático)

## 🔒 Segurança

- Row Level Security (RLS) ativado
- Auth token obrigatório
- Rate limiting por usuário
- Safety settings do Gemini configurados

## 📊 Configuração Gemini

```typescript
{
  model: "gemini-2.0-flash-exp",
  temperature: 0.7,
  maxOutputTokens: 300,
  safetySettings: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_LOW_AND_ABOVE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_LOW_AND_ABOVE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
  ]
}
```

## 🎯 Prompt System

O prompt system está documentado em: `prompts/nat-ia-prompt-system.md`

Características:

- Acolhimento emocional puro
- NUNCA orientações médicas
- Tom empático e brasileiro (PT-BR coloquial)
- Contexto das últimas 20 mensagens + perfil da usuária

## ✅ Checklist

- [x] Edge Function criada
- [x] Gemini 2.0 Flash integrado
- [x] Rate limiting configurado
- [x] Auth check implementado
- [x] Busca de contexto funcional
- [x] Salvamento no Supabase
- [x] Prompt system documentado
- [ ] Variável GEMINI_API_KEY configurada (fazer manualmente)
