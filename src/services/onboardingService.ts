/**
 * Serviço de Onboarding
 * Responsável por:
 * - Salvar dados do onboarding em Supabase
 * - Atualizar perfil do usuário
 * - Gerar preferências personalizadas
 * - Validar dados
 */

import { supabase } from './supabase';
import {
  OnboardingData,
  UserProfile,
  UserPreferences,
  ValidationResult,
  ONBOARDING_STEPS,
} from '@/types/onboarding';
import { logger } from '@/utils/logger';

/**
 * Imagens por sessão do onboarding
 * 1 imagem por bloco
 */
export const ONBOARDING_STEP_IMAGES = {
  0: require('@/assets/images/onboarding/nat1.png'),
  1: require('@/assets/images/onboarding/nat2.png'),
  2: require('@/assets/images/onboarding/nat3.png'),
  3: require('@/assets/images/onboarding/nat1.png'),
  4: require('@/assets/images/onboarding/nat2.png'),
};

/**
 * Salvar dados do onboarding no Supabase
 */
export async function saveOnboardingData(
  userId: string,
  data: OnboardingData
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Validar antes de salvar
    const validation = validateOnboardingData(data);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join('; '),
      };
    }

    // Salvar em user_onboarding table
    const { error: onboardingError } = await supabase
      .from('user_onboarding')
      .upsert({
        user_id: userId,
        name: data.name,
        maternal_stage: data.maternal_stage,
        gestation_week: data.gestation_week || null,
        baby_name: data.baby_name || null,
        baby_age_months: data.baby_age_months || null,
        self_care_frequency: data.self_care_frequency,
        emotional_state: data.emotional_state,
        stress_level: data.stress_level,
        sleep_quality: data.sleep_quality,
        energy_level: data.energy_level,
        main_challenges: data.main_challenges,
        challenges_details: data.challenges_details || null,
        main_needs: data.main_needs,
        support_network: data.support_network,
        support_details: data.support_details || null,
        what_brought_here: data.what_brought_here || null,
        expectations: data.expectations,
        content_interests: data.content_interests,
        communication_style: data.communication_style,
        completed_at: new Date(),
      });

    if (onboardingError) {
      logger.error(
        'Erro ao salvar onboarding',
        onboardingError instanceof Error ? onboardingError : undefined,
        {
          userId,
          error: onboardingError instanceof Error ? onboardingError.message : String(onboardingError),
        }
      );
      return { success: false, error: 'Erro ao salvar dados' };
    }

    // Atualizar perfil do usuário
    await updateUserProfile(userId, data);

    // Salvar preferências para personalização
    await updateUserPreferences(userId, data);

    logger.info('Onboarding salvo com sucesso', { userId });

    return { success: true };
  } catch (onboardingError) {
    logger.error(
      'Erro ao salvar onboarding',
      onboardingError instanceof Error ? onboardingError : undefined,
      {
        userId,
        error: onboardingError instanceof Error ? onboardingError.message : String(onboardingError),
      }
    );
    throw onboardingError;
  }
}

/**
 * Atualizar perfil do usuário baseado em onboarding
 */
async function updateUserProfile(userId: string, data: OnboardingData): Promise<void> {
  try {
    const profile: Partial<UserProfile> = {
      user_id: userId,
      name: data.name,
      maternal_stage: data.maternal_stage,
      communication_style: data.communication_style,
      content_interests: data.content_interests,
      main_challenges: data.main_challenges,
      onboarding_completed: true,
      onboarding_completed_at: new Date(),
    };

    // Adicionar campos condicionais
    if (data.gestation_week) {
      profile.gestation_week = data.gestation_week;
    }
    if (data.baby_name) {
      profile.baby_name = data.baby_name;
    }
    if (data.baby_age_months) {
      profile.baby_age_months = data.baby_age_months;
    }

    const { error } = await supabase
      .from('user_profiles')
      .upsert(profile as any);

    if (error) {
      logger.error(
        'Erro ao atualizar profile',
        error instanceof Error ? error : undefined,
        {
          userId,
          error: error instanceof Error ? error.message : String(error),
        }
      );
      throw error;
    }
  } catch (error) {
    logger.error(
      'Erro ao atualizar perfil',
      error instanceof Error ? error : undefined,
      {
        userId,
        error: error instanceof Error ? error.message : String(error),
      }
    );
    throw error;
  }
}

