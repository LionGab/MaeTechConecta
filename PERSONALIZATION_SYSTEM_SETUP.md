# Sistema de Personalização Inteligente - Setup Completo

> **Status:** ✅ Implementação completa
> **Data:** 11 de Janeiro de 2025
> **Versão:** 1.0.0

## Visão Geral

Sistema de personalização inteligente que cria **planos diários** personalizados para cada usuária com base em:
- **Eventos comportamentais** (últimos 14 dias)
- **Análise semântica** com Gemini 2.0 Flash
- **Curadoria de conteúdo** com Perplexity API
- **Mensagens personalizadas** com Claude Sonnet 4
- **Policy Engine** (regras determinísticas)

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        React Native App                     │
│  (HomeScreen, PlanoDoDia, PorQueIssoModal, usePlanoDoDia)  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   Edge Functions (Supabase)                  │
│  • ingest-event: Grava eventos                               │
│  • build-signals: Analisa últimos 14 dias → Gemini          │
│  • curate-content: Busca conteúdo → Perplexity              │
│  • compose-copy: Personaliza mensagens → Claude             │
│  • plan-daily: Orquestra todo o fluxo (JOB PRINCIPAL)       │
│  • dispatch-plan: Envia push notifications                   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   Supabase (PostgreSQL)                      │
│  • 8 novas tabelas: events, signals, content_catalog,       │
│    message_templates, message_plan, message_deliveries,     │
│    experiments, alert_history                                │
│  • pg_cron: 2 jobs agendados                                 │
└──────────────────────────────────────────────────────────────┘
```

## 📋 Pré-requisitos

- [x] Supabase Pro (para pg_cron)
- [x] Gemini API Key (já configurado)
- [x] Claude API Key (já configurado)
- [x] **OpenAI API Key** (GPT-4o fallback)
- [x] **Perplexity API Key:** `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`
- [x] Expo Push Notifications configurado

## 🚀 Instalação

### 1. Executar Migrations

```bash
# Entrar no projeto
cd c:\Users\Usuario\Documents\NossaMaternidade

# Aplicar migrations na ordem
supabase db push --include-all

# Ou manualmente no Supabase Dashboard > SQL Editor:
# 1. 20250111_personalization_system.sql
# 2. seed_message_templates.sql
# 3. 20250111_configure_pg_cron_jobs.sql
```

### 2. Configurar Variáveis de Ambiente (Supabase)

No **Supabase Dashboard > Settings > Edge Functions**:

```bash
# Adicionar secrets
supabase secrets set GEMINI_API_KEY="sua-gemini-key"
supabase secrets set CLAUDE_API_KEY="sua-claude-key"
supabase secrets set OPENAI_API_KEY="sua-openai-key"
supabase secrets set PERPLEXITY_API_KEY="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"
supabase secrets set SUPABASE_URL="https://seu-projeto.supabase.co"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"
```

### 3. Configurar pg_cron (Variáveis de Database)

No **Supabase Dashboard > SQL Editor**:

```sql
-- Configurar URL do Supabase
ALTER DATABASE postgres SET app.supabase_url TO 'https://seu-projeto.supabase.co';

-- Configurar Service Role Key
ALTER DATABASE postgres SET app.supabase_service_role_key TO 'sua-service-role-key';
```

### 4. Deploy das Edge Functions

```bash
# Deploy de todas as funções
supabase functions deploy ingest-event
supabase functions deploy build-signals
supabase functions deploy curate-content-personalized
supabase functions deploy compose-copy
supabase functions deploy plan-daily
supabase functions deploy dispatch-plan
```

### 5. Verificar Jobs Agendados

No **Supabase Dashboard > SQL Editor**:

```sql
-- Listar jobs
SELECT * FROM cron.job;

