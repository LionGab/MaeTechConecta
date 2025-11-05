/**
 * Model Router - Roteamento de Modelos IA
 * 
 * Roteia requisições para o modelo IA apropriado baseado no tipo de tarefa,
 * contexto e disponibilidade de API keys.
 */

export type AIModel = 'claude' | 'gemini' | 'perplexity' | 'manus' | 'fallback';

export type TaskType = 
  | 'empathy'      // Empatia/conversa
  | 'moderation'   // Moderação de conteúdo
  | 'long-context' // Análise de contexto longo
  | 'research'     // Pesquisa/citações
  | 'execution';   // Execução de tarefas

export interface ModelRouterConfig {
  /** API keys disponíveis */
  apiKeys: {
    anthropic?: string;
    gemini?: string;
    perplexity?: string;
    manus?: string;
  };
  
  /** Modelo preferencial por tarefa */
  preferences?: Partial<Record<TaskType, AIModel>>;
  
  /** Fallback quando modelo preferido indisponível */
  fallback?: AIModel;
}

export interface RoutingDecision {
  model: AIModel;
  reason: string;
  apiKey?: string;
}

/**
 * Roteia tarefa para o modelo IA apropriado
 */
export function routeModel(
  taskType: TaskType,
  config: ModelRouterConfig
): RoutingDecision {
  const { apiKeys, preferences, fallback = 'fallback' } = config;

  // 1. Verificar preferência explícita
  const preferred = preferences?.[taskType];
  if (preferred && hasApiKey(preferred, apiKeys)) {
    return {
      model: preferred,
      reason: `Rota preferencial para ${taskType}`,
      apiKey: getApiKey(preferred, apiKeys),
    };
  }

  // 2. Roteamento por tipo de tarefa
  const taskRouting: Record<TaskType, AIModel[]> = {
    empathy: ['claude', 'gemini', 'fallback'],
    moderation: ['claude', 'gemini', 'fallback'],
    'long-context': ['gemini', 'claude', 'fallback'],
    research: ['perplexity', 'gemini', 'fallback'],
    execution: ['manus', 'claude', 'fallback'],
  };

  const candidates = taskRouting[taskType] || [fallback];

  // 3. Selecionar primeiro modelo disponível
  for (const model of candidates) {
    if (hasApiKey(model, apiKeys)) {
      return {
        model,
        reason: `Roteamento automático para ${taskType}`,
        apiKey: getApiKey(model, apiKeys),
      };
    }
  }

  // 4. Fallback final
  return {
    model: fallback,
    reason: 'Nenhum modelo disponível, usando fallback',
  };
}

/**
 * Verifica se API key está disponível para modelo
 */
function hasApiKey(model: AIModel, apiKeys: ModelRouterConfig['apiKeys']): boolean {
  switch (model) {
    case 'claude':
      return !!apiKeys.anthropic;
    case 'gemini':
      return !!apiKeys.gemini;
    case 'perplexity':
      return !!apiKeys.perplexity;
    case 'manus':
      return !!apiKeys.manus;
    case 'fallback':
      return true; // Sempre disponível
    default:
      return false;
  }
}

/**
 * Retorna API key para modelo
 */
function getApiKey(
  model: AIModel,
  apiKeys: ModelRouterConfig['apiKeys']
): string | undefined {
  switch (model) {
    case 'claude':
      return apiKeys.anthropic;
    case 'gemini':
      return apiKeys.gemini;
    case 'perplexity':
      return apiKeys.perplexity;
    case 'manus':
      return apiKeys.manus;
    default:
      return undefined;
  }
}

/**
 * Configuração padrão de roteamento
 */
export const DEFAULT_ROUTING: Partial<Record<TaskType, AIModel>> = {
  empathy: 'claude',
  moderation: 'claude',
  'long-context': 'gemini',
  research: 'perplexity',
  execution: 'manus',
};
