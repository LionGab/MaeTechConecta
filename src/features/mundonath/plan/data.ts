import { MundoNathPlan } from './types';

const TONE = [
  {
    id: 'intimidade-sem-filtro',
    description: 'Compartilhar bastidores reais com vulnerabilidade e aprendizados pessoais.',
    practicalExamples: [
      'Stories mostrando rotina real, inclusive percalços',
      'Reels com reflexões curtas sobre sentimentos da semana',
      'Newsletter “Carta da Nath” com parágrafos escritos no formato diário',
    ],
  },
  {
    id: 'didatica-afetiva',
    description: 'Traduzir conceitos complexos em linguagem direta e acolhedora, sempre com gancho de ação.',
    practicalExamples: [
      'Explicar dados do MãeValente com analogias pessoais',
      'Compartilhar frameworks que ela mesma usa',
      'Encerrar conteúdos com convite para experimentar recurso da semana',
    ],
  },
  {
    id: 'convite-a-dialogo',
    description: 'Estimular respostas e construção coletiva para alimentar escuta ativa.',
    practicalExamples: [
      'Polls e caixinhas de perguntas nos Stories diariamente',
      'Lives com chat sempre aberto para perguntas de última hora',
      'Encerrar posts com “Quero saber como é pra você”',
    ],
  },
] as const;

const GUARDRAILS = [
  {
    id: 'coerencia-com-campanhas',
    focus: 'Garantir que CTAs e narrativas direcionem para hubs ativos da MãeValente.',
    boundaries: [
      'Evitar promoções desconectadas do tema trimestral',
      'Não anunciar recursos sem checar disponibilidade',
      'Revisar dados sensíveis com time de insights antes de publicar',
    ],
    alignmentChecks: [
      'Calendário compartilhado no Notion com tema principal da semana',
      'Revisão rápida no Slack #conteudo-nath antes de posts críticos',
    ],
  },
  {
    id: 'seguranca-psicologica',
    focus: 'Equilibrar vulnerabilidade com direcionamento para suporte qualificado.',
    boundaries: [
      'Ao narrar crises, incluir aviso de gatilho e recursos de ajuda',
      'Evitar expor terceiros sem consentimento',
      'Limitar conselhos médicos; sempre indicar especialistas credenciados',
    ],
    alignmentChecks: [
      'Checklist pré-postagem com perguntas sobre impacto emocional',
      'Link fixo para hub de ajuda no Linktree/biografia',
    ],
  },
] as const;

const FORMATS = [
  {
    id: 'stories-dia-real',
    cadence: 'Diário (mínimo 8 stories com narrativa início-meio-fim).',
    channel: 'Instagram Stories + repost no Close Friends da comunidade.',
    structure: [
      'Gancho emocional',
      'Contexto do dia',
      'Pergunta ou enquete',
      'Referência ao recurso ou tema da semana',
    ],
    ctas: [
      'Arrasta para conhecer recurso',
      'Vote para priorizar pauta',
      'Responda com seu desafio para aparecer no Radar',
    ],
  },
  {
    id: 'live-semanal',
    cadence: 'Toda quinta-feira, 30 minutos.',
    channel: 'Instagram + YouTube simultâneo com transmissão para app.',
    structure: [
      'Abertura com bastidor da semana',
      'Tema central conectado ao sprint',
      'Bloco de perguntas ao vivo',
      'Resumo com direcionamento para conteúdo aprofundado',
    ],
    ctas: ['Baixe a toolbox desta semana', 'Entre na Missão de Coragem', 'Inscreva-se no domingo Plano com Nath'],
  },
  {
    id: 'newsletter-carta-da-nath',
    cadence: 'Mensal (última terça-feira do mês).',
    channel: 'E-mail dedicado com template minimalista.',
    structure: [
      'Carta em primeira pessoa',
      'Aprendizados do mês',
      'Links favoritos e bastidores',
      'Próximo grande movimento da comunidade',
    ],
    ctas: ['Responder com feedback', 'Compartilhar com outra mãe', 'Participar do próximo sprint temático'],
  },
  {
    id: 'colabs',
    cadence: 'Bimestral ou quando houver oportunidade estratégica.',
    channel: 'Lives ou conteúdos co-criados com outras criadoras.',
    structure: ['Introdução das convidadas', 'Discussão prática', 'Troca de recursos', 'CTA cruzado para comunidades'],
    ctas: ['Seguir convidada e baixar recurso conjunto', 'Participar da comunidade para acompanhamento pós-live'],
  },
] as const;

const INTEGRATIONS = [
  {
    context: 'Calendário compartilhado',
    expectation: 'Nath marca slots livres; squad garante que entregas de MãeValente estejam prontas antes.',
    crossPromotion: [
      'Usar o mesmo tema semanal nas aberturas dos stories e posts do app',
      'Inserir cards “Do app para você” sempre que citar recurso',
    ],
  },
  {
    context: 'Analytics compartilhado',
    expectation: 'Dashboard simples com posts top performers e triggers de CTA.',
    crossPromotion: ['Time envia insights toda segunda', 'Nath comenta principais aprendizados na live semanal'],
  },
  {
    context: 'Conteúdos destacados',
    expectation: 'Cortes das lives da Nath viram anúncios nativos e cápsulas dentro do app.',
    crossPromotion: ['Marcação no app com selo “Da Nath”', 'Link nos stories para assistir corte exclusivo'],
  },
] as const;

const ANALYTICS = [
  {
    metric: 'Engajamento nas stories (respostas + DM)',
    owner: 'Community',
    insightAction: 'Se resposta <10% em 7 dias → testar novos prompts e horários.',
  },
  {
    metric: 'Conversões via CTAs da Nath',
    owner: 'Growth',
    insightAction: 'Reportar semanalmente quais CTAs geraram mais downloads/upgrades.',
  },
  {
    metric: 'Share of trend topics citados pela Nath',
    owner: 'Data & Insights',
    insightAction: 'Garantir que pelo menos 60% das tendências relevantes apareçam em até 48h.',
  },
] as const;

export const MUNDO_NATH_PLAN: MundoNathPlan = {
  tone: TONE,
  guardrails: GUARDRAILS,
  formats: FORMATS,
  integrations: INTEGRATIONS,
  analytics: ANALYTICS,
};

