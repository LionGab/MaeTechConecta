-- Tabela para logs de alertas de alto risco
CREATE TABLE IF NOT EXISTS alert_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
  risk_level INTEGER CHECK (risk_level >= 0 AND risk_level <= 10),
  risk_flags JSONB DEFAULT '[]'::jsonb,
  notified_at TIMESTAMPTZ DEFAULT NOW(),
  handled_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  handled_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_alert_logs_user_id ON alert_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_logs_risk_level ON alert_logs(risk_level) WHERE risk_level >= 8;
CREATE INDEX IF NOT EXISTS idx_alert_logs_notified_at ON alert_logs(notified_at);
CREATE INDEX IF NOT EXISTS idx_alert_logs_handled_at ON alert_logs(handled_at) WHERE handled_at IS NULL;

-- RLS para alert_logs (apenas admins podem ver)
ALTER TABLE alert_logs ENABLE ROW LEVEL SECURITY;

-- Policy para admins (você precisará criar uma tabela de admins ou usar uma role)
-- Por enquanto, deixamos sem policy para desenvolvimento
-- Em produção, adicione:
-- CREATE POLICY "Admins podem ver alertas"
--   ON alert_logs FOR SELECT
--   USING (auth.jwt() ->> 'role' = 'admin');

COMMENT ON TABLE alert_logs IS 'Logs de alertas de alto risco para auditoria e acompanhamento pela equipe';