/**
 * Atualizar preferências para personalização
 */
export async function updateUserPreferences(
  userId: string,
  data: OnboardingData
): Promise<void> {
  try {
    const preferences: Partial<UserPreferences> = {
      user_id: userId,
      communication_style: data.communication_style,
      content_interests: data.content_interests,
      main_challenges: data.main_challenges,
      emotional_state: data.emotional_state,
      stress_level: data.stress_level,
      energy_level: data.energy_level,
      feed_personalization_enabled: true,
      chat_personalization_enabled: true,
    };

    const { error } = await supabase
      .from('user_preferences')
      .upsert(preferences as any);

    if (error) {
      logger.error(
        'Erro ao atualizar preferences',
        error instanceof Error ? error : undefined,
        {
          userId,
          error: error instanceof Error ? error.message : String(error),
        }
      );
      throw error;
    }
  } catch (error) {
    logger.error(
      'Erro ao atualizar preferências',
      error instanceof Error ? error : undefined,
      {
        userId,
        error: error instanceof Error ? error.message : String(error),
      }
    );
    throw error;
  }
}

/**
 * Validação completa dos dados do onboarding
 */
export function validateOnboardingData(data: OnboardingData): ValidationResult {
  const errors: string[] = [];

  // BLOCO 1: Validar campos obrigatórios de identidade
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Nome é obrigatório');
  }

  if (!data.maternal_stage) {
    errors.push('Tipo de mãe é obrigatório');
  }

  // Se gestante, validar semana de gestação
  if (data.maternal_stage === 'gestante') {
    if (!data.gestation_week || data.gestation_week < 1 || data.gestation_week > 40) {
      errors.push('Semana de gestação inválida');
    }
  }

  // BLOCO 2: Validar campos de emoção
  if (!data.self_care_frequency) {
    errors.push('Frequência de autocuidado é obrigatória');
  }

  if (!data.emotional_state) {
    errors.push('Estado emocional é obrigatório');
  }

  if (data.stress_level === undefined || data.stress_level < 1 || data.stress_level > 10) {
    errors.push('Nível de estresse deve estar entre 1 e 10');
  }

  if (!data.sleep_quality) {
    errors.push('Qualidade do sono é obrigatória');
  }

  if (data.energy_level === undefined || data.energy_level < 1 || data.energy_level > 10) {
    errors.push('Nível de energia deve estar entre 1 e 10');
  }

  // BLOCO 3: Validar desafios
  if (!data.main_challenges || data.main_challenges.length === 0) {
    errors.push('Selecione pelo menos um desafio');
  }

  // BLOCO 4: (nenhum obrigatório)

  // BLOCO 5: Validar expectativas
  if (!data.expectations || data.expectations.length === 0) {
    errors.push('Selecione pelo menos uma expectativa');
  }

  if (!data.communication_style) {
    errors.push('Estilo de comunicação é obrigatório');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validar um step específico (validação parcial)
 */
export function validateOnboardingStep(
  stepNumber: number,
  data: Partial<OnboardingData>
): ValidationResult {
  const errors: string[] = [];

  const stepConfig = ONBOARDING_STEPS[stepNumber];
  if (!stepConfig) {
    return { valid: false, errors: ['Step inválido'] };
  }

  // Validar campos obrigatórios deste step
  for (const field of stepConfig.requiredFields) {
    const value = data[field as keyof OnboardingData];

    if (value === undefined || value === null || value === '') {
      errors.push(`Campo ${field} é obrigatório`);
      continue;
    }

    // Validações específicas por tipo
    if (field === 'name' && typeof value === 'string') {
      if (value.trim().length === 0) {
        errors.push('Nome não pode estar vazio');
      }
    }

    if (field === 'gestation_week' && typeof value === 'number') {
      if (value < 1 || value > 40) {
        errors.push('Semana de gestação deve estar entre 1 e 40');
      }
    }

    if ((field === 'stress_level' || field === 'energy_level') && typeof value === 'number') {
      if (value < 1 || value > 10) {
        errors.push(`${field} deve estar entre 1 e 10`);
      }
    }

    if (field === 'main_challenges' && Array.isArray(value)) {
      if (value.length === 0) {
        errors.push('Selecione pelo menos um desafio');
      }
    }

    if (field === 'expectations' && Array.isArray(value)) {
      if (value.length === 0) {
        errors.push('Selecione pelo menos uma expectativa');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Verificar se onboarding foi completado
 */
export async function checkOnboardingCompleted(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_onboarding')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      logger.error(
        'Erro ao verificar onboarding',
        error instanceof Error ? error : undefined,
        {
          userId,
          error: error instanceof Error ? error.message : String(error),
        }
      );
    }

    return !!data;
  } catch (error) {
    logger.error(
      'Erro ao verificar onboarding',
      error instanceof Error ? error : undefined,
      {
        userId,
        error: error instanceof Error ? error.message : String(error),
      }
    );
    throw error;
  }
}

/**
 * Carregar dados do onboarding existente
 */
export async function loadOnboardingData(userId: string): Promise<OnboardingData | null> {
  try {
    const { data, error } = await supabase
      .from('user_onboarding')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code !== 'PGRST116') {
        // PGRST116 = no rows returned (esperado)
        logger.error(
          'Erro ao carregar onboarding',
          error instanceof Error ? error : undefined,
          {
            userId,
            error: error instanceof Error ? error.message : String(error),
          }
        );
      }
      return null;
    }

    return data as OnboardingData;
  } catch (error) {
    logger.error(
      'Erro ao carregar onboarding',
      error instanceof Error ? error : undefined,
      {
        userId,
        error: error instanceof Error ? error.message : String(error),
      }
    );
    return null;
  }
}

