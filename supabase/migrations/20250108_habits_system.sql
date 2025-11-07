-- =====================================================
-- HABITS SYSTEM - Sistema Completo de Hábitos
-- Data: 2025-01-08
-- =====================================================
-- Tabelas: habit_templates, habits, habit_logs, streaks

-- =====================================================
-- 1. HABIT_TEMPLATES (Templates de Hábitos)
-- =====================================================

CREATE TABLE IF NOT EXISTS habit_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Conteúdo
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('autocuidado', 'saude-fisica', 'saude-mental', 'organizacao', 'relacionamento', 'aprendizado')),
  
  -- Configuração
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'custom')),
  points_value INTEGER DEFAULT 10 CHECK (points_value >= 0),
  
  -- UI
  icon TEXT DEFAULT '✨',
  color TEXT DEFAULT '#FF69B4',
  
  -- Metadata
  is_default BOOLEAN DEFAULT FALSE, -- Templates padrão do sistema
  recommended_for TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['gestante', 'mae', 'tentante']
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_habit_templates_category ON habit_templates(category);
CREATE INDEX IF NOT EXISTS idx_habit_templates_is_default ON habit_templates(is_default);

-- RLS
ALTER TABLE habit_templates ENABLE ROW LEVEL SECURITY;

-- Templates públicos visíveis para todos
CREATE POLICY "Everyone can view habit templates" ON habit_templates
  FOR SELECT USING (TRUE);

COMMENT ON TABLE habit_templates IS 'Templates de hábitos (padrão e customizados)';

-- =====================================================
-- 2. HABITS (Hábitos Ativos do Usuário)
-- =====================================================

CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES habit_templates(id) ON DELETE SET NULL,
  
  -- Conteúdo (pode sobrescrever template)
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  
  -- Configuração
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'custom')),
  frequency_config JSONB DEFAULT '{}'::jsonb, -- { daysOfWeek: [0,1,2,3,4,5,6], customDates: [] }
  points_value INTEGER DEFAULT 10,
  
  -- UI
  icon TEXT DEFAULT '✨',
  color TEXT DEFAULT '#FF69B4',
  
  -- Estado
  is_active BOOLEAN DEFAULT TRUE,
  archived_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_template_id ON habits(template_id);
