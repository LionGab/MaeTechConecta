-- =====================================================
-- SEED MESSAGE TEMPLATES
-- Data: 2025-01-11
-- Templates base para sistema de personalização
-- =====================================================
-- 8 templates principais: apoio, sono, stress, pertencimento,
-- hábito, alerta, check-in, encerramento
-- =====================================================

-- Limpar templates existentes (desenvolvimento)
TRUNCATE TABLE message_templates CASCADE;

-- =====================================================
-- 1. APOIO (support)
-- =====================================================

INSERT INTO message_templates (channel, purpose, template, variables, tags) VALUES
(
  'push',
  'acolhimento_pai_ausente',
  'Bom dia, {nome}. Hoje cuide de uma coisa só: escolha 1 pessoa para pedir um favor simples (5 min com o bebê). Pequenos pedidos criam apoio real.',
  ARRAY['nome'],
  ARRAY['tag_father_absent', 'tag_lonely', 'support_low']
),
(
  'in-app',
  'rede_de_apoio_simples',
  'Olá, {nome}! 💕 Você não precisa fazer tudo sozinha. Liste 3 pessoas que podem te ajudar hoje: alguém para conversar, alguém para pegar o bebê 10 min, alguém para trazer uma comida. Pequenos pedidos fortalecem laços.',
  ARRAY['nome'],
  ARRAY['support_low', 'tag_single_mom', 'tag_lonely']
);

-- =====================================================
-- 2. SONO (sleep)
-- =====================================================

INSERT INTO message_templates (channel, purpose, template, variables, tags) VALUES
(
  'push',
  'rotina_sono_simples',
  'Oi, {nome}! 🌙 Hoje tente dormir quando o bebê dormir, mesmo que seja 20 min. Seu corpo precisa descansar para cuidar bem de vocês dois.',
  ARRAY['nome'],
  ARRAY['sleep_low', 'stress_high']
),
(
  'in-app',
  'sono_qualidade',
  '{nome}, seu sono está te preocupando? Tente hoje: 1) Apagar luzes 1h antes de dormir, 2) Evitar telas, 3) Respirar fundo 5 min. Pequenas rotinas melhoram muito.',
  ARRAY['nome'],
  ARRAY['sleep_low']
);

-- =====================================================
-- 3. STRESS (stress)
-- =====================================================

INSERT INTO message_templates (channel, purpose, template, variables, tags) VALUES
(
  'push',
  'respira_simples',
  '{nome}, quando sentir que vai explodir: respire 4 tempos (enche o pulmão), segura 4, solta 4. Repete 3 vezes. Funciona. 💪',
  ARRAY['nome'],
  ARRAY['stress_high']
),
(
  'in-app',
  'stress_acao_pratica',
  'Oi, {nome}! Stress alto? Hoje faça 1 coisa de cada vez. Prioridade número 1: você comer algo e beber água. Resto pode esperar 30 min. 🤱',
  ARRAY['nome'],
  ARRAY['stress_high', 'overwhelmed']
);

-- =====================================================
-- 4. PERTENCIMENTO (belonging)
-- =====================================================

INSERT INTO message_templates (channel, purpose, template, variables, tags) VALUES
(
  'push',
  'historia_nath_pertencimento',
  '{nome}, você não está sozinha. Milhões de mães passam exatamente pelo que você sente. Vem ver histórias reais no MundoNath hoje? 💕',
  ARRAY['nome'],
  ARRAY['tag_lonely', 'tag_single_mom', 'tag_father_absent']
),
(
  'in-app',
  'comunidade_convite',
  'Oi, {nome}! 🤱 Hoje no MundoNath tem uma história incrível sobre mães que também sentem solidão. Comenta com um "eu também" se quiser. Você faz parte de uma rede gigante.',
  ARRAY['nome'],
  ARRAY['tag_lonely', 'isolation']
);

-- =====================================================
-- 5. HÁBITO (habit)
-- =====================================================