/**
 * Resetar onboarding (para testes/re-onboarding)
 */
export async function resetOnboarding(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_onboarding')
      .delete()
      .eq('user_id', userId);

    if (error) {
      logger.error(
        'Erro ao resetar onboarding',
        error instanceof Error ? error : undefined,
        {
          userId,
          error: error instanceof Error ? error.message : String(error),
        }
      );
      throw error;
    }

    // Atualizar profile
    await supabase
      .from('user_profiles')
      .update({ onboarding_completed: false })
      .eq('user_id', userId);

    return true;
  } catch (error) {
    logger.error(
      'Erro ao resetar onboarding',
      error instanceof Error ? error : undefined,
      {
        userId,
        error: error instanceof Error ? error.message : String(error),
      }
    );
  }
}

/**
 * Gerar insights baseado em onboarding (para personalização)
 */
export function generateOnboardingInsights(data: OnboardingData): Record<string, any> {
  const insights: Record<string, any> = {
    needs_rest: data.energy_level < 4,
    is_stressed: data.stress_level > 7,
    is_anxious: data.emotional_state === 'ansiosa',
    is_exhausted: data.emotional_state === 'exausta',
    needs_emotional_support: ['ansiosa', 'triste', 'insegura'].includes(data.emotional_state),
    poor_sleep: ['pessima', 'ruim'].includes(data.sleep_quality),
    no_self_care: data.self_care_frequency === 'nunca',
    minimal_support: ['pouco', 'nenhum'].includes(data.support_network),
    primary_challenges: data.main_challenges,
    communication_style: data.communication_style,
  };

  return insights;
}
