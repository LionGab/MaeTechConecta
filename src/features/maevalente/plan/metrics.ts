import { MetricDefinition } from './types';

export const MAE_VALENTE_METRICS: readonly MetricDefinition[] = [
  {
    name: 'Tempo médio de suporte ativo',
    description: 'Soma de minutos consumidos em conteúdos + interações participativas em um período.',
    calculation: 'GA4 (tempo médio de sessão) + Supabase (duração lives) + interações comunidade.',
    cadence: 'Semanal (com acompanhamento diário para detectar quedas).',
    owner: 'Data & Insights',
    alertRule: 'Se cair ≥10% na variação semanal → aciona Recovery Sprint em até 24h.',
  },
  {
    name: 'Share of voice social',
    description: 'Participação percentual em conversas sobre maternidade moderna vs. benchmarks.',
    calculation: 'BrandWatch (mentions MãeValente / total cluster).',
    cadence: 'Semanal com digest diário para alertas.',
    owner: 'Data & Insights',
    alertRule: 'Queda de 5 pontos percentuais → revisão de distribuição imediata.',
  },
  {
    name: 'Taxa de salvamento',
    description: 'Percentual de conteúdos salvos em relação a visualizações por formato.',
    calculation: 'Dados nativos das plataformas + Supabase (favoritos).',
    cadence: 'Semanal',
    owner: 'Conteúdo & Narrativa',
    alertRule: 'Se <15% por 2 semanas → revisar storytelling e CTA.',
  },
  {
    name: 'Downloads de recursos',
    description: 'Número absoluto e taxa de conversão para toolboxes lançadas.',
    calculation: 'Supabase tabela de downloads + eventos in-app.',
    cadence: 'Semanal com deep dive quinzenal.',
    owner: 'Conteúdo & Produto',
    alertRule: 'Se conversão <20% → revisar fricção no fluxo e proposta de valor.',
  },
  {
    name: 'Participação em desafios',
    description: 'Percentual de participantes ativos nas Missões de Coragem e desafios de sprint.',
    calculation: 'Supabase eventos + gamification manager.',
    cadence: 'Semanal',
    owner: 'Community & Partnerships',
  },
  {
    name: 'NPS de conteúdo',
    description: 'Métrica de satisfação específica por sprint e conteúdo flagship.',
    calculation: 'Pesquisa in-app + Typeform com sync para Supabase.',
    cadence: 'Ao final de cada sprint + retro mensal.',
    owner: 'Data & Insights',
    alertRule: 'Se <45 → revisão completa da jornada do sprint e mensagens.',
  },
  {
    name: 'Lagging – upgrades e referrals',
    description: 'Conversões para planos pagos, upgrades e convites enviados.',
    calculation: 'Supabase billing + CRM (HubSpot) integrados.',
    cadence: 'Mensal com acompanhamento quinzenal.',
    owner: 'Growth',
  },
];

