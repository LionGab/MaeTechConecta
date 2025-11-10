/**
 * Gemini Content Service - Geração de conteúdo personalizado
 *
 * Fornece funcionalidades para gerar:
 * - Insights diários personalizados
 * - Desafios diários baseados em objetivos
 * - Mensagens motivacionais
 * - Conteúdo exclusivo do Mundo Nath
 *
 * Usa Gemini 2.5 Flash como padrão (custo-benefício otimizado).
 * Pode usar Pro para conteúdo premium quando necessário.
 *
 * @example
 * ```typescript
 * const contentService = createContentService();
 *
 * // Gerar insight diário
 * const insight = await contentService.generateDailyInsight({
 *   onboardingData: userOnboarding,
 *   context: { timeOfDay: 'manha', recentTopics: ['ansiedade'] },
 *   userId: 'user-123',
 * });
 *
 * // Gerar desafios
 * const challenges = await contentService.generateDailyChallenges({
 *   onboardingData: userOnboarding,
 *   userId: 'user-123',
 * });
 * ```
 *
 * @module @/services/gemini/content
 */

import { createGeminiClient } from './base';
import { GeminiClient, GeminiModel, GeminiResponseData, GeminiUsageMetadata } from './types';
import {
  buildDailyChallengesPrompt,
  buildDailyInsightPrompt,
  buildMundoNathPrompt,
  buildMotivationalPrompt,
  extractPrimaryText,
  parseChallengesResponse,
} from './utils';
import { logger } from '@/lib/logger';
import { OnboardingData } from '@/types/onboarding';

export type TimeOfDay = 'manha' | 'tarde' | 'noite';

export interface ContentContext {
  timeOfDay?: TimeOfDay;
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
}

export interface DailyInsightParams {
  onboardingData: OnboardingData;
  context?: ContentContext;
  userId: string;
  requestId?: string;
  preferProModel?: boolean;
}

export interface DailyInsightResult {
  success: boolean;
  text?: string;
  model?: GeminiModel;
  raw?: GeminiResponseData;
  usage?: GeminiUsageMetadata;
  error?: string;
}

export interface DailyChallengesParams {
  onboardingData: OnboardingData;
  context?: ContentContext;
  userId: string;
  requestId?: string;
  preferProModel?: boolean;
}

export interface ChallengeItem {
  title: string;
  description: string;
  category: 'autocuidado' | 'maternidade' | 'saude' | 'emocional';
  difficulty: 'easy' | 'medium' | 'hard';
  cta?: string;
}

export interface DailyChallengesResult {
  success: boolean;
  challenges?: ChallengeItem[];
  model?: GeminiModel;
  raw?: GeminiResponseData;
  usage?: GeminiUsageMetadata;
  error?: string;
}

export interface MotivationalMessageParams {
  onboardingData: OnboardingData;
  context?: ContentContext;
  userId: string;
  requestId?: string;
  preferProModel?: boolean;
}

export interface MotivationalMessageResult {
  success: boolean;
  text?: string;
  model?: GeminiModel;
  raw?: GeminiResponseData;
  usage?: GeminiUsageMetadata;
  error?: string;
}

export interface MundoNathParams {
  onboardingData: OnboardingData;
  theme: string;
  highlights: string[];
  callToAction?: string;
  userId: string;
  requestId?: string;
  preferProModel?: boolean;
}

export interface MundoNathResult {
  success: boolean;
  text?: string;
  model?: GeminiModel;
  raw?: GeminiResponseData;
  usage?: GeminiUsageMetadata;
  error?: string;
}

function resolveModel(preferProModel: boolean | undefined, client: GeminiClient): GeminiModel {
  return preferProModel ? 'gemini-2.5-pro' : client.config.defaultModel;
}

