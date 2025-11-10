import { GeminiContent, GeminiContentPart, GeminiResponseData } from './types';
import { OnboardingData } from '@/types/onboarding';
import { logger } from '@/lib/logger';

type SystemPromptResult = {
  systemInstruction: string;
  contents: GeminiContent[];
};

type BuildChatContentsParams = {
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  latestUserMessage: string;
  extraContext?: string[];
};

type MundoNathPromptParams = {
  onboardingData: OnboardingData;
  theme: string;
  highlights: string[];
  callToAction?: string;
};

type PostpartumPromptParams = {
  onboardingData: OnboardingData;
  epdsScore: number;
  epdsAnswers: Array<{ question: string; score: number; rawAnswer?: string }>;
  sentimentHistory?: Array<{ score: number; label: string; createdAt: string }>;
  recentConversations?: Array<{ message: string; response?: string; createdAt?: string }>;
};

type ProfileAnalysisPromptParams = {
  onboardingData: OnboardingData;
  chatSummary?: string;
  habitsSummary?: string;
  riskLevel?: number;
};

type ContentPromptParams = {
  onboardingData: OnboardingData;
  context?: {
    timeOfDay?: 'manha' | 'tarde' | 'noite';
    recentTopics?: string[];
    recentHabits?: string[];
    gamification?: {
      currentStreak?: number;
      totalPoints?: number;
      level?: number;
    };
    emotionalState?: string;
    recentMessages?: string[];
    riskLevel?: number;
  };
};

const DEFAULT_TONE = `Você é NathIA, a voz da Nossa Maternidade e fala em português brasileiro.
Tom: acolhedor, empático, linguagem simples (classe C-D), sem termos clínicos sem explicação.
Sempre valide emoções antes de aconselhar. Não prescreva medicamentos, nem substitua atendimento médico.`;

export function buildChatSystemPrompt(onboarding?: OnboardingData): string {
  if (!onboarding) {
    return DEFAULT_TONE;
  }

  return `${DEFAULT_TONE}

Perfil da usuária:
- Nome: ${onboarding.name || 'querida'}
- Fase: ${onboarding.maternal_stage || 'maternidade'}
- Objetivos: ${onboarding.expectations?.join(', ') || 'bem-estar geral'}
- Desafios: ${onboarding.main_challenges?.join(', ') || 'não informados'}
- Estilo de comunicação: ${onboarding.communication_style || 'equilibrado'}`;
}

function toContent(role: 'user' | 'model', text: string): GeminiContent {
  const part: GeminiContentPart = { text };
  return {
    role,
    parts: [part],
  };
}

function trimHistory(history: Array<{ role: 'user' | 'assistant'; content: string }>, limit: number): typeof history {
  return history.slice(-limit);
}

export function buildChatContents(params: BuildChatContentsParams): GeminiContent[] {
  const history = trimHistory(params.history, 10).map((entry) =>
    toContent(entry.role === 'assistant' ? 'model' : 'user', entry.content)
  );

  if (params.extraContext && params.extraContext.length > 0) {
    history.push(
      toContent(
        'user',
        `Contexto adicional recente:
${params.extraContext.map((ctx, index) => `${index + 1}. ${ctx}`).join('\n')}`
      )
    );
  }

  return [...history, toContent('user', params.latestUserMessage.trim())];
}

export function extractPrimaryText(response: GeminiResponseData | null | undefined): string | null {
  if (!response?.candidates?.length) {
    return null;
  }

  const [candidate] = response.candidates;
  const firstPart = candidate?.content?.parts?.[0]?.text;

  return firstPart ? firstPart.trim() : null;
}

export function parseJsonResponse<T>(raw: string | null | undefined): T | null {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    logger.warn('Falha ao fazer parse de JSON do Gemini', { raw, error });
    return null;
  }
}