-- Verificar últimas execuções
SELECT * FROM cron.job_run_details
ORDER BY start_time DESC
LIMIT 10;
```

## 📊 Estrutura de Tabelas

### events
Rastreamento de comportamento:
- `id` (UUID)
- `user_id` (UUID) → auth.users
- `kind` (TEXT): onboarding_submitted, mood_update, habit_check, chat_turn, etc.
- `payload` (JSONB): dados adicionais
- `created_at` (TIMESTAMPTZ)

### signals
Snapshot calculado (análise Gemini):
- `id` (UUID)
- `user_id` (UUID) → user_profiles
- `tags` (TEXT[]): tag_lonely, support_low, stress_high, etc.
- `scores` (JSONB): stress_score, sleep_quality, support_score, mood_average
- `source` (TEXT): gemini_2.0_flash
- `created_at` (TIMESTAMPTZ)

### message_plan
Plano fechado do dia:
- `id` (UUID)
- `user_id` (UUID) → user_profiles
- `plan_date` (DATE): data do plano
- `items` (JSONB): array de 3 itens (check-in, conteúdo, hábito)
- `rationale` (JSONB): transparência (por que estou vendo isso?)
- `created_at` (TIMESTAMPTZ)

### message_deliveries
Execução e métricas:
- `id` (UUID)
- `plan_id` (UUID) → message_plan
- `user_id` (UUID) → user_profiles
- `channel` (TEXT): push, in-app, email
- `status` (TEXT): scheduled, sent, failed, cancelled
- `opened` (BOOLEAN): métrica de abertura
- `clicked` (BOOLEAN): métrica de clique
- `feedback` (TEXT): feedback da usuária

## 🔄 Fluxo de Funcionamento

### 1. Ingestão de Eventos (Contínuo)

```typescript
// App registra eventos
await ingestEvent(userId, 'mood_update', { mood: 4, energy: 3 });
await ingestEvent(userId, 'habit_check', { habit_id: '...', done: true });
```

### 2. Planejamento Diário (23:15 todo dia)

**Job: plan-daily**

```
1. build-signals
   ├─ Lê últimos 14 dias de events
   ├─ Analisa com Gemini 2.0 Flash
   ├─ Gera tags + scores
   └─ Salva em signals

2. Policy Engine (regras determinísticas)
   ├─ Se pp_intrusive ou harm_thoughts → prioridade = ALERTA
   ├─ Se stress_score > 70 → prioridade = STRESS
   ├─ Se tag_lonely ou support_low → prioridade = PERTENCIMENTO
   └─ Caso contrário → prioridade = HÁBITO

3. curate-content (se necessário)
   ├─ Chama Perplexity API com tags
   ├─ Busca 3 artigos relevantes (pt-BR, ≤3 min)
   └─ Salva em content_catalog

4. compose-copy (para cada item)
   ├─ Aplica template + variáveis
   ├─ Personaliza com Claude Sonnet 4
   └─ Gera texto final (≤240 caracteres)

5. Salvar message_plan
   ├─ 3 itens: 09:00 (check-in), 14:00 (conteúdo), 19:30 (hábito/encerramento)
   ├─ Rationale: transparência total
   └─ Plan_date = amanhã
```

### 3. Dispatch de Notificações (00h, 09h, 14h, 19h)

**Job: dispatch-plan**

```
1. Buscar message_plan de hoje
2. Filtrar itens agendados para hora atual
3. Verificar frequency_cap (máx. 2 pushes/dia por padrão)
4. Enviar push via Expo Notifications
5. Criar message_deliveries (status = sent/failed)
6. Rastrear métricas (opened, clicked)
```

### 4. App Exibe Plano (Contínuo)

```
HomeScreen
  ├─ usePlanoDoDia(userId)
  ├─ PlanoDoDia (3 cards)
  │   ├─ 09:00 Check-in
  │   ├─ 14:00 Conteúdo
  │   └─ 19:30 Hábito
  ├─ Botão "Replanejar hoje" → replan()
  └─ PorQueIssoModal (transparência)
```

## 🧪 Testando o Sistema

### 1. Teste Manual de Edge Functions

```bash
# Testar ingest-event
curl -X POST "https://seu-projeto.supabase.co/functions/v1/ingest-event" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "kind": "mood_update",
    "payload": { "mood": 4, "energy": 3 }
  }'

