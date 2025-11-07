-- =====================================================
-- CONFIGURE PG_CRON JOBS
-- Data: 2025-01-11
-- Configura jobs agendados para plan-daily e dispatch-plan
-- =====================================================

-- Habilitar pg_cron extension (se ainda não estiver)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- =====================================================
-- JOB 1: PLAN-DAILY (Planejamento diário)
-- =====================================================
-- Roda todo dia às 23:15 (horário do servidor)
-- Planeja o dia seguinte para todos os usuários

SELECT cron.schedule(
  'plan_daily_job',                     -- Job name
  '15 23 * * *',                        -- Cron expression: 23:15 todo dia
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/plan-daily',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- =====================================================
-- JOB 2: DISPATCH-PLAN (Envio de notificações)
-- =====================================================
-- Roda a cada hora nas horas estratégicas (00h, 09h, 14h, 19h)
-- Envia pushes agendados para a hora atual

SELECT cron.schedule(
  'dispatch_plan_job',                  -- Job name
  '0 0,9,14,19 * * *',                  -- Cron expression: às 00h, 09h, 14h, 19h
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/dispatch-plan',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);

-- =====================================================
-- CONFIGURAR VARIÁVEIS DE AMBIENTE
-- =====================================================
-- IMPORTANTE: Execute estes comandos no Supabase Dashboard > SQL Editor
-- substituindo pelos valores reais do seu projeto

-- Exemplo:
-- ALTER DATABASE postgres SET app.supabase_url TO 'https://seu-projeto.supabase.co';
-- ALTER DATABASE postgres SET app.supabase_service_role_key TO 'sua-service-role-key';

-- =====================================================
-- VERIFICAR JOBS AGENDADOS
-- =====================================================

-- Listar todos os jobs agendados
SELECT * FROM cron.job;

-- Verificar últimas execuções
SELECT * FROM cron.job_run_details
ORDER BY start_time DESC
LIMIT 10;

-- =====================================================
-- DESABILITAR JOBS (se necessário)
-- =====================================================

-- Desabilitar plan_daily_job
-- SELECT cron.unschedule('plan_daily_job');

-- Desabilitar dispatch_plan_job
-- SELECT cron.unschedule('dispatch_plan_job');

-- =====================================================
-- REMOVER JOBS (se necessário)
-- =====================================================

-- DELETE FROM cron.job WHERE jobname = 'plan_daily_job';
-- DELETE FROM cron.job WHERE jobname = 'dispatch_plan_job';

-- =====================================================
-- VALIDAÇÃO
-- =====================================================

DO $$
DECLARE
  plan_job_exists BOOLEAN;
  dispatch_job_exists BOOLEAN;
BEGIN
  SELECT EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'plan_daily_job') INTO plan_job_exists;
  SELECT EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'dispatch_plan_job') INTO dispatch_job_exists;
  
  RAISE NOTICE '==============================================';
  RAISE NOTICE '✅ PG_CRON CONFIGURATION COMPLETA!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Jobs configurados:';
  RAISE NOTICE '  [%] plan_daily_job (23:15 todo dia)', CASE WHEN plan_job_exists THEN '✓' ELSE '✗' END;
  RAISE NOTICE '  [%] dispatch_plan_job (00h, 09h, 14h, 19h)', CASE WHEN dispatch_job_exists THEN '✓' ELSE '✗' END;
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Próximos passos:';
  RAISE NOTICE '  1. Configurar variáveis de ambiente (app.supabase_url e app.supabase_service_role_key)';
  RAISE NOTICE '  2. Testar manualmente as Edge Functions';
  RAISE NOTICE '  3. Monitorar cron.job_run_details para verificar execuções';
  RAISE NOTICE '==============================================';
END $$;

