/**
 * Tipos e interfaces do Onboarding "Nossa Maternidade"
 * Sistema completo de coleta de dados + personalização
 */

/**
 * Estágio de maternidade do usuário
 */
export type MaternalStage = 'tentante' | 'gestante' | 'puerperio' | 'mae_estabelecida';

/**
 * Emoção principal do usuário
 */
export type Emotion = 'exausta' | 'ansiosa' | 'feliz' | 'insegura' | 'equilibrada' | 'triste';

/**
 * Frequência de autocuidado
 */
export type SelfCareFrequency = 'nunca' | '1x_semana' | '2-3x_semana' | 'diariamente';

/**
 * Qualidade de sono
 */
export type SleepQuality = 'pessima' | 'ruim' | 'regular' | 'boa' | 'otima';

/**
 * Nível de rede de apoio
 */
export type SupportNetworkLevel = 'mucho' | 'algum' | 'pouco' | 'nenhum';

/**
 * Estilo de comunicação com a Nath
 */
export type CommunicationStyle = 'casual' | 'empatica' | 'direta' | 'formal';

/**
 * Desafios principais da mãe
 */
export const MAIN_CHALLENGES = [
  'sono_bebe',
  'amamentacao',
  'falta_tempo',
  'ansiedade',
  'rotina',
  'falta_apoio',
  'culpa',
  'exaustao',
  'julgamento',
  'relacionamento',
  'trabalho',
] as const;

export type MainChallenge = (typeof MAIN_CHALLENGES)[number];

/**
 * Necessidades principais
 */
export const MAIN_NEEDS = [
  'descanso',
  'organizacao',
  'apoio_emocional',
  'conexao',
  'autocuidado',
  'ajuda_profissional',
  'dicas_praticas',
] as const;

export type MainNeed = (typeof MAIN_NEEDS)[number];

/**
 * Expectativas e objetivo
 */
export const EXPECTATIONS = [
  'conexao',
  'aprendizado',
  'apoio_emocional',
  'informacoes_praticas',
  'reduzir_solidao',
  'celebrar_conquistas',
] as const;

export type Expectation = (typeof EXPECTATIONS)[number];

/**
 * Conteúdos de interesse
 */
export const CONTENT_INTERESTS = [
  'alimentacao',
  'exercicios',
  'bem_estar_mental',
  'parto',
  'amamentacao',
  'sono',
  'desenvolvimento',
  'relacionamento',
  'skin_care',
  'estilo_vida',
] as const;

export type ContentInterest = (typeof CONTENT_INTERESTS)[number];

/**
 * Dados completos do onboarding
 * Estruturado em 5 blocos
 */
export interface OnboardingData {
  // BLOCO 1: Apresentação & Identidade
  name: string;
  maternal_stage: MaternalStage;
  gestation_week?: number; // 1-40 (se gestante)
  baby_name?: string;
  baby_age_months?: number; // em meses (se mãe estabelecida/puerpério)

  // BLOCO 2: Autocuidado & Emoções
  self_care_frequency: SelfCareFrequency;
  emotional_state: Emotion;
  stress_level: number; // 1-10
  sleep_quality: SleepQuality;
  energy_level: number; // 1-10

  // BLOCO 3: Desafios & Necessidades
  main_challenges: MainChallenge[];
  challenges_details?: string; // campo livre
  main_needs: MainNeed[];

  // BLOCO 4: Rede de Apoio
  support_network: SupportNetworkLevel;
  support_details?: string; // campo livre

  // BLOCO 5: Expectativas & Preferências
  what_brought_here?: string;
  expectations: Expectation[];
  content_interests: ContentInterest[];
  communication_style: CommunicationStyle;

  // Metadata
  completed_at?: Date;
  completed_steps?: number; // 0-5
}

/**
 * Formulário incompleto durante preenchimento
 */
export interface OnboardingFormState extends Partial<OnboardingData> {
  current_step: number; // 0-4
}

/**
 * Resultado de validação
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Perfil do usuário gerado a partir do onboarding
 */
export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  maternal_stage: MaternalStage;
  gestation_week?: number;
  baby_name?: string;
  baby_age_months?: number;
  communication_style: CommunicationStyle;
  content_interests: ContentInterest[];
  main_challenges: MainChallenge[];
  onboarding_completed: boolean;
  onboarding_completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

/**
 * Preferências do usuário para personalização
 */