# Testar build-signals
curl -X POST "https://seu-projeto.supabase.co/functions/v1/build-signals" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "userId": "USER_ID" }'

# Testar plan-daily (para 1 usuário)
curl -X POST "https://seu-projeto.supabase.co/functions/v1/plan-daily" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "userId": "USER_ID", "forceRegenerate": true }'
```

### 2. Verificar Resultados no Banco

```sql
-- Verificar signals gerados
SELECT * FROM signals
WHERE user_id = 'USER_ID'
ORDER BY created_at DESC
LIMIT 1;

-- Verificar plano criado
SELECT * FROM message_plan
WHERE user_id = 'USER_ID'
ORDER BY created_at DESC
LIMIT 1;

-- Verificar entregas
SELECT * FROM message_deliveries
WHERE user_id = 'USER_ID'
ORDER BY created_at DESC
LIMIT 10;
```

### 3. Forçar Execução de Jobs

```sql
-- Forçar plan-daily para um usuário
SELECT net.http_post(
  url := 'https://seu-projeto.supabase.co/functions/v1/plan-daily',
  headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY", "Content-Type": "application/json"}'::jsonb,
  body := '{"userId": "USER_ID", "forceRegenerate": true}'::jsonb
);

-- Forçar dispatch-plan (hora atual)
SELECT net.http_post(
  url := 'https://seu-projeto.supabase.co/functions/v1/dispatch-plan',
  headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY", "Content-Type": "application/json"}'::jsonb,
  body := '{}'::jsonb
);
```

## 📱 Uso no App

### Registrar Eventos

```typescript
import { ingestEvent } from '@/services/personalization';

// Ao completar onboarding
await ingestEvent(userId, 'onboarding_submitted', {
  type: 'gestante',
  pregnancy_week: 20,
});

// Ao atualizar humor
await ingestEvent(userId, 'mood_update', {
  mood: 4,
  energy: 3,
  timestamp: new Date().toISOString(),
});

// Ao completar hábito
await ingestEvent(userId, 'habit_check', {
  habit_id: habitId,
  done: true,
});
```

### Ver Plano do Dia

```typescript
import { usePlanoDoDia } from '@/hooks/usePlanoDoDia';

function MyScreen() {
  const { plan, isLoading, replan } = usePlanoDoDia(userId);

  if (isLoading) return <Loading />;

  return (
    <PlanoDoDia
      items={plan.items}
      rationale={plan.rationale}
      onWhyThisPressed={() => setModalVisible(true)}
      onItemCtaPressed={(item) => handleCta(item)}
    />
  );
}
```

### Ajustar Frequência

```typescript
import { updateFrequencyCap } from '@/services/personalization';

// Reduzir para 1 notificação por dia
await updateFrequencyCap(userId, 1);

// Desligar notificações
await updateFrequencyCap(userId, 0);
```

## 🐛 Troubleshooting

### Jobs não estão rodando

```sql
-- Verificar se pg_cron está habilitado
SELECT * FROM pg_extension WHERE extname = 'pg_cron';

-- Verificar logs de execução
SELECT * FROM cron.job_run_details
WHERE status != 'succeeded'
ORDER BY start_time DESC
LIMIT 10;

-- Re-criar jobs
SELECT cron.unschedule('plan_daily_job');
SELECT cron.unschedule('dispatch_plan_job');
-- Depois executar 20250111_configure_pg_cron_jobs.sql novamente
```

### Edge Functions retornando erro

```bash
# Ver logs das funções
supabase functions logs plan-daily --tail
supabase functions logs build-signals --tail

# Verificar se secrets estão configurados
supabase secrets list
```

### Plano não aparece no App

```typescript
// Verificar se userId está correto
const { data: { user } } = await supabase.auth.getUser();
console.log('User ID:', user?.id);

// Verificar se plano existe
const plan = await getPlanoDoDia(user.id);
console.log('Plan:', plan);

