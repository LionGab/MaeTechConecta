import { CommunityLoopInitiative, SquadRole, TrendResponsePlay, TrendSource } from './types';

export const MAE_VALENTE_SQUAD: readonly SquadRole[] = [
  {
    role: 'Data & Insights',
    responsibilities: [
      'Atualizar dashboards (GA4, Supabase, BrandWatch, Pinterest Trends) diariamente',
      'Gerar briefing semanal com tendências, gaps de conteúdo e alertas de risco',
      'Validar dados sensíveis antes de publicação (fatos, números, legislação)',
    ],
    rituals: [
      'Daily stand-up 15 min',
      'Revisão quinzenal de KPIs com squad completo',
      'Retrospectiva mensal para ajustes de métricas e automações',
    ],
  },
  {
    role: 'Conteúdo & Narrativa',
    responsibilities: [
      'Transformar insights em roteiros multiformato alinhados aos pilares',
      'Garantir tom consistente entre app, newsletter, podcast e redes sociais',
      'Criar kits modulares (motion, carrossel, scripts) com designers',
    ],
    rituals: [
      'Sprint planning quinzenal com backlog de pautas',
      'Revisão de qualidade (peer review) antes da publicação',
      'Documentação de aprendizados em Notion após cada sprint',
    ],
  },
  {
    role: 'Design & Experiência',
    responsibilities: [
      'Manter componentes visuais atualizados no Figma (templates mobile-first)',
      'Criar assets para toolbox, lives, podcasts e recursos baixáveis',
      'Garantir acessibilidade (WCAG 2.1 AA) e consistência com design system',
    ],
    rituals: [
      'Crit semanal de design focado em narrativas em andamento',
      'Revisão de coerência visual com Mundo da Nath a cada sprint',
      'Atualização do design kit para creator network trimestralmente',
    ],
  },
  {
    role: 'Community & Partnerships',
    responsibilities: [
      'Ativar canais privados com teasers, enquetes e coleta de perguntas',
      'Gerenciar creator network (onboarding, incentivos, acompanhamento)',
      'Fechar parcerias com hospitais, doulas, marcas baby tech e especialistas',
    ],
    rituals: [
      'Checkpoints com creators duas vezes por semana',
      'Reunião com parceiros estratégicos a cada sprint',
      'Atualização do painel público “O que aprendemos com vocês” mensalmente',
    ],
  },
];

export const MAE_VALENTE_TREND_SOURCES: readonly TrendSource[] = [
  {
    name: 'Google Trends – cluster maternidade',
    cadence: 'Daily 08:00 e 16:00',
    owner: 'Data & Insights',
    automation: 'Alertas via Slack usando Make → canal #maevalente-radar',
  },
  {
    name: 'TikTok Creative Center – saúde & parentalidade',
    cadence: 'Daily 10:00',
    owner: 'Conteúdo & Narrativa',
    automation: 'Dashboard Looker Studio com favoritos e sons emergentes',
  },
  {
    name: 'BrandWatch – menções MãeValente + dores maternas',
    cadence: 'Realtime com digest 3x/dia',
    owner: 'Data & Insights',
    automation: 'Alertas críticos enviados para squad via Slack + e-mail',
  },
  {
    name: 'Threads/X listas curadas (especialistas, legisladores)',
    cadence: 'Daily 19:00',
    owner: 'Community & Partnerships',
    automation: 'Notion database com ranking de relevância atualizado manualmente',
  },
  {
    name: 'Pinterest Trends – planejamento familiar',
    cadence: '2x por semana',
    owner: 'Design & Experiência',
    automation: 'Relatório automático no Notion com pins que performaram melhor',
  },
];

export const MAE_VALENTE_TREND_RESPONSE: readonly TrendResponsePlay[] = [
  {
    trigger: 'Trending com impacto direto (legislação, saúde pública, crise)',
    expectedSlaHours: 3,
    actions: [
      'Reunião flash (15 min) com Data, Conteúdo e Especialista para validar informação',
      'Publicação “Alerta” em app + redes com CTA para recurso confiável',
      'Atualização em tempo real de FAQ e envio de push segmentado',
    ],
  },
  {
    trigger: 'Tendência cultural ou viral relevante',
    expectedSlaHours: 6,
    actions: [
      'Criar short explicativo conectando trend ao contexto materno',
      'Carrossel “Como aplicar” com link para toolbox relacionada',
      'Briefing para creator network produzir versões personalizadas',
    ],
  },
  {
    trigger: 'Insight recorrente da comunidade (≥5 mentions/dia)',
    expectedSlaHours: 12,
    actions: [
      'Analisar sentimento e exemplos no painel “O que aprendemos”',
      'Responder oficialmente no canal onde surgiu com recurso existente',
      'Priorizar conteúdo aprofundado no próximo ritual aplicável',
    ],
  },
];

export const MAE_VALENTE_COMMUNITY_LOOP: readonly CommunityLoopInitiative[] = [
  {
    name: 'Missões de Coragem',
    description: 'Desafios semanais com tarefas pequenas e feedback rápido para estimular ação.',
    successCriteria: [
      'Taxa de conclusão ≥ 60%',
      'Pelo menos 20 relatos públicos por missão',
      'Aumento de 15% em engajamento dentro da comunidade privada',
    ],
  },
  {
    name: 'Painel “O que aprendemos com vocês”',
    description: 'Resumo mensal transparente com métricas, decisões tomadas e próximos passos.',
    successCriteria: [
      'Entrega publicada até dia 05 de cada mês',
      'Feedback positivo (emoji/sentimento) ≥ 80%',
      'Sugestões da comunidade integradas às pautas futuras',
    ],
  },
  {
    name: 'Creator Network',
    description: 'Grupo de 5–7 mães em diferentes fases com pauta relâmpago e incentivos claros.',
    successCriteria: [
      'Pelo menos 3 conteúdos reativos publicados por semana',
      'Participação em avaliações quinzenais',
      'Conteúdos co-criados com alcance ≥ 2x média individual',
    ],
  },
];
