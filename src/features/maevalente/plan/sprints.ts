import { SprintCycle } from './types';
import { MAE_VALENTE_SPRINT_IDS } from './values';

// Ciclos trimestrais integram storytelling + especialistas + desafios coletivos
export const MAE_VALENTE_SPRINTS: readonly SprintCycle[] = [
  {
    id: MAE_VALENTE_SPRINT_IDS[0],
    theme: 'Retorno ao trabalho',
    description: 'Reinserção profissional com rede de apoio estruturada e saúde emocional preservada.',
    phases: [
      {
        week: 1,
        focus: 'Storytelling com diagnóstico das principais dores (culpa, logística, finanças).',
        deliverables: [
          'Série de relatos “Primeira semana de volta”',
          'Quiz interativo no app para mapear dores individuais',
          'Live com Nath contextualizando dados e objetivos do sprint',
        ],
      },
      {
        week: 2,
        focus: 'Especialistas em psicologia e RH para traduzir direitos, acordos e autocuidado.',
        deliverables: [
          'Masterclass curta com psicóloga + e-book de negociação com liderança',
          'Template de carta de retorno + lista de direitos CLT e MEI',
          'Podcast com convidada referência em mães empreendedoras',
        ],
      },
      {
        week: 3,
        focus: 'Ferramenta prática + desafio comunitário (montar plano de retorno personalizado).',
        deliverables: [
          'Planner interativo com track de adaptação',
          'Checklists para rede de apoio e gestão do tempo',
          'Missão de Coragem: compartilhar plano com comunidade',
        ],
      },
      {
        week: 4,
        focus: 'Retro com insights coletivos e ajustes para próxima rodada.',
        deliverables: [
          'Relatório de aprendizados + métricas compartilhadas',
          'Painel público “O que aprendemos”',
          'Pesquisa NPS específica do sprint',
        ],
      },
    ],
    metrics: [
      'Tempo médio consumido nas peças do sprint',
      'CTR para recursos práticos',
      'Taxa de participação no desafio comunitário',
      'NPS do conteúdo trimestral',
    ],
  },
  {
    id: MAE_VALENTE_SPRINT_IDS[1],
    theme: 'Sono do bebê',
    description: 'Educação baseada em evidências + ferramentas para reduzir exaustão materna.',
    phases: [
      {
        week: 1,
        focus: 'Storytelling multiformato com dados do Índice MãeValente.',
        deliverables: [
          'Mapa das noites típicas por faixa etária',
          'Vídeo com especialista traduzindo mitos comuns',
          'Coleta de dúvidas via Typeform para live semana 2',
        ],
      },
      {
        week: 2,
        focus: 'Masterclass com enfermeira obstetra + pediatra para rotinas baseadas em ciência.',
        deliverables: [
          'Live com Q&A respondendo perguntas priorizadas',
          'Carrossel “Sinais de alerta” com guidelines oficiais',
          'Gráfico interativo no app para registrar janelas de sono',
        ],
      },
      {
        week: 3,
        focus: 'Toolbox: planilha de sono, alarmes, scripts para rede de apoio.',
        deliverables: [
          'Template Notion + Google Sheets com rotina ajustável',
          'Áudio relaxamento + playlist Spotify',
          'Desafio coletivo de registro por 7 dias com suporte no chat',
        ],
      },
      {
        week: 4,
        focus: 'Retro + relatórios com benchmarks por idade e recomendações futuras.',
        deliverables: [
          'Dashboard compartilhado com progresso médio',
          'Resumo no newsletter e app com próximos passos',
          'Pesquisa NPS segmentada por faixa etária do bebê',
        ],
      },
    ],
    metrics: [
      'Aderência ao desafio (usuárias que completam os 7 dias)',
      'Redução auto reportada de exaustão em 14 dias',
      'Downloads da toolbox',
      'Taxa de participação na live masterclass',
    ],
  },
  {
    id: MAE_VALENTE_SPRINT_IDS[2],
    theme: 'Rede de apoio',
    description: 'Construir e ativar redes de apoio confiáveis, com guias para família e amigos.',
    phases: [
      {
        week: 1,
        focus: 'Mapeamento das lacunas de apoio e histórias de quem superou isolamento.',
        deliverables: [
          'Podcast com relatos de mães solo, casais homoafetivos e famílias extensas',
          'Canvas para mapear rede atual vs. desejada',
          'Enquete na comunidade para priorizar conteúdos',
        ],
      },
      {
        week: 2,
        focus: 'Especialistas em terapia familiar e direito para orientar conversas difíceis.',
        deliverables: [
          'Live “Como pedir ajuda sem culpa” com roteiro de conversa',
          'Guia legal para quem cuida de crianças (documentação, autorizações)',
          'Checklist para visitas e combinados familiares',
        ],
      },
      {
        week: 3,
        focus: 'Ferramentas: contratos psicológicos, planner de apoio, rota de escalonamento.',
        deliverables: [
          'Template para acordos com rede de apoio (PDF editável)',
          'Tabela com sinais de sobrecarga e planos de contingência',
          'Missão de Coragem: compartilhar plano com parceiro/rede e registrar retorno',
        ],
      },
      {
        week: 4,
        focus: 'Retro coletivo + banco vivo de recursos e contatos úteis.',
        deliverables: [
          'Banco de recursos aberto com filtros (localização, tipo de suporte)',
          'Painel mensal com métricas e histórias de sucesso',
          'Pesquisa NPS e roadmap de próximos temas',
        ],
      },
    ],
    metrics: [
      'Taxa de completude dos planners de apoio',
      'Referências cruzadas (quem compartilha recurso com terceiros)',
      'Participação em Missões de Coragem',
      'Variação do sentimento (sentiment analysis) nas comunidades',
    ],
  },
] as const;

