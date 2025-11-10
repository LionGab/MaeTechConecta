import { DistributionChannel } from './types';

export const MAE_VALENTE_DISTRIBUTION: readonly DistributionChannel[] = [
  {
    name: 'App MãeValente',
    objective: 'Ser hub central de suporte ativo e material de referência.',
    frequency: 'Atualizações diárias + destaque para rituais semanais.',
    owner: 'Conteúdo & Produto',
    kpis: ['Tempo médio no app por sessão', 'Conversões para recursos baixáveis', 'Retenção semanal'],
  },
  {
    name: 'Newsletter “MãeValente Brief”',
    objective: 'Resumo semanal com links e call-to-actions claros.',
    frequency: 'Envio toda segunda-feira 07:30 com edições especiais aos domingos.',
    owner: 'Conteúdo & CRM',
    kpis: ['Taxa de abertura ≥ 48%', 'CTR para toolbox ≥ 15%', 'Respostas qualitativas (reply rate ≥ 8%)'],
  },
  {
    name: 'Instagram / TikTok',
    objective: 'Distribuição rápida de trends e storytelling visual.',
    frequency: 'Posts diários + rituais fixos + reativações sob demanda.',
    owner: 'Conteúdo & Community',
    kpis: [
      'Share of voice vs. competidores',
      'Taxa de salvamento e compartilhamento',
      'Novos seguidores oriundos de conteúdos educacionais',
    ],
  },
  {
    name: 'Podcast quinzenal',
    objective: 'Aprofundar temas dos sprints com especialistas.',
    frequency: 'Episódios a cada 14 dias com cortes semanais.',
    owner: 'Conteúdo & Experiência',
    kpis: [
      'Tempo médio de reprodução',
      'Crescimento de ouvintes únicos',
      'Feedback qualitativo coletado via formulário dedicado',
    ],
  },
  {
    name: 'Parcerias & PR',
    objective: 'Amplificar dados proprietários e reforçar autoridade.',
    frequency: 'Pitches mensais e ativações customizadas por sprint.',
    owner: 'Community & Partnerships',
    kpis: [
      'Quantidade de matérias/publicações conquistadas',
      'Alcance estimado das parcerias',
      'Novas leads/usuárias vindas de parceiros',
    ],
  },
  {
    name: 'Pinterest & Flipboard',
    objective: 'Gerar tráfego evergreen e salvar conteúdos estruturados.',
    frequency: 'Publicações 2x por semana com otimização SEO.',
    owner: 'Design & Experiência',
    kpis: ['Cliques para o app/site', 'Tempo médio nas páginas destino', 'Crescimento de boards seguidores'],
  },
];
