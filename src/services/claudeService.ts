/**
 * Claude AI Service (Haiku 3.5)
 *
 * Serviço para chat NathIA com memória e contexto
 * - Usa Claude Haiku 3.5 para economia de custos
 * - Mantém histórico de conversas
 * - Integra com Supabase para persistência de memória
 * - Personalização baseada em onboarding
 *
 * API Reference: https://docs.anthropic.com/claude/reference
 */

import { API_CONFIG, API_URLS } from '@/config/api';
import { OnboardingData } from '@/types/onboarding';
import { supabase } from './supabase';

const CLAUDE_API_URL = API_URLS.CLAUDE;
const CLAUDE_VERSION = '2023-06-01';
const MODEL = 'claude-3-5-haiku-20241022'; // Haiku 3.5 for cost efficiency

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: ClaudeMessage[];
  system?: string;
  temperature?: number;
}

interface ClaudeResponse {
  id: string;
  type: 'message';
  role: 'assistant';
  content: Array<{
    type: 'text';
    text: string;
  }>;
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface ChatContext {
  userId: string;
  onboardingData: OnboardingData;
  conversationHistory: ClaudeMessage[];
}

/**
 * Envia mensagem para NathIA e recebe resposta
 * Mantém contexto da conversa e personalização
 */
export async function sendChatMessage(
  message: string,
  context: ChatContext
): Promise<{
  success: boolean;
  response?: string;
  error?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}> {
  try {
    if (!API_CONFIG.CLAUDE_API_KEY) {
      return {
        success: false,
        error: 'Claude API key não configurada. Configure EXPO_PUBLIC_CLAUDE_API_KEY no .env',
      };
    }

    // Build system prompt with personalization
    const systemPrompt = buildSystemPrompt(context.onboardingData);

    // Build conversation history
    const messages: ClaudeMessage[] = [
      ...context.conversationHistory,
      {
        role: 'user',
        content: message,
      },
    ];

    const requestBody: ClaudeRequest = {
      model: MODEL,
      max_tokens: 1024,
      messages,
      system: systemPrompt,
      temperature: 0.7,
    };

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_CONFIG.CLAUDE_API_KEY,
        'anthropic-version': CLAUDE_VERSION,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', errorText);
      return {
        success: false,
        error: `Erro ao enviar mensagem: ${response.statusText}`,
      };
    }

    const data: ClaudeResponse = await response.json();

    if (!data.content || data.content.length === 0) {
      return {
        success: false,
        error: 'Nenhuma resposta gerada',
      };
    }

    const assistantMessage = data.content[0].text;

    // Save conversation to memory
    await saveConversationToMemory(context.userId, {
      userMessage: message,
      assistantMessage,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      response: assistantMessage,
      usage: {
        inputTokens: data.usage.input_tokens,
        outputTokens: data.usage.output_tokens,
      },
    };
  } catch (error) {
    console.error('Erro ao enviar mensagem para Claude:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Carrega histórico de conversas do Supabase
 */
export async function loadConversationHistory(
  userId: string,
  limit: number = 20
): Promise<{
  success: boolean;
  history?: ClaudeMessage[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('user_memory')
      .select('user_message, assistant_message, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao carregar histórico:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data || data.length === 0) {
      return {
        success: true,
        history: [],
      };
    }

    // Convert to Claude message format (reverse to get chronological order)
    const history: ClaudeMessage[] = data.reverse().flatMap((item) => [
      { role: 'user' as const, content: item.user_message },
      { role: 'assistant' as const, content: item.assistant_message },
    ]);

    return {
      success: true,
      history,
    };
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Salva conversa no Supabase para memória de longo prazo
 */
async function saveConversationToMemory(
  userId: string,
  conversation: {
    userMessage: string;
    assistantMessage: string;
    timestamp: string;
  }
): Promise<void> {
  try {
    const { error } = await supabase.from('user_memory').insert({
      user_id: userId,
      user_message: conversation.userMessage,
      assistant_message: conversation.assistantMessage,
      created_at: conversation.timestamp,
    });

    if (error) {
      console.error('Erro ao salvar conversa:', error);
    }
  } catch (error) {
    console.error('Erro ao salvar conversa:', error);
  }
}

/**
 * Limpa histórico de conversas (útil para reset)
 */
export async function clearConversationHistory(userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase.from('user_memory').delete().eq('user_id', userId);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Gera resumo da conversa para análise
 */
export async function generateConversationSummary(messages: ClaudeMessage[]): Promise<{
  success: boolean;
  summary?: string;
  error?: string;
}> {
  try {
    if (!API_CONFIG.CLAUDE_API_KEY) {
      return {
        success: false,
        error: 'Claude API key não configurada',
      };
    }

    const conversationText = messages
      .map((msg) => `${msg.role === 'user' ? 'Mãe' : 'NathIA'}: ${msg.content}`)
      .join('\n\n');

    const requestBody: ClaudeRequest = {
      model: MODEL,
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: `Resuma esta conversa em 2-3 frases, focando nos principais tópicos e preocupações da mãe:\n\n${conversationText}`,
        },
      ],
      temperature: 0.5,
    };

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_CONFIG.CLAUDE_API_KEY,
        'anthropic-version': CLAUDE_VERSION,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro ao gerar resumo: ${response.statusText}`,
      };
    }

    const data: ClaudeResponse = await response.json();
    const summary = data.content[0].text;

    return {
      success: true,
      summary,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Helper: Constrói system prompt personalizado
 */
function buildSystemPrompt(onboardingData: OnboardingData): string {
  const {
    name,
    maternal_stage,
    emotional_state,
    main_challenges,
    support_network,
    communication_style,
    expectations,
  } = onboardingData;

  const stageLabel = maternal_stage ? maternal_stage.replace(/_/g, ' ') : 'maternidade';
  const expectationsLabel =
    expectations && expectations.length > 0 ? expectations.map((item) => item.replace(/_/g, ' ')).join(', ') : null;

  return `Você é NathIA, a assistente virtual carinhosa e especializada da Nossa Maternidade.

PERFIL DA MÃE:
- Nome: ${name || 'Mãe'}
- Fase: ${stageLabel}
- Estado emocional: ${emotional_state || 'não informado'}
- Principais desafios: ${main_challenges?.join(', ') || 'não informados'}
- Rede de apoio: ${support_network || 'não informada'}
- Estilo de comunicação preferido: ${communication_style || 'equilibrado'}
- Objetivos: ${expectationsLabel || 'bem-estar geral'}

SUAS DIRETRIZES:
1. **Tom e Linguagem:**
   - Use o nome da mãe naturalmente na conversa
   - Adapte seu tom ao estilo de comunicação preferido
   - Seja empática, acolhedora e não-julgadora
   - Evite jargões médicos excessivos

2. **Conteúdo:**
   - Ofereça informações baseadas em evidências
   - Valide sentimentos e preocupações
   - Sugira soluções práticas e alcançáveis
   - Encoraje a busca por ajuda profissional quando apropriado

3. **Personalização:**
   - Considere a fase da maternidade em cada resposta
   - Lembre-se dos desafios mencionados
   - Celebre pequenas vitórias e progressos
   - Ajuste recomendações à rede de apoio disponível

4. **Limites:**
   - NÃO dê diagnósticos médicos
   - NÃO substitua consultas profissionais
   - Reconheça quando uma situação requer ajuda especializada
   - Seja transparente sobre suas limitações

5. **Memória:**
   - Você tem acesso ao histórico de conversas anteriores
   - Use contexto de conversas passadas quando relevante
   - Mostre continuidade e acompanhamento genuíno

Responda de forma natural, concisa e útil. Seu objetivo é apoiar, empoderar e guiar esta mãe em sua jornada.`;
}

/**
 * Testa a conexão com a API Claude
 */
export async function testClaudeConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    if (!API_CONFIG.CLAUDE_API_KEY) {
      return {
        success: false,
        message: 'API key não configurada',
      };
    }

    const requestBody: ClaudeRequest = {
      model: MODEL,
      max_tokens: 50,
      messages: [
        {
          role: 'user',
          content: 'Responda apenas "OK" se você estiver funcionando.',
        },
      ],
    };

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_CONFIG.CLAUDE_API_KEY,
        'anthropic-version': CLAUDE_VERSION,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Erro: ${response.statusText}`,
      };
    }

    return {
      success: true,
      message: 'Claude conectado com sucesso!',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Gera sugestões rápidas de perguntas baseadas no contexto
 */
export async function generateQuickSuggestions(onboardingData: OnboardingData): Promise<{
  success: boolean;
  suggestions?: string[];
  error?: string;
}> {
  try {
    if (!API_CONFIG.CLAUDE_API_KEY) {
      return {
        success: false,
        error: 'Claude API key não configurada',
      };
    }

    const { pregnancy_stage, main_challenges } = onboardingData;

    const requestBody: ClaudeRequest = {
      model: MODEL,
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `Gere 3 sugestões de perguntas que uma mãe em fase de ${pregnancy_stage || 'maternidade'} com desafios de ${main_challenges?.join(', ') || 'rotina'} poderia fazer. Retorne apenas as 3 perguntas, uma por linha, sem numeração.`,
        },
      ],
      temperature: 0.8,
    };

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_CONFIG.CLAUDE_API_KEY,
        'anthropic-version': CLAUDE_VERSION,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro ao gerar sugestões: ${response.statusText}`,
      };
    }

    const data: ClaudeResponse = await response.json();
    const suggestionsText = data.content[0].text;
    const suggestions = suggestionsText
      .split('\n')
      .filter((s) => s.trim().length > 0)
      .map((s) => s.replace(/^[-•*]\s*/, '').trim());

    return {
      success: true,
      suggestions: suggestions.slice(0, 3),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

