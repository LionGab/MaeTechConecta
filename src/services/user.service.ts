/**
 * User Service
 * Serviço para gerenciar perfil do usuário
 */

import { supabase, UserProfile } from './supabase';
import { OnboardingData } from '@/types/onboarding.types';
import { sanitizeObject, validateProfile } from '@/utils/validation';

export interface UserProfileData {
  id: string;
  name: string;
  email?: string;
  maternal_stage: 'tentante' | 'gestante' | 'puerperio' | 'mae_estabelecida' | 'mae';
  pregnancy_week?: number;
  baby_name?: string;
  baby_age_months?: number;
  baby_age_weeks?: number;
  preferences: string[];
  subscription_tier: 'free' | 'premium';
  daily_interactions: number;
  last_interaction_date: string;
  created_at?: string;
  updated_at?: string;
}

function sanitizeStringValue(value?: string | null, maxLength: number = 120): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  return trimmed.slice(0, maxLength);
}

function normalizePreferences(preferences?: string[]): string[] {
  if (!Array.isArray(preferences)) {
    return [];
  }

  return preferences
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 50);
}

function buildProfilePayload(
  userId: string,
  data: Partial<UserProfileData>,
  context: 'create' | 'update' | 'upsert'
): Partial<UserProfile> {
  const payload: Partial<UserProfile> = {
    id: userId,
    name: sanitizeStringValue(data.name),
    email: sanitizeStringValue(data.email)?.toLowerCase(),
    type:
      data.maternal_stage ??
      (context === 'create' || context === 'upsert' ? ('mae' as UserProfile['type']) : undefined),
    pregnancy_week: data.pregnancy_week,
    baby_name: sanitizeStringValue(data.baby_name),
    preferences: normalizePreferences(data.preferences),
  };

  if (context !== 'update') {
    payload.subscription_tier = 'free';
    payload.daily_interactions = 0;
  }

  payload.last_interaction_date = new Date().toISOString();

  return sanitizeObject(payload, 500);
}

function stripUndefined<T extends Record<string, unknown>>(input: T): T {
  const output: Record<string, unknown> = {};

  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined) {
      output[key] = value;
    }
  });

  return output as T;
}

/**
 * Cria perfil inicial do usuário
 */
export async function createUserProfile(userId: string, data: Partial<UserProfileData>): Promise<UserProfileData> {
  try {
    const profile = buildProfilePayload(userId, data, 'create');
    validateProfile(profile);

    const { data: createdProfile, error } = await supabase.from('user_profiles').insert(profile).select().single();

    if (error) throw error;
    return createdProfile as UserProfileData;
  } catch (error) {
    console.error('Erro ao criar perfil:', error);
    throw error;
  }
}

/**
 * Busca perfil do usuário
 */
export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  try {
    const { data, error } = await supabase.from('user_profiles').select('*').eq('id', userId).single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Não encontrado
        return null;
      }
      throw error;
    }

    return data as UserProfileData;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
}

/**
 * Atualiza perfil do usuário
 */
export async function updateUserProfile(userId: string, updates: Partial<UserProfileData>): Promise<UserProfileData> {
  try {
    const profile = buildProfilePayload(userId, updates, 'update');
    delete profile.subscription_tier;
    delete profile.daily_interactions;
    validateProfile({ ...profile, id: userId });

    const payload = stripUndefined({
      ...profile,
      updated_at: new Date().toISOString(),
    });

    const { data, error } = await supabase.from('user_profiles').update(payload).eq('id', userId).select().single();

    if (error) throw error;
    return data as UserProfileData;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
}

/**
 * Cria ou atualiza perfil (upsert)
 */
export async function upsertUserProfile(userId: string, data: Partial<UserProfileData>): Promise<UserProfileData> {
  try {
    const profile = buildProfilePayload(userId, data, 'upsert');
    validateProfile(profile);

    const { data: upsertedProfile, error } = await supabase
      .from('user_profiles')
      .upsert(profile, { onConflict: 'id' })
      .select()
      .single();

    if (error) throw error;
    return upsertedProfile as UserProfileData;
  } catch (error) {
    console.error('Erro ao criar/atualizar perfil:', error);
    throw error;
  }
}

/**
 * Incrementa interações diárias
 */
export async function incrementDailyInteractions(userId: string): Promise<void> {
  try {
    const profile = await getUserProfile(userId);
    if (!profile) return;

    await updateUserProfile(userId, {
      daily_interactions: (profile.daily_interactions || 0) + 1,
      last_interaction_date: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao incrementar interações:', error);
  }
}
