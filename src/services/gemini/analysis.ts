/**
 * Gemini Analysis Service - Análise contextual e triagem
 *
 * Fornece funcionalidades para:
 * - Triagem pós-parto (EPDS) com análise psicológica profunda
 * - Análise de perfis de usuárias para insights personalizados
 * - Extração estruturada de dados de conversas
 *
 * Usa Gemini 2.5 Pro como padrão para análises críticas (precisão > custo).
 * Flash pode ser usado para análises mais simples quando especificado.
 *
 * @example
 * ```typescript
 * const analysisService = createAnalysisService();
 *
 * // Triagem pós-parto
 * const screening = await analysisService.analyzePostpartumScreening({
 *   onboardingData: userOnboarding,
 *   epdsScore: 15,
 *   epdsAnswers: [...],
 *   sentimentHistory: [...],
 *   userId: 'user-123',
 * });
 *
 * if (screening.success && screening.data?.needsProfessionalHelp) {
 *   // Encaminhar para profissional
 * }
 * ```
 *
 * @module @/services/gemini/analysis
 */

import { createGeminiClient } from './base';
import { GeminiClient, GeminiModel, GeminiResponseData, GeminiUsageMetadata } from './types';
import {
  buildPostpartumScreeningPrompt,
  buildProfileAnalysisPrompt,
  extractPrimaryText,
  parseJsonResponse,
} from './utils';
import { logger } from '@/lib/logger';
import { OnboardingData } from '@/types/onboarding';

export interface ScreeningConversation {
  message: string;
  response?: string;
  createdAt?: string;
}

export interface PostpartumScreeningInput {
  onboardingData: OnboardingData;
  epdsScore: number;
  epdsAnswers: Array<{ question: string; score: number; rawAnswer?: string }>;
  sentimentHistory?: Array<{ score: number; label: string; createdAt: string }>;
  recentConversations?: ScreeningConversation[];
  userId: string;
  requestId?: string;
  preferProModel?: boolean;
}

export interface PostpartumScreeningResultData {
  riskScore: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  symptoms: string[];
  riskFactors: string[];
  protectiveFactors: string[];
  recommendations: string[];
  needsProfessionalHelp: boolean;
  emergencyResources?: Array<{ text: string; number: string }>;
}

export interface PostpartumScreeningResult {
  success: boolean;
  data?: PostpartumScreeningResultData;
  model?: GeminiModel;
  raw?: GeminiResponseData;
  usage?: GeminiUsageMetadata;
  error?: string;
}

export interface ProfileAnalysisParams {
  onboardingData: OnboardingData;
  chatSummary?: string;
  habitsSummary?: string;
  riskLevel?: number;
  userId: string;
  requestId?: string;
  preferProModel?: boolean;
}

export interface ProfileInsight {
  key: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  suggestedAction: string;
}

export interface ProfileAnalysisResult {
  success: boolean;
  insights?: ProfileInsight[];
  model?: GeminiModel;
  raw?: GeminiResponseData;
  usage?: GeminiUsageMetadata;
  error?: string;
}

function chooseModel(preferProModel: boolean | undefined, client: GeminiClient): GeminiModel {
  return preferProModel ? 'gemini-2.5-pro' : client.config.defaultModel;
}

export function createAnalysisService(customClient?: GeminiClient) {
  const client = customClient ?? createGeminiClient();

  async function analyzePostpartumScreening(input: PostpartumScreeningInput): Promise<PostpartumScreeningResult> {
    const { onboardingData, epdsScore, epdsAnswers, sentimentHistory, recentConversations, userId, requestId } = input;

    try {
      const prompt = buildPostpartumScreeningPrompt({
        onboardingData,
        epdsScore,
        epdsAnswers,
        sentimentHistory,
        recentConversations,
      });

      const model = chooseModel(input.preferProModel ?? true, client);

      const response = await client.call({
        contents: prompt.contents,
        systemInstruction: prompt.systemInstruction,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 650,
        },
        model,
        userId,
        requestId,
        rateLimitKey: `analysis:postpartum:${userId}`,
      });

      const jsonText = extractPrimaryText(response);
      const parsed = parseJsonResponse<PostpartumScreeningResultData>(jsonText);

      if (!parsed) {
        return {
          success: false,
          error: 'Não foi possível interpretar a triagem pós-parto',
        };
      }

      return {
        success: true,
        data: parsed,
        model,
        raw: response,
        usage: response.usageMetadata,
      };
    } catch (error) {
      logger.error('Erro ao executar triagem pós-parto com Gemini', error instanceof Error ? error : undefined, {
        error: error instanceof Error ? error.message : String(error),
        requestId: input.requestId,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao analisar triagem pós-parto',
      };
    }
  }

  async function analyzeUserProfile(params: ProfileAnalysisParams): Promise<ProfileAnalysisResult> {
    const { onboardingData, chatSummary, habitsSummary, riskLevel, userId, requestId, preferProModel } = params;

    try {
      const prompt = buildProfileAnalysisPrompt({
        onboardingData,
        chatSummary,
        habitsSummary,
        riskLevel,
      });

      const model = chooseModel(preferProModel, client);

      const response = await client.call({
        contents: prompt.contents,
        systemInstruction: prompt.systemInstruction,
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 500,
        },
        model,
        userId,
        requestId,
        rateLimitKey: `analysis:profile:${userId}`,
      });

      const jsonText = extractPrimaryText(response);
      const parsed = parseJsonResponse<ProfileInsight[]>(jsonText);

      if (!parsed || parsed.length === 0) {
        return {
          success: false,
          error: 'Não foi possível gerar insights do perfil',
        };
      }

      return {
        success: true,
        insights: parsed,
        model,
        raw: response,
        usage: response.usageMetadata,
      };
    } catch (error) {
      logger.error('Erro ao analisar perfil de usuária com Gemini', error instanceof Error ? error : undefined, {
        error: error instanceof Error ? error.message : String(error),
        userId,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao analisar perfil',
      };
    }
  }

  return {
    analyzePostpartumScreening,
    analyzeUserProfile,
    config: client.config,
  };
}
