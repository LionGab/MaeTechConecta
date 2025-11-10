import { WeeklyRitual } from './types';
import { MAE_VALENTE_RITUAL_IDS } from './values';

// Rituais garantem cadência fixa e educação da audiência sobre os formatos recorrentes
export const MAE_VALENTE_WEEKLY_RITUALS: readonly WeeklyRitual[] = [
  {
    id: MAE_VALENTE_RITUAL_IDS[0],
    title: 'Segunda Radar',
    dayOfWeek: 'monday',
    objective: 'Apresentar tendências críticas e oportunidades para mães logo no início da semana.',
    coreDeliverables: [
      'Vídeo short com ranking de tópicos emergentes',
      'Carrossel com resumo e links para aprofundamento',
      'Nota no app com insights e CTA para discussão na comunidade',
    ],
    distributionChannels: ['Instagram Reels', 'TikTok', 'App MãeValente (push + card destaque)', 'Newsletter Brief'],
    successSignals: [
      'Taxa de salvamento > 18%',
      'Tempo médio > 75% do vídeo assistido',
      'Discussões iniciadas em canais privados nas 24h seguintes',
    ],
  },
  {
    id: MAE_VALENTE_RITUAL_IDS[1],
    title: 'Quarta Toolbox',
    dayOfWeek: 'wednesday',
    objective: 'Entregar recurso pronto para implementar imediatamente.',
    coreDeliverables: [
      'Template Notion/Google com passo a passo',
      'Áudio guiado ou mini live prática (≤20 min)',
      'Post “Como usar” com screenshots do recurso',
    ],
    distributionChannels: [
      'App (sessão Recursos)',
      'Comunidade Telegram/Discord',
      'E-mail segmentado para leads envolvidos no tema',
    ],
    successSignals: [
      'Downloads > 25% dos usuários que visualizaram',
      'Feedback qualitativo positivo (>70% “ajudou” no quick poll)',
      'Usuários retornando para compartilhar experiência em até 72h',
    ],
  },
  {
    id: MAE_VALENTE_RITUAL_IDS[2],
    title: 'Sexta Vitória',
    dayOfWeek: 'friday',
    objective: 'Celebrar conquistas e reforçar senso de comunidade e progresso.',
    coreDeliverables: [
      'UGC selecionado com relato e aprendizado',
      'Badge digital atribuída no perfil via gamificação',
      'Resumo das vitórias coletivas da semana',
    ],
    distributionChannels: [
      'Stories com stickers e CTA para enviar relatos',
      'Feed Instagram com mosaico das conquistas',
      'Notificação in-app para abrir mural de vitórias',
    ],
    successSignals: [
      '≥30 relatos enviados por semana',
      'Retenção da comunidade privada acima de 85%',
      'Aumento de 10% em convites/referrals pós-postagem',
    ],
  },
  {
    id: MAE_VALENTE_RITUAL_IDS[3],
    title: 'Domingo Plano',
    dayOfWeek: 'sunday',
    objective: 'Organizar a semana com planejamento guiado usando dados + checklist compartilhável.',
    coreDeliverables: [
      'Live (45 min) de planejamento com especialistas convidados',
      'Checklist interativo no app com status sincronizado',
      'Resumo enviado via e-mail com links úteis e datas importantes',
    ],
    distributionChannels: [
      'YouTube + app (Live embedded)',
      'Newsletter especial de domingo',
      'Podcast (versão áudio com marcadores)',
    ],
    successSignals: [
      'Taxa de presença live ≥ 28% da base ativa',
      'Checklist concluído por 40% das participantes',
      'Feedback NPS ≥ 55 no formulário pós-evento',
    ],
  },
] as const;