export function buildDailyInsightPrompt(
  params: ContentPromptParams['onboardingData'],
  context?: ContentPromptParams['context']
): SystemPromptResult {
  const systemInstruction = `${DEFAULT_TONE}
Você gera insights diários curtos (2-3 frases) com uma dica prática.`;

  const insightContext = `Dados da mãe:
- Nome: ${params.name || 'Mãe'}
- Fase: ${params.maternal_stage || 'maternidade'}
- Desafios atuais: ${params.main_challenges?.join(', ') || 'não informados'}
- Objetivos: ${params.expectations?.join(', ') || 'bem-estar geral'}
- Estilo desejado: ${params.communication_style || 'equilibrado'}

Contexto adicional:
- Momento do dia: ${context?.timeOfDay || 'não informado'}
- Tópicos recentes: ${context?.recentTopics?.join(', ') || 'nenhum'}
- Emoções detectadas: ${context?.emotionalState || 'não informada'}
- Hábito recente: ${context?.recentHabits?.slice(0, 3).join(', ') || 'sem registro'}
- Nível de risco: ${context?.riskLevel ?? 'desconhecido'}

Gere um insight com:
- Saudações com o nome (ou "querida" se desconhecido)
- Validação emocional
- Uma dica acionável simples
- Convidar a retomar o diário ou desafios se fizer sentido
- Sem marketing externo.`;

  return {
    systemInstruction,
    contents: [toContent('user', insightContext)],
  };
}

export function buildDailyChallengesPrompt(
  onboarding: OnboardingData,
  context?: ContentPromptParams['context']
): SystemPromptResult {
  const systemInstruction = `${DEFAULT_TONE}
Você cria desafios diários práticos, focados em autocuidado e maternidade.`;

  const prompt = `Dados da mãe:
- Fase: ${onboarding.maternal_stage || 'maternidade'}
- Objetivos: ${onboarding.expectations?.join(', ') || 'bem-estar geral'}
- Desafios principais: ${onboarding.main_challenges?.join(', ') || 'gerais'}

Contexto adicional:
- Atividade recente: ${context?.recentHabits?.length ? `${context.recentHabits.length} hábitos concluídos` : 'sem atividade recente'}
- Nível de risco: ${context?.riskLevel ?? 'desconhecido'}

Retorne APENAS um JSON com até 3 desafios no formato:
[
  {
    "title": "Título curto",
    "description": "Descrição com 1-2 frases",
    "category": "autocuidado|maternidade|saude|emocional",
    "difficulty": "easy|medium|hard",
    "cta": "Chamada opcional"
  }
]
Sem texto extra antes ou depois.`;

  return {
    systemInstruction,
    contents: [toContent('user', prompt)],
  };
}

export function buildMotivationalPrompt(
  onboarding: OnboardingData,
  context?: ContentPromptParams['context']
): SystemPromptResult {
  const systemInstruction = `${DEFAULT_TONE}
Você gera mensagens motivacionais curtas que celebram pequenas vitórias.`;

  const prompt = `Dados:
- Nome: ${onboarding.name || 'querida'}
- Estilo: ${onboarding.communication_style || 'equilibrado'}
- Hábito recente: ${context?.recentHabits?.[0] || 'nenhum hábito destacado'}
- Emoção atual: ${context?.emotionalState || 'não informada'}

Mensagem desejada:
- 2 a 3 frases curtas
- Celebrar algo positivo
- Reforçar apoio
- Terminar com convite suave para autocuidado
- Sem prometer diagnósticos.`;

  return {
    systemInstruction,
    contents: [toContent('user', prompt)],
  };
}

export function buildMundoNathPrompt(params: MundoNathPromptParams): SystemPromptResult {
  const systemInstruction = `${DEFAULT_TONE}
Você cria conteúdo exclusivo "Mundo Nath" com storytelling caloroso.`;

  const prompt = `Tema do dia: ${params.theme}
Destaques:
${params.highlights.map((item, index) => `${index + 1}. ${item}`).join('\n')}

Perfil da mãe referência:
- Fase: ${params.onboardingData.maternal_stage || 'maternidade'}
- Objetivos: ${params.onboardingData.expectations?.join(', ') || 'cuidado com o bebê e autocuidado'}

Estrutura esperada (texto contínuo):
1. Abertura acolhedora (1 frase)
2. Bastidores/rotina real com pelo menos 2 detalhes concretos
3. Insight prático inspirado na rotina
4. Chamada para que a leitora compartilhe algo (ex.: "Conta pra mim nos comentários...")
${params.callToAction ? `5. Chamada específica: ${params.callToAction}` : ''}

Formato: texto fluido, 3-4 parágrafos curtos.`;

  return {
    systemInstruction,
    contents: [toContent('user', prompt)],
  };
}