// Forçar replanejamento
await replanToday(user.id);
```

## 📊 Métricas e Monitoramento

### Dashboards Recomendados

1. **Taxa de Abertura de Pushes**
```sql
SELECT 
  DATE(sent_at) as date,
  COUNT(*) as total_sent,
  SUM(CASE WHEN opened THEN 1 ELSE 0 END) as total_opened,
  ROUND(100.0 * SUM(CASE WHEN opened THEN 1 ELSE 0 END) / COUNT(*), 2) as open_rate
FROM message_deliveries
WHERE status = 'sent'
GROUP BY DATE(sent_at)
ORDER BY date DESC;
```

2. **Taxa de Clique em CTAs**
```sql
SELECT 
  DATE(sent_at) as date,
  COUNT(*) as total_sent,
  SUM(CASE WHEN clicked THEN 1 ELSE 0 END) as total_clicked,
  ROUND(100.0 * SUM(CASE WHEN clicked THEN 1 ELSE 0 END) / COUNT(*), 2) as click_rate
FROM message_deliveries
WHERE status = 'sent'
GROUP BY DATE(sent_at)
ORDER BY date DESC;
```

3. **Distribuição de Prioridades**
```sql
SELECT 
  rationale->>'priority' as priority,
  COUNT(*) as total_plans
FROM message_plan
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY priority
ORDER BY total_plans DESC;
```

## 🎯 Próximos Passos

- [ ] A/B Testing com `experiments` table
- [ ] Integração com hábitos (recompensas por completar CTAs)
- [ ] Analytics dashboard no app
- [ ] Notificações via email (além de push)
- [ ] Personalização de horários por usuária
- [ ] Machine Learning para otimizar prioridades

## 📚 Documentação Adicional

- [Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [pg_cron Docs](https://github.com/citusdata/pg_cron)
- [Perplexity API](https://docs.perplexity.ai/)
- [Claude API](https://docs.anthropic.com/)
- [Gemini API](https://ai.google.dev/docs)

---

## 🔄 Sistema de Fallback Multi-API

O sistema usa **fallback automático** para garantir resiliência total contra falhas de API:

### compose-copy (Mensagens Personalizadas)
**Ordem de tentativas:**
1. **Claude Sonnet 4** (primeira tentativa)
   - Custo: ~$3/1M tokens
   - Tom empático e linguagem acessível
2. **GPT-4o** (fallback automático)
   - Custo: ~$2.50/1M tokens
   - Mantém mesmo prompt e temperatura
3. **Template Original** (último recurso)
   - Custo: $0
   - Retorna template preenchido sem personalização

### build-signals (Análise Comportamental)
**Ordem de tentativas:**
1. **Gemini 2.0 Flash** (primeira tentativa)
   - Custo: ~$0.10/1M tokens (muito barato)
   - Análise semântica dos últimos 14 dias
2. **GPT-4o** (fallback automático)
   - Custo: ~$2.50/1M tokens
   - Mantém mesmo prompt de análise

### Observabilidade

Cada response incluirá o campo `provider` indicando qual API foi usada:

```json
{
  "success": true,
  "copy": { ... },
  "provider": "claude" | "gpt-4o" | "fallback"
}
```

O campo `source` no banco de dados também reflete o provider:
- `gemini_2.0_flash` - Gemini usado
- `gpt-4o_fallback` - GPT-4o usado como fallback

### Custo Estimado

**Por 1.000 usuárias/dia:**
- Gemini (análise): ~$0.50/mês (muito barato)
- Claude (mensagens): ~$15/mês
- GPT-4o (fallback): ~$5/mês (quando necessário)

**Total estimado:** ~$20/mês (assumindo 10% de fallback)

### Logs de Fallback

Sempre que o fallback for acionado, um log de warning é gerado:
```
Claude failed, trying GPT-4o fallback: [erro]
```

Isso permite monitorar a frequência de falhas e tomar ações corretivas.

---

**Implementado por:** Cursor AI Agent
**Data:** 11 de Janeiro de 2025
**Versão:** 1.0.0
**Atualização (Fallback Multi-API):** 11 de Janeiro de 2025