CREATE INDEX IF NOT EXISTS idx_habits_is_active ON habits(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_habits_category ON habits(category);

-- RLS
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own habits" ON habits
  FOR ALL USING (auth.uid()::text = user_id::text);

COMMENT ON TABLE habits IS 'Hábitos ativos dos usuários (instâncias de templates)';

-- =====================================================
-- 3. HABIT_LOGS (Registro de Conclusão de Hábitos)
-- =====================================================

CREATE TABLE IF NOT EXISTS habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Data e Status
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  done BOOLEAN DEFAULT FALSE,
  skipped BOOLEAN DEFAULT FALSE,
  notes TEXT,
  
  -- Pontuação
  points_earned INTEGER DEFAULT 0,
  
  -- Metadata
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Um log por hábito por dia
  UNIQUE(habit_id, date)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id ON habit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON habit_logs(date DESC);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_date ON habit_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_habit_logs_done ON habit_logs(done) WHERE done = TRUE;

-- RLS
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own habit logs" ON habit_logs
  FOR ALL USING (auth.uid()::text = user_id::text);

COMMENT ON TABLE habit_logs IS 'Registro diário de conclusão de hábitos';

-- =====================================================
-- 4. STREAKS (Sequências de Dias Consecutivos)
-- =====================================================

CREATE TABLE IF NOT EXISTS streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  
  -- Streak Stats
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Um streak por usuário (geral) ou por hábito
  UNIQUE(user_id, habit_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_habit_id ON streaks(habit_id);
CREATE INDEX IF NOT EXISTS idx_streaks_current_streak ON streaks(current_streak DESC);

-- RLS
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks" ON streaks
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own streaks" ON streaks
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own streaks" ON streaks
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

COMMENT ON TABLE streaks IS 'Sequências de dias consecutivos completando hábitos';

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Trigger para updated_at em habits
CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para updated_at em streaks
CREATE TRIGGER update_streaks_updated_at
  BEFORE UPDATE ON streaks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Atualizar streak ao marcar hábito como done
CREATE OR REPLACE FUNCTION update_habit_streak()
RETURNS TRIGGER AS $$
DECLARE
  v_streak_record streaks%ROWTYPE;
  v_yesterday DATE;
  v_is_consecutive BOOLEAN;
BEGIN
  -- Só processar quando done = TRUE
  IF NEW.done = FALSE THEN
    RETURN NEW;
  END IF;
  
  -- Buscar streak do usuário para este hábito
  SELECT * INTO v_streak_record
  FROM streaks
  WHERE user_id = NEW.user_id
    AND habit_id = NEW.habit_id;
  
  -- Se não existe, criar
  IF v_streak_record IS NULL THEN
    INSERT INTO streaks (user_id, habit_id, current_streak, longest_streak, last_completed_date)
    VALUES (NEW.user_id, NEW.habit_id, 1, 1, NEW.date);
    RETURN NEW;
  END IF;
  
  -- Verificar se é consecutivo
  v_yesterday := NEW.date - INTERVAL '1 day';
  v_is_consecutive := (v_streak_record.last_completed_date = v_yesterday::DATE);
  
  -- Atualizar streak
  IF v_is_consecutive THEN
    -- Incrementar streak
    UPDATE streaks
    SET 
      current_streak = current_streak + 1,
      longest_streak = GREATEST(longest_streak, current_streak + 1),
      last_completed_date = NEW.date,
      updated_at = NOW()
    WHERE user_id = NEW.user_id
      AND habit_id = NEW.habit_id;
  ELSE
    -- Reiniciar streak (não consecutivo)
    UPDATE streaks
    SET 
      current_streak = 1,
      last_completed_date = NEW.date,
      updated_at = NOW()
    WHERE user_id = NEW.user_id
      AND habit_id = NEW.habit_id;
  END IF;
  
  -- Atualizar user_gamification também
  UPDATE user_gamification
  SET
    total_points = total_points + NEW.points_earned,
    level = calculate_user_level(total_points + NEW.points_earned),
    total_habits_completed = total_habits_completed + 1,
    last_activity_date = NEW.date,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_habit_streak
  AFTER INSERT OR UPDATE OF done ON habit_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_habit_streak();

COMMENT ON FUNCTION update_habit_streak IS 'Atualiza streak e gamificação ao marcar hábito como concluído';

-- Function: Verificar se usuário quebrou streak (não completou hábito ontem)
CREATE OR REPLACE FUNCTION check_broken_streaks()
RETURNS void AS $$
BEGIN
  -- Zerar current_streak para hábitos que não foram completados ontem
  UPDATE streaks s
  SET current_streak = 0, updated_at = NOW()
  FROM habits h
  WHERE s.habit_id = h.id
    AND h.is_active = TRUE
    AND s.last_completed_date < CURRENT_DATE - INTERVAL '1 day'
    AND s.current_streak > 0;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_broken_streaks IS 'Zera streaks quebrados (executar via cron diário)';

-- =====================================================
-- SEED DATA (Templates Padrão)
-- =====================================================

INSERT INTO habit_templates (name, description, category, frequency, points_value, icon, color, is_default, recommended_for)
VALUES
-- Autocuidado
('Momento de Autocuidado', 'Dedicar 15min para você mesma', 'autocuidado', 'daily', 10, '🌸', '#FF69B4', TRUE, ARRAY['gestante', 'mae', 'tentante']),
('Skincare Noturno', 'Cuidar da pele antes de dormir', 'autocuidado', 'daily', 5, '✨', '#FFB6C1', TRUE, ARRAY['gestante', 'mae', 'tentante']),
('Banho Relaxante', 'Tomar banho com calma e presença', 'autocuidado', 'daily', 5, '🛀', '#E0BBE4', TRUE, ARRAY['gestante', 'mae', 'tentante']),

-- Saúde Física
('Hidratação', 'Beber 2L de água', 'saude-fisica', 'daily', 10, '💧', '#87CEEB', TRUE, ARRAY['gestante', 'mae', 'tentante']),
('Caminhada Leve', 'Caminhar 15-30 minutos', 'saude-fisica', 'daily', 15, '🚶‍♀️', '#98D8C8', TRUE, ARRAY['gestante', 'mae', 'tentante']),
('Alimentação Saudável', '3 refeições balanceadas', 'saude-fisica', 'daily', 15, '🥗', '#90EE90', TRUE, ARRAY['gestante', 'mae', 'tentante']),
('Alongamento', 'Alongar o corpo', 'saude-fisica', 'daily', 10, '🧘‍♀️', '#B0E0E6', TRUE, ARRAY['gestante', 'mae', 'tentante']),

-- Saúde Mental
('Meditação', '5-10 minutos de meditação', 'saude-mental', 'daily', 15, '🧘', '#D8BFD8', TRUE, ARRAY['gestante', 'mae', 'tentante']),
('Diário de Gratidão', 'Anotar 3 coisas boas do dia', 'saude-mental', 'daily', 10, '📝', '#FFE4E1', TRUE, ARRAY['gestante', 'mae', 'tentante']),
('Respiração Consciente', '5 minutos de respiração profunda', 'saude-mental', 'daily', 10, '🫁', '#B0C4DE', TRUE, ARRAY['gestante', 'mae', 'tentante']),
('Conversa com Amiga', 'Ligar para alguém querido', 'saude-mental', 'weekly', 15, '💬', '#FFA07A', TRUE, ARRAY['gestante', 'mae', 'tentante']),

-- Organização
('Planejar o Dia', 'Definir 3 prioridades do dia', 'organizacao', 'daily', 5, '📋', '#FFD700', TRUE, ARRAY['gestante', 'mae', 'tentante']),
('Organizar Espaço', 'Arrumar um cômodo da casa', 'organizacao', 'weekly', 10, '🧹', '#F0E68C', TRUE, ARRAY['gestante', 'mae']),
('Preparar Bolsa Maternidade', 'Verificar itens essenciais', 'organizacao', 'weekly', 10, '🎒', '#FFDAB9', TRUE, ARRAY['gestante']),

-- Relacionamento
('Tempo de Qualidade', 'Conversar com parceiro/a', 'relacionamento', 'daily', 15, '💕', '#FF1493', TRUE, ARRAY['gestante', 'mae', 'tentante']),
('Momento com Bebê', 'Brincadeira ou carinho com bebê', 'relacionamento', 'daily', 10, '👶', '#FFCCCB', TRUE, ARRAY['mae']),

-- Aprendizado
('Ler sobre Maternidade', 'Ler artigo ou capítulo', 'aprendizado', 'weekly', 15, '📚', '#87CEFA', TRUE, ARRAY['gestante', 'mae', 'tentante']),
('Assistir Vídeo Educativo', 'Vídeo sobre desenvolvimento infantil', 'aprendizado', 'weekly', 10, '🎥', '#ADD8E6', TRUE, ARRAY['gestante', 'mae']);

-- =====================================================
-- VALIDAÇÃO FINAL
-- =====================================================

DO $$
DECLARE
  habits_tables TEXT[] := ARRAY['habit_templates', 'habits', 'habit_logs', 'streaks'];
  table_count INTEGER;
  missing_tables TEXT[] := ARRAY[]::TEXT[];
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY habits_tables
  LOOP
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = tbl;

    IF table_count = 0 THEN
      missing_tables := array_append(missing_tables, tbl);
    END IF;
  END LOOP;

  IF array_length(missing_tables, 1) > 0 THEN
    RAISE WARNING 'Tabelas faltando: %', array_to_string(missing_tables, ', ');
  ELSE
    RAISE NOTICE '✅ Sistema de Hábitos criado com sucesso!';
  END IF;
END $$;