export function buildPostpartumScreeningPrompt(params: PostpartumPromptParams): SystemPromptResult {
  const systemInstruction = `${DEFAULT_TONE}
Você é psicóloga perinatal analisando risco de depressão pós-parto.
Siga protocolos EPDS + DSM-5. Use linguagem clara em português.`;

  const prompt = `Dados da usuária:
${JSON.stringify(
  {
    name: params.onboardingData.name,
    stage: params.onboardingData.maternal_stage,
    goals: params.onboardingData.expectations,
    challenges: params.onboardingData.main_challenges,
    epdsScore: params.epdsScore,
    epdsAnswers: params.epdsAnswers,
    sentimentHistory: params.sentimentHistory,
    recentConversations: params.recentConversations,
  },
  null,
  2
)}

Retorne APENAS JSON válido com campos:
{
  "riskScore": number,
  "riskLevel": "low" | "moderate" | "high" | "critical",
  "symptoms": string[],
  "riskFactors": string[],
  "protectiveFactors": string[],
  "recommendations": string[],
  "needsProfessionalHelp": boolean,
  "emergencyResources": [{"text": string, "number": string}] opcional
}
Sem comentários extras.`;

  return {
    systemInstruction,
    contents: [toContent('user', prompt)],
  };
}

export function buildProfileAnalysisPrompt(params: ProfileAnalysisPromptParams): SystemPromptResult {
  const systemInstruction = `${DEFAULT_TONE}
Você é estrategista de bem-estar que gera insights personalizados para o app.`;

  const prompt = `Dados consolidados da usuária:
- Nome: ${params.onboardingData.name || 'Mãe corajosa'}
- Fase: ${params.onboardingData.maternal_stage || 'maternidade'}
- Objetivos: ${params.onboardingData.expectations?.join(', ') || 'não informados'}
- Desafios: ${params.onboardingData.main_challenges?.join(', ') || 'não informados'}
- Risco atual: ${params.riskLevel ?? 'não avaliado'}
- Resumo do chat: ${params.chatSummary || 'sem conversa recente'}
- Resumo de hábitos: ${params.habitsSummary || 'sem hábitos registrados'}

Retorne APENAS JSON com até 4 insights:
[
  {
    "key": "identificador-curto",
    "description": "Descrição (1 frase)",
    "priority": "low" | "medium" | "high",
    "suggestedAction": "Ação concreta"
  }
]`;

  return {
    systemInstruction,
    contents: [toContent('user', prompt)],
  };
}

export function parseChallengesResponse(response: GeminiResponseData): Array<{
  title: string;
  description: string;
  category: 'autocuidado' | 'maternidade' | 'saude' | 'emocional';
  difficulty: 'easy' | 'medium' | 'hard';
  cta?: string;
}> {
  const text = extractPrimaryText(response);
  const parsed = parseJsonResponse<Array<Record<string, unknown>>>(text);

  if (!parsed) {
    return [];
  }

  const validCategories = ['autocuidado', 'maternidade', 'saude', 'emocional'] as const;
  const validDifficulties = ['easy', 'medium', 'hard'] as const;

  parsed.forEach((item, index) => {
    const category = item.category;
    const difficulty = item.difficulty;
    const title = item.title;
    const description = item.description;

    if (typeof category !== 'string' || !validCategories.includes(category as (typeof validCategories)[number])) {
      throw new Error(`Categoria inválida em challenges[${index}]`);
    }

    if (
      typeof difficulty !== 'string' ||
      !validDifficulties.includes(difficulty as (typeof validDifficulties)[number])
    ) {
      throw new Error(`Dificuldade inválida em challenges[${index}]`);
    }

    if (typeof title !== 'string' || !title.trim()) {
      throw new Error(`Título inválido em challenges[${index}]`);
    }

    if (typeof description !== 'string' || !description.trim()) {
      throw new Error(`Descrição inválida em challenges[${index}]`);
    }
  });

  return parsed.map((item) => ({
    title: item.title as string,
    description: item.description as string,
    category: item.category as (typeof validCategories)[number],
    difficulty: item.difficulty as (typeof validDifficulties)[number],
    cta: typeof item.cta === 'string' ? item.cta : undefined,
  }));
}

