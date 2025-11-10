/**
 * Gemini AI Service (Legacy - Mantido para compatibilidade)
 *
 * @deprecated Use os serviços especializados de @/services/gemini:
 * - createContentService() para insights, desafios e motivação
 * - createChatService() para chat empático
 * - createAnalysisService() para análises
 *
 * Este arquivo mantém compatibilidade com código existente mas
 * internamente usa o novo serviço base otimizado.
 *
 * API Reference: https://ai.google.dev/gemini-api/docs
 */

import { OnboardingData } from '@/types/onboarding';
import { createContentService } from './gemini/content';
import { createGeminiClient } from './gemini/base';
import { extractPrimaryText } from './gemini/utils';

/**
 * Gera insights diários personalizados para a Home
 * Baseado no perfil e preferências da mãe
 */
export async function generateDailyInsight(onboardingData: OnboardingData): Promise<{
  success: boolean;
  insight?: string;
  error?: string;
}> {
  const contentService = createContentService();

  const result = await contentService.generateDailyInsight({
    onboardingData,
    userId: 'legacy', // Para compatibilidade, usar userId genérico
  });

  return {
    success: result.success,
    insight: result.text,
    error: result.error,
  };
}

/**
 * Gera desafios diários personalizados
 * Baseado nos desafios e objetivos da mãe
 */
export async function generateDailyChallenges(onboardingData: OnboardingData): Promise<{
  success: boolean;
  challenges?: Array<{
    title: string;
    description: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
  error?: string;
}> {
  const contentService = createContentService();

  const result = await contentService.generateDailyChallenges({
    onboardingData,
    userId: 'legacy',
  });

  if (!result.success || !result.challenges) {
    return {
      success: false,
      error: result.error,
    };
  }

  return {
    success: true,
    challenges: result.challenges.map((challenge) => ({
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      difficulty: challenge.difficulty,
    })),
  };
}

/**
 * Gera mensagem motivacional para MãeValente
 * Baseado no progresso e estado emocional
 */
export async function generateMotivationalMessage(
  onboardingData: OnboardingData,
  context?: {
    recentHabits?: string[];
    emotionalState?: string;
  }
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  const contentService = createContentService();

  const result = await contentService.generateMotivationalMessage({
    onboardingData,
    context: context
      ? {
          recentHabits: context.recentHabits,
          emotionalState: context.emotionalState,
        }
      : undefined,
    userId: 'legacy',
  });

  return {
    success: result.success,
    message: result.text,
    error: result.error,
  };
}

/**
 * Testa a conexão com a API Gemini
 */
export async function testGeminiConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const client = createGeminiClient();

    const response = await client.call({
      contents: [
        {
          role: 'user',
          parts: [{ text: 'Responda apenas "OK" se você estiver funcionando.' }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 10,
      },
      userId: 'test',
      requestId: 'connection-test',
    });

    const text = extractPrimaryText(response);

    if (text && text.toLowerCase().includes('ok')) {
      return {
        success: true,
        message: 'Gemini conectado com sucesso!',
      };
    }

    return {
      success: false,
      message: 'Resposta inesperada do Gemini',
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}
