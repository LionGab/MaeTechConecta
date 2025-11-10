-- Migration: Onboarding Completo com Perguntas Profundas
-- Data: 2025-01-05
-- Descrição: Tabelas para onboarding conversacional com perguntas profundas
-- que ajudam a NathIA entender o momento emocional e situacional da mãe

-- ==========================================
-- 1. Tabela: onboarding_data
-- ==========================================
-- Armazena dados emocionais e situacionais do onboarding
CREATE TABLE IF NOT EXISTS onboarding_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Estado Emocional
  emotional_state TEXT CHECK (emotional_state IN ('exausta', 'ansiosa', 'feliz', 'confusa', 'equilibrada', 'triste', 'excelente', 'bem', 'ok', 'cansada', 'sobrecarregada')),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  sleep_quality TEXT CHECK (sleep_quality IN ('pessima', 'ruim', 'regular', 'boa', 'otimo')),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  
  -- Desafios
  main_challenges TEXT[] DEFAULT '{}',
  specific_challenges TEXT,
  
  -- Necessidades de Suporte
  support_needs TEXT[] DEFAULT '{}',
  has_support_network BOOLEAN,
  support_network_description TEXT,
  
  -- Objetivos
  main_goals TEXT[] DEFAULT '{}',
  what_brings_you_here TEXT,
  
  -- Preferências
  communication_style TEXT CHECK (communication_style IN ('casual', 'empatico', 'direto', 'formal')),
  
  -- Contexto Familiar
  partner_support TEXT CHECK (partner_support IN ('muito', 'moderado', 'pouco', 'nenhum', 'nao_tem')),
  family_support TEXT CHECK (family_support IN ('muito', 'moderato', 'pouco', 'nenhum')),
  
  -- Timestamps
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id)
);

-- ==========================================
-- 2. Tabela: onboarding_responses
-- ==========================================
-- Armazena respostas individuais do onboarding
CREATE TABLE IF NOT EXISTS onboarding_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  response_value JSONB NOT NULL, -- Pode ser string, number, array, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Index para busca rápida
  UNIQUE(user_id, question_id)
);

-- ==========================================
-- 3. Índices
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_onboarding_data_user_id ON onboarding_data(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_data_completed_at ON onboarding_data(completed_at);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_user_id ON onboarding_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_question_id ON onboarding_responses(question_id);

-- ==========================================
-- 4. RLS (Row Level Security)
-- ==========================================
ALTER TABLE onboarding_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Políticas: Usuário só vê seus próprios dados
CREATE POLICY "Users can view own onboarding data"
  ON onboarding_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding data"
  ON onboarding_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding data"
  ON onboarding_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own onboarding responses"
  ON onboarding_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding responses"
  ON onboarding_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding responses"
  ON onboarding_responses FOR UPDATE
  USING (auth.uid() = user_id);

-- ==========================================
-- 5. Função: Atualizar updated_at automaticamente
-- ==========================================
CREATE OR REPLACE FUNCTION update_onboarding_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_onboarding_data_updated_at
  BEFORE UPDATE ON onboarding_data
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_updated_at();

CREATE TRIGGER update_onboarding_responses_updated_at
  BEFORE UPDATE ON onboarding_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_onboarding_updated_at();

-- ==========================================
-- 6. Função: Gerar contexto para NathIA
-- ==========================================
-- Função helper para gerar contexto do onboarding para NathIA
CREATE OR REPLACE FUNCTION get_onboarding_context(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_context TEXT := '';
  v_data onboarding_data%ROWTYPE;
BEGIN
  -- Buscar dados do onboarding
  SELECT * INTO v_data
  FROM onboarding_data
  WHERE user_id = p_user_id
  LIMIT 1;
  
  IF v_data IS NULL THEN
    RETURN '';
  END IF;
  
  -- Montar contexto
  IF v_data.emotional_state IS NOT NULL THEN
    v_context := v_context || 'Estado emocional: ' || v_data.emotional_state || E'\n';
  END IF;
  
  IF v_data.stress_level IS NOT NULL THEN
    v_context := v_context || 'Nível de estresse: ' || v_data.stress_level || '/10' || E'\n';
  END IF;
  
  IF v_data.sleep_quality IS NOT NULL THEN
    v_context := v_context || 'Qualidade do sono: ' || v_data.sleep_quality || E'\n';
  END IF;
  
  IF v_data.energy_level IS NOT NULL THEN
    v_context := v_context || 'Nível de energia: ' || v_data.energy_level || '/10' || E'\n';
  END IF;
  
  IF array_length(v_data.main_challenges, 1) > 0 THEN
    v_context := v_context || 'Principais desafios: ' || array_to_string(v_data.main_challenges, ', ') || E'\n';
  END IF;
  
  IF v_data.specific_challenges IS NOT NULL THEN
    v_context := v_context || 'Desafios específicos: ' || v_data.specific_challenges || E'\n';
  END IF;
  
  IF array_length(v_data.support_needs, 1) > 0 THEN
    v_context := v_context || 'Necessidades de suporte: ' || array_to_string(v_data.support_needs, ', ') || E'\n';
  END IF;
  
  IF v_data.has_support_network IS NOT NULL THEN
    v_context := v_context || 'Rede de apoio: ' || CASE WHEN v_data.has_support_network THEN 'Sim' ELSE 'Não' END || E'\n';
  END IF;
  
  IF array_length(v_data.main_goals, 1) > 0 THEN
    v_context := v_context || 'Objetivos no app: ' || array_to_string(v_data.main_goals, ', ') || E'\n';
  END IF;
  
  IF v_data.what_brings_you_here IS NOT NULL THEN
    v_context := v_context || 'O que trouxe até aqui: ' || v_data.what_brings_you_here || E'\n';
  END IF;
  
  IF v_data.communication_style IS NOT NULL THEN
    v_context := v_context || 'Estilo de comunicação preferido: ' || v_data.communication_style || E'\n';
  END IF;
  
  RETURN v_context;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 7. Comentários
-- ==========================================
COMMENT ON TABLE onboarding_data IS 'Dados emocionais e situacionais do onboarding para NathIA entender o momento da mãe';
COMMENT ON TABLE onboarding_responses IS 'Respostas individuais do onboarding';
COMMENT ON FUNCTION get_onboarding_context IS 'Gera contexto do onboarding para NathIA usar no chat';