INSERT INTO message_templates (channel, purpose, template, variables, tags) VALUES
(
  'push',
  'habito_simples_5min',
  'Falta pouco, {nome}! 🍼 Hoje marca um hábito rápido: beber 1 copo d''água agora. 5 segundos, grande impacto. Você consegue!',
  ARRAY['nome'],
  ARRAY['habit_focus']
),
(
  'in-app',
  'habito_encerramento',
  'Fechamento do dia, {nome}! Anote 2 coisas que você fez bem hoje. Treina o cérebro a reconhecer esforço. Você merece celebrar. 💪',
  ARRAY['nome'],
  ARRAY['habit_focus', 'self_care']
);

-- =====================================================
-- 6. ALERTA (alert - crítico)
-- =====================================================

INSERT INTO message_templates (channel, purpose, template, variables, tags) VALUES
(
  'in-app',
  'acolhimento_crise',
  '{nome}, percebemos que você pode estar passando por um momento muito difícil. Você não está sozinha. Aqui estão recursos que podem te ajudar agora mesmo.',
  ARRAY['nome'],
  ARRAY['pp_intrusive', 'harm_thoughts', 'crisis']
),
(
  'in-app',
  'recursos_imediatos',
  'Se você está em crise, ligue AGORA:\n\n🆘 CVV (24h): 188\n🆘 SAMU (emergência): 192\n\nVocê merece ajuda profissional. Não precisa passar por isso sozinha.',
  ARRAY[],
  ARRAY['pp_intrusive', 'harm_thoughts', 'crisis']
);

-- =====================================================
-- 7. CHECK-IN (início do dia)
-- =====================================================

INSERT INTO message_templates (channel, purpose, template, variables, tags) VALUES
(
  'push',
  'checkin_manha',
  'Bom dia, {nome}! 🌅 Como você está hoje? Marque seu humor (1-5) e receba uma dica personalizada para o dia.',
  ARRAY['nome'],
  ARRAY['daily_checkin']
),
(
  'in-app',
  'checkin_energia',
  'Oi, {nome}! Como está sua energia hoje? Alta/Média/Baixa? Vamos ajustar o dia com base no que você sente. 💕',
  ARRAY['nome'],
  ARRAY['daily_checkin']
);

-- =====================================================
-- 8. ENCERRAMENTO (noite)
-- =====================================================

INSERT INTO message_templates (channel, purpose, template, variables, tags) VALUES
(
  'push',
  'encerramento_positivo',
  'Boa noite, {nome}! 🌙 Antes de dormir, lembra: você fez o melhor que podia hoje. E isso é suficiente. Descanse bem.',
  ARRAY['nome'],
  ARRAY['daily_closure']
),
(
  'in-app',
  'gratidao_simples',
  '{nome}, fechando o dia: pensa em 1 coisa boa que aconteceu hoje (pode ser pequena). Gratidão traz paz. Amanhã é um novo dia. 💪',
  ARRAY['nome'],
  ARRAY['daily_closure', 'gratitude']
);

-- =====================================================
-- VALIDAÇÃO
-- =====================================================

DO $$
DECLARE
  template_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO template_count FROM message_templates;
  
  RAISE NOTICE '==============================================';
  RAISE NOTICE '✅ SEED MESSAGE TEMPLATES COMPLETO!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Templates criados: %', template_count;
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Templates disponíveis:';
  RAISE NOTICE '  - Apoio: 2';
  RAISE NOTICE '  - Sono: 2';
  RAISE NOTICE '  - Stress: 2';
  RAISE NOTICE '  - Pertencimento: 2';
  RAISE NOTICE '  - Hábito: 2';
  RAISE NOTICE '  - Alerta: 2';
  RAISE NOTICE '  - Check-in: 2';
  RAISE NOTICE '  - Encerramento: 2';
  RAISE NOTICE '==============================================';
END $$;