export function createContentService(customClient?: GeminiClient) {
  const client = customClient ?? createGeminiClient();

  async function generateDailyInsight(params: DailyInsightParams): Promise<DailyInsightResult> {
    const { onboardingData, context, userId, requestId, preferProModel } = params;

    try {
      const prompt = buildDailyInsightPrompt(onboardingData, context);
      const model = resolveModel(preferProModel, client);

      const response = await client.call({
        contents: prompt.contents,
        systemInstruction: prompt.systemInstruction,
        generationConfig:
          model === 'gemini-2.5-pro'
            ? {
                temperature: 0.7,
                maxOutputTokens: 450,
              }
            : {
                temperature: 0.8,
                maxOutputTokens: 300,
              },
        model,
        userId,
        requestId,
        rateLimitKey: `content:insight:${userId}`,
      });

      const text = extractPrimaryText(response);

      if (!text) {
        return {
          success: false,
          error: 'Não foi possível gerar o insight diário',
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
      logger.error('Erro ao gerar insight diário com Gemini', error instanceof Error ? error : undefined, {
        error: error instanceof Error ? error.message : String(error),
        requestId,
        userId,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao gerar insight diário',
      };
    }
  }

  async function generateDailyChallenges(params: DailyChallengesParams): Promise<DailyChallengesResult> {
    const { onboardingData, context, userId, requestId, preferProModel } = params;

    try {
      const prompt = buildDailyChallengesPrompt(onboardingData, context);
      const model = resolveModel(preferProModel, client);

      const response = await client.call({
        contents: prompt.contents,
        systemInstruction: prompt.systemInstruction,
        generationConfig: {
          temperature: 0.75,
          maxOutputTokens: 500,
        },
        model,
        userId,
        requestId,
        rateLimitKey: `content:challenges:${userId}`,
      });

      const challenges = parseChallengesResponse(response);

      if (!challenges || challenges.length === 0) {
        return {
          success: false,
          error: 'Nenhum desafio válido foi gerado',
        };
      }

      return {
        success: true,
        challenges,
        model,
        raw: response,
        usage: response.usageMetadata,
      };
    } catch (error) {
      logger.error('Erro ao gerar desafios diários com Gemini', error instanceof Error ? error : undefined, {
        error: error instanceof Error ? error.message : String(error),
        requestId,
        userId,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao gerar desafios diários',
      };
    }
  }

  async function generateMotivationalMessage(params: MotivationalMessageParams): Promise<MotivationalMessageResult> {
    const { onboardingData, context, userId, requestId, preferProModel } = params;

    try {
      const prompt = buildMotivationalPrompt(onboardingData, context);
      const model = resolveModel(preferProModel, client);

      const response = await client.call({
        contents: prompt.contents,
        systemInstruction: prompt.systemInstruction,
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 250,
        },
        model,
        userId,
        requestId,
        rateLimitKey: `content:motivation:${userId}`,
      });

      const text = extractPrimaryText(response);

      if (!text) {
        return {
          success: false,
          error: 'Não foi possível gerar a mensagem motivacional',
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
      logger.error('Erro ao gerar mensagem motivacional com Gemini', error instanceof Error ? error : undefined, {
        error: error instanceof Error ? error.message : String(error),
        requestId,
        userId,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao gerar mensagem motivacional',
      };
    }
  }

  async function generateMundoNathContent(params: MundoNathParams): Promise<MundoNathResult> {
    const { onboardingData, theme, highlights, callToAction, userId, requestId, preferProModel } = params;

    try {
      const prompt = buildMundoNathPrompt({ onboardingData, theme, highlights, callToAction });
      const model = resolveModel(preferProModel ?? true, client);

      const response = await client.call({
        contents: prompt.contents,
        systemInstruction: prompt.systemInstruction,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600,
        },
        model,
        userId,
        requestId,
        rateLimitKey: `content:mundo-nath:${userId}`,
      });

      const text = extractPrimaryText(response);

      if (!text) {
        return {
          success: false,
          error: 'Não foi possível gerar o conteúdo do Mundo Nath',
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
      logger.error('Erro ao gerar conteúdo Mundo Nath com Gemini', error instanceof Error ? error : undefined, {
        error: error instanceof Error ? error.message : String(error),
        requestId,
        userId,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao gerar conteúdo Mundo Nath',
      };
    }
  }

  return {
    generateDailyInsight,
    generateDailyChallenges,
    generateMotivationalMessage,
    generateMundoNathContent,
    config: client.config,
  };
}
