/**
 * Gemini Chat Service - Serviço de chat empático para NathIA
 *
 * Fornece funcionalidades de chat com:
 * - Histórico de conversas gerenciado automaticamente
 * - System prompts personalizados baseados em onboarding
 * - Seleção inteligente de modelo (Flash para maioria, Pro para contexto longo)
 * - Tratamento de erros com fallback empático
 *
 * @example
 * ```typescript
 * const chatService = createChatService();
 * const result = await chatService.sendMessage({
 *   message: 'Estou me sentindo ansiosa hoje',
 *   history: previousMessages,
 *   onboardingData: userOnboarding,
 *   userId: 'user-123',
 * });
 *
 * if (result.success) {
 *   console.log(result.text); // Resposta empática da NathIA
 * }
 * ```
 *
 * @module @/services/gemini/chat
 */

import { createGeminiClient } from './base';
import { GeminiCallOptions, GeminiClient, GeminiModel, GeminiResponseData, GeminiUsageMetadata } from './types';
import { buildChatContents, buildChatSystemPrompt, extractPrimaryText } from './utils';
import { logger } from '@/lib/logger';
import { OnboardingData } from '@/types/onboarding';

export interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string | Date;
}

export interface SendChatMessageParams {
  message: string;
  history?: ChatMessageInput[];
  onboardingData?: OnboardingData;
  userId: string;
  requestId?: string;
  preferProModel?: boolean;
  extraContext?: string[];
  abortSignal?: AbortSignal;
}

export interface ChatMessageResult {
  success: boolean;
  text?: string;
  model?: GeminiModel;
  raw?: GeminiResponseData;
  usage?: GeminiUsageMetadata;
  error?: string;
}

const MAX_HISTORY_MESSAGES = 10;
const PRO_THRESHOLD_CHAR_COUNT = 5_000;

function shouldPreferProModel(params: SendChatMessageParams): boolean {
  if (params.preferProModel) {
    return true;
  }

  const historyText = (params.history ?? [])
    .slice(-MAX_HISTORY_MESSAGES)
    .map((item) => item.content)
    .join(' ');

  const combinedLength = historyText.length + params.message.length + (params.extraContext?.join(' ').length ?? 0);

  return combinedLength >= PRO_THRESHOLD_CHAR_COUNT;
}

function selectModel(params: SendChatMessageParams, client: GeminiClient): GeminiModel {
  return shouldPreferProModel(params) ? 'gemini-2.5-pro' : client.config.defaultModel;
}

/**
 * Cria um serviço de chat empático configurado
 *
 * @param customClient - Cliente Gemini customizado (opcional)
 * @returns Serviço de chat com método sendMessage
 */
export function createChatService(customClient?: GeminiClient) {
  const client = customClient ?? createGeminiClient();

  async function sendMessage(params: SendChatMessageParams): Promise<ChatMessageResult> {
    try {
      const { message, history = [], onboardingData, userId, requestId, extraContext = [], abortSignal } = params;

      if (!message.trim()) {
        return {
          success: false,
          error: 'Mensagem vazia não pode ser enviada',
        };
      }

      const model = selectModel(params, client);
      const systemInstruction = buildChatSystemPrompt(onboardingData);
      const contents = buildChatContents({
        history: history.slice(-MAX_HISTORY_MESSAGES),
        latestUserMessage: message,
        extraContext,
      });

      const callOptions: GeminiCallOptions = {
        contents,
        systemInstruction,
        model,
        userId,
        requestId,
        abortSignal,
        rateLimitKey: `chat:${userId}`,
        generationConfig:
          model === 'gemini-2.5-pro'
            ? {
                temperature: 0.75,
                maxOutputTokens: 900,
              }
            : {
                temperature: 0.8,
                maxOutputTokens: 600,
              },
      };

      const response = await client.call(callOptions);
      const text = extractPrimaryText(response);

      if (!text) {
        return {
          success: false,
          error: 'Não foi possível obter uma resposta da NathIA',
        };
      }

      return {
        success: true,
        text,
        model,
        raw: response,
        usage: response.usageMetadata,
      };
    } catch (error) {
      logger.error('Erro ao enviar mensagem para NathIA', error instanceof Error ? error : undefined, {
        error: error instanceof Error ? error.message : String(error),
        requestId: params.requestId,
        userId: params.userId,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao conversar com NathIA',
      };
    }
  }

  return {
    sendMessage,
    config: client.config,
  };
}

