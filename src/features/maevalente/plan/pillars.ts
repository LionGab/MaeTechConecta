import { EditorialPillar } from './types';
import { MAE_VALENTE_PILLAR_IDS } from './values';

// Cada pilar sintetiza o eixo narrativo e guarda exemplos para briefing rápido
export const MAE_VALENTE_PILLARS: readonly EditorialPillar[] = [
  {
    id: MAE_VALENTE_PILLAR_IDS[0],
    title: 'Experiências reais',
    description: 'Histórias de mães da comunidade mostrando coragem, vulnerabilidade e práticas aplicadas.',
    proofPoints: [
      'Relatos captados nas lives e canais fechados',
      'UGC enviado via Missões de Coragem',
      'Estudos de caso curtos com métricas de evolução',
    ],
    keyActions: [
      'Publicar “Diários de Coragem” semanais conectados aos desafios do sprint vigente',
      'Distribuir cuts das lives com legendas e CTAs para comunidade fechada',
      'Gerar insights para squads de produto com base em dores recorrentes',
    ],
  },
  {
    id: MAE_VALENTE_PILLAR_IDS[1],
    title: 'Ciência e especialistas',
    description: 'Conteúdo validado por profissionais (pediatras, psicólogas, enfermeiras obstetras) com dados claros.',
    proofPoints: [
      'Parcerias com conselhos profissionais e hospitais de referência',
      'Revisão técnica das pautas sensíveis',
      'Dados proprietários do Índice MãeValente',
    ],
    keyActions: [
      'Calendário trimestral com agenda de especialistas e releases oficiais',
      'Quadros “Mito ou Fato” e “Pergunte para a especialista”',
      'Transcrição SEO-friendly para artigos longos e notas do podcast',
    ],
  },
  {
    id: MAE_VALENTE_PILLAR_IDS[2],
    title: 'Ferramentas práticas',
    description: 'Recursos aplicáveis imediatamente: checklists, rotinas, micro-hábitos e templates editáveis.',
    proofPoints: [
      'Biblioteca com métricas de download e implementação',
      'Feedback contínuo via Intercom e NPS pós-conteúdo',
      'Resultados dos desafios de execução guiada',
    ],
    keyActions: [
      'Lançar toolbox semanal com entrega tagueada por tema e nível de complexidade',
      'Disponibilizar versões em Notion, Google Sheets e PDF acessível',
      'Monitorar taxa de implementação e coletar sugestões de melhorias',
    ],
  },
  {
    id: MAE_VALENTE_PILLAR_IDS[3],
    title: 'Cultura e tendências',
    description: 'Análises rápidas de notícias, virais e políticas públicas com impacto na maternidade.',
    proofPoints: [
      'Alertas automatizados do BrandWatch e Google Trends',
      'Quadros de contextualização produzidos em <6h',
      'Tracking de engajamento em conteúdos reativos',
    ],
    keyActions: [
      'Publicar “Segunda Radar” com ranking de tópicos críticos',
      'Conectar tendências a ações práticas (ex.: legislação → checklist de direitos)',
      'Criar Q&A com especialistas quando o assunto for sensível',
    ],
  },
  {
    id: MAE_VALENTE_PILLAR_IDS[4],
    title: 'Autocuidado integral',
    description: 'Equilíbrio físico, mental e financeiro para mães, com foco em rede de apoio e bem-estar sustentável.',
    proofPoints: [
      'Dados do diário emocional e trilhas de saúde mental',
      'Sessões guiadas por especialistas em finanças e fisioterapia',
      'Indicadores de burnout materno monitorados mensalmente',
    ],
    keyActions: [
      'Planejar séries temáticas de autocuidado com desafios semanais',
      'Integrar recursos de respiração guiada, yoga e planejamento financeiro',
      'Criar painel público de recursos para rede de apoio (familiares, amigos, parceiros)',
    ],
  },
] as const;
