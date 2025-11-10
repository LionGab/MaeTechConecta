/**
 * Context Manager - Gerenciamento inteligente de contexto de longo prazo
 *
 * Sistema de 3 camadas:
 * 1. Contexto Quente (últimas 30 mensagens)
 * 2. Contexto Resumido (mensagens 31-100)
 * 3. Perfil da Usuária (onboarding + dados demográficos)
 *
 * NOTA: Este arquivo contém dependências do Supabase que devem ser injetadas
 * em runtime. Para uso em packages/shared, considere criar uma interface abstrata.
 */

export interface OnboardingData {
  challenges?: string[] | string;
  goals?: string[] | string;
  [key: string]: unknown;
}

export interface UserProfile {
  id: string;
  full_name: string;
  type?: 'gestante' | 'mae' | 'tentante';
  pregnancy_week?: number;
  baby_name?: string;
  preferences?: string[];
  onboarding_data?: OnboardingData;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface LoadedContext {
  recentMessages: Message[];
  historySummary: string;
  userProfile: UserProfile;
  conversationId?: string;
}

/**
 * Context Manager - Gerenciamento de contexto
 *
 * NOTA: Implementação completa requer Supabase client injetado.
 * Esta é uma versão simplificada para packages/shared.
 */
export class ContextManager {
  private userId: string;
  private conversationId: string | null;

  constructor(userId: string, conversationId?: string) {
    this.userId = userId;
    this.conversationId = conversationId || null;
  }

  /**
   * Formata o contexto da usuária para uso com Gemini AI
   *
   * Enriquece o system prompt com informações sobre a usuária (perfil, preferências)
   * e histórico de conversas anteriores (resumido).
   *
   * @param {LoadedContext} context - Contexto carregado da usuária
   * @param {string} systemPrompt - Prompt base do sistema
   * @returns {string} System prompt enriquecido com contexto da usuária
   *
   * @example
   * ```typescript
   * const manager = new ContextManager('user-123');
   * const enrichedPrompt = manager.formatForGemini(context, 'Você é Nat-AI...');
   * // Retorna prompt com informações da usuária incluídas
   * ```
   */
  formatForGemini(context: LoadedContext, systemPrompt: string): string {
    const profileText = this.humanizeProfile(context.userProfile);
    const summaryText = context.historySummary ? `\n\n# RESUMO DE CONVERSAS ANTERIORES\n${context.historySummary}` : '';

    return `${systemPrompt}\n\n# CONTEXTO DA USUÁRIA\n${profileText}${summaryText}`;
  }

  /**
   * Transforma perfil JSON em texto natural
   */
  private humanizeProfile(profile: UserProfile): string {
    let text = `Nome: ${profile.full_name}\n`;

    if (profile.type) {
      const typeText = profile.type === 'gestante' ? `Gestante` : profile.type === 'mae' ? `Mãe` : `Tentante`;
      text += `Tipo: ${typeText}\n`;

      if (profile.type === 'gestante' && profile.pregnancy_week) {
        text += `Semana de gravidez: ${profile.pregnancy_week}\n`;
      }

      if (profile.baby_name) {
        text += `Nome do bebê/filho: ${profile.baby_name}\n`;
      }
    }

    if (profile.preferences && profile.preferences.length > 0) {
      text += `Interesses: ${profile.preferences.join(', ')}\n`;
    }

    if (profile.onboarding_data) {
      const onboarding = profile.onboarding_data;
      if (onboarding.challenges) {
        text += `Desafios mencionados: ${Array.isArray(onboarding.challenges) ? onboarding.challenges.join(', ') : onboarding.challenges}\n`;
      }
      if (onboarding.goals) {
        text += `Objetivos: ${Array.isArray(onboarding.goals) ? onboarding.goals.join(', ') : onboarding.goals}\n`;
      }
    }

    return text;
  }
}

