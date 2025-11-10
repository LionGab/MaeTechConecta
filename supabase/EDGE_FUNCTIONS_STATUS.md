# Status das Edge Functions

## Status Geral

✅ **Edge Functions deployadas e configuradas**

## Edge Functions Deployadas

### 1. nathia-chat

- **Status:** ✅ ACTIVE
- **Versão:** 1
- **ID:** fcd18f99-5140-49a0-b1d6-a1a77d5debdf
- **Última atualização:** 2025-11-06 09:00:38 UTC
- **Descrição:** Chat com Gemini 2.0 Flash para acolhimento emocional
- **Arquivo:** `supabase/functions/nathia-chat/index.ts`

### 2. moderation-service

- **Status:** ✅ ACTIVE
- **Versão:** 1
- **ID:** 9ac0fe68-c40b-45a1-a5fb-2945d620b910
- **Última atualização:** 2025-11-06 09:00:39 UTC
- **Descrição:** Moderação 3 camadas de conteúdo
- **Arquivo:** `supabase/functions/moderation-service/index.ts`

## Edge Functions Disponíveis (não deployadas)

### 3. behavior-analysis

- **Arquivo:** `supabase/functions/behavior-analysis/index.ts`
- **Status:** ⏳ Não deployada
- **Descrição:** Análise de comportamento do usuário

### 4. risk-REDACTED

- **Arquivo:** `supabase/functions/risk-REDACTED/index.ts`
- **Status:** ⏳ Não deployada
- **Descrição:** Classificação de risco

### 5. lgpd-requests

- **Arquivo:** `supabase/functions/lgpd-requests/index.ts`
- **Status:** ⏳ Não deployada
- **Descrição:** Requisições LGPD (exportar/deletar dados)

### 6. transcribe-audio

- **Arquivo:** `supabase/functions/transcribe-audio/index.ts`
- **Status:** ⏳ Não deployada
- **Descrição:** Transcrição de áudio

### 7. nat-ai-chat

- **Arquivo:** `supabase/functions/nat-ai-chat/index.ts`
- **Status:** ⏳ Não deployada
- **Descrição:** Chat alternativo com NAT-AI

## Secrets Configurados

✅ **Todos os secrets necessários estão configurados:**

1. **GEMINI_API_KEY** ✅
   - Usado por: `nathia-chat`
   - Status: Configurado

2. **SUPABASE_URL** ✅
   - Usado por: Todas as Edge Functions
   - Status: Configurado

3. **SUPABASE_ANON_KEY** ✅
   - Usado por: Todas as Edge Functions
   - Status: Configurado

4. **SUPABASE_SERVICE_ROLE_KEY** ✅
   - Usado por: Edge Functions que precisam de acesso admin
   - Status: Configurado

5. **SUPABASE_DB_URL** ✅
   - Usado por: Edge Functions que acessam o banco diretamente
   - Status: Configurado

## Comandos Úteis

### Listar Edge Functions

```bash
supabase functions list
```

### Deploy Edge Function

```bash
supabase functions deploy nathia-chat
```

### Ver Logs

```bash
supabase functions logs nathia-chat
```

### Listar Secrets

```bash
supabase secrets list
```

### Configurar Secret

```bash
supabase secrets set GEMINI_API_KEY=your_key_here
```

## Próximos Passos

1. ✅ Edge Functions principais deployadas
2. ✅ Secrets configurados
3. ⏳ Testar Edge Functions via app
4. ⏳ Deployar Edge Functions adicionais se necessário

## Notas

- As Edge Functions principais (`nathia-chat` e `moderation-service`) estão prontas para uso
- O secret `GEMINI_API_KEY` está configurado e funcionando
- Para deployar outras Edge Functions, use: `supabase functions deploy <function-name>`