export interface UserPreferences {
  id: string;
  user_id: string;
  communication_style: CommunicationStyle;
  content_interests: ContentInterest[];
  main_challenges: MainChallenge[];
  emotional_state: Emotion;
  stress_level: number;
  energy_level: number;
  feed_personalization_enabled: boolean;
  chat_personalization_enabled: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Mapa de labels para exibição
 */
export const LABELS = {
  maternal_stage: {
    tentante: 'Tentante',
    gestante: 'Gestante',
    puerperio: 'Mãe no puerpério',
    mae_estabelecida: 'Mãe já estabelecida',
  },
  emotion: {
    exausta: '😫 Exausta',
    ansiosa: '😰 Ansiosa',
    feliz: '😊 Feliz',
    insegura: '😕 Insegura',
    equilibrada: '😌 Equilibrada',
    triste: '😢 Triste',
  },
  self_care_frequency: {
    nunca: 'Nunca',
    '1x_semana': '1x por semana',
    '2-3x_semana': '2-3x por semana',
    diariamente: 'Diariamente',
  },
  sleep_quality: {
    pessima: 'Péssima',
    ruim: 'Ruim',
    regular: 'Regular',
    boa: 'Boa',
    otima: 'Ótima',
  },
  support_network: {
    mucho: 'Sim, tenho muito apoio',
    algum: 'Tenho algum',
    pouco: 'Pouco',
    nenhum: 'Nenhum',
  },
  communication_style: {
    casual: 'Casual e amiga',
    empatica: 'Empática e acolhedora',
    direta: 'Direta e objetiva',
    formal: 'Formal e respeitosa',
  },
  main_challenges: {
    sono_bebe: 'Sono do bebê',
    amamentacao: 'Amamentação',
    falta_tempo: 'Falta de tempo',
    ansiedade: 'Ansiedade',
    rotina: 'Rotina',
    falta_apoio: 'Falta de apoio',
    culpa: 'Culpa',
    exaustao: 'Exaustão',
    julgamento: 'Julgamento',
    relacionamento: 'Relacionamento',
    trabalho: 'Trabalho',
  },
  main_needs: {
    descanso: 'Descanso',
    organizacao: 'Organização',
    apoio_emocional: 'Apoio emocional',
    conexao: 'Conexão',
    autocuidado: 'Autocuidado',
    ajuda_profissional: 'Ajuda profissional',
    dicas_praticas: 'Dicas práticas',
  },
  expectations: {
    conexao: 'Conexão',
    aprendizado: 'Aprendizado',
    apoio_emocional: 'Apoio emocional',
    informacoes_praticas: 'Informações práticas',
    reduzir_solidao: 'Reduzir solidão',
    celebrar_conquistas: 'Celebrar conquistas',
  },
  content_interests: {
    alimentacao: '🍽️ Alimentação',
    exercicios: '🏃‍♀️ Exercícios',
    bem_estar_mental: '🧠 Bem-estar mental',
    parto: '👶 Parto',
    amamentacao: '🍼 Amamentação',
    sono: '😴 Sono',
    desenvolvimento: '📈 Desenvolvimento',
    relacionamento: '💑 Relacionamento',
    skin_care: '✨ Skin care',
    estilo_vida: '✨ Estilo de vida',
  },
};

/**
 * Emojis para emoções
 */
export const EMOTION_EMOJIS = {
  exausta: '😫',
  ansiosa: '😰',
  feliz: '😊',
  insegura: '😕',
  equilibrada: '😌',
  triste: '😢',
} as const;

/**
 * Configuração de cada step do onboarding
 */
export interface OnboardingStepConfig {
  step: number;
  title: string;
  subtitle: string;
  emoji: string;
  requiredFields: (keyof OnboardingData)[];
}

export const ONBOARDING_STEPS: OnboardingStepConfig[] = [
  {
    step: 0,
    title: 'Oi, eu sou a Nath 🌸',
    subtitle: 'Quero te conhecer melhor pra deixar tudo aqui com a sua cara.',
    emoji: '👋',
    requiredFields: ['name', 'maternal_stage'],
  },
  {
    step: 1,
    title: 'Eu sei que a maternidade pode ser intensa',
    subtitle: 'Vamos entender como você está hoje?',
    emoji: '💭',
    requiredFields: ['self_care_frequency', 'emotional_state'],
  },
  {
    step: 2,
    title: 'Agora quero entender seus desafios',
    subtitle: 'O que está mais desafiador pra você nesse momento?',
    emoji: '🌊',
    requiredFields: ['main_challenges'],
  },
  {
    step: 3,
    title: 'Ninguém deveria viver maternidade sozinha',
    subtitle: 'Me conta um pouco sobre o seu círculo.',
    emoji: '👥',
    requiredFields: [],
  },
  {
    step: 4,
    title: 'Por fim, quero saber suas expectativas',
    subtitle: 'Pra que cada momento aqui faça sentido pra você 💙',
    emoji: '✨',
    requiredFields: ['expectations', 'communication_style'],
  },
];

