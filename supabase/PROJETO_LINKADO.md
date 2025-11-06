# Projeto Supabase Linkado

## Status
✅ **Projeto linkado com sucesso**

## Informações do Projeto
- **Project Ref:** `mnszbkeuerjcevjvdqme`
- **URL:** https://mnszbkeuerjcevjvdqme.supabase.co
- **Status:** Linkado via Supabase CLI

## Arquivos Exportados

### 1. Tipos TypeScript
- **Localização:** `apps/mobile/supabase/types.ts`
- **Gerado via:** `supabase gen types typescript --linked`
- **Uso:** Tipos TypeScript para todas as tabelas do banco

### 2. Migrations
- **Pasta:** `supabase/migrations/`
- **Migrations disponíveis:**
  - `001_gemini_memory.sql` - Tabela conversations com embeddings
  - `002_alert_logs.sql` - Sistema de logs de alertas
  - `20250104_rate_limiting_event_based.sql` - Rate limiting
  - `20250106_000000_consolidated_schema.sql` - Schema consolidado

### 3. Edge Functions
- **Pasta:** `supabase/functions/`
- **Functions disponíveis:**
  - `nathia-chat` - Chat com Gemini 2.0 Flash
  - `moderation-service` - Moderação 3 camadas
  - `behavior-analysis` - Análise de comportamento
  - `risk-classifier` - Classificação de risco
  - `lgpd-requests` - Requisições LGPD
  - `transcribe-audio` - Transcrição de áudio

## Comandos Úteis

### Verificar Status
```bash
supabase status
```

### Listar Projetos
```bash
supabase projects list
```

### Gerar Tipos TypeScript
```bash
supabase gen types typescript --linked > supabase/types.ts
```

### Deploy Edge Function
```bash
supabase functions deploy nathia-chat
```

### Ver Logs
```bash
supabase functions logs nathia-chat
```

## Próximos Passos

1. ✅ Projeto linkado
2. ⏳ Executar SQL Migration (`001_gemini_memory.sql`)
3. ⏳ Deploy Edge Functions
4. ⏳ Configurar Secrets (GEMINI_API_KEY)

## Notas

- O projeto está linkado ao Supabase remoto
- Para desenvolvimento local, é necessário Docker Desktop
- Para produção, use o Supabase Dashboard ou CLI com projeto linkado

