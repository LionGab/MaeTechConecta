/**
 * Personalization Service
 * Funções para sistema de personalização inteligente
 */

import { supabase } from './supabase';
import { SUPABASE_CONFIG } from '@/config/api';

// =====================================================
// TYPES
// =====================================================

export interface Event {
  id: string;
  user_id: string;
  kind: string;
  payload: Record<string, any>;
  created_at: string;
}

export interface Signal {
  id: string;
  user_id: string;
  tags: string[];
  scores: {
    stress_score: number;
    sleep_quality: number;
    support_score: number;
    mood_average: number;
  };
  source: string;
  created_at: string;
}

export interface PlanItem {
  scheduled_at: string;
  type: 'check-in' | 'content' | 'habit' | 'alert' | 'closure';
  template_id: string;
  message_text: string;
  cta?: string;
  rationale: string;
}

export interface MessagePlan {
  id: string;
  user_id: string;
  plan_date: string;
  timezone: string;
  items: PlanItem[];
  rationale: {
    priority: string;
    tags: string[];
    scores: Record<string, number>;
    risk_level: number;
    reasons: Record<string, string>;
  };
  created_at: string;
}

export interface ContentCatalog {
  id: string;
  title: string;
  summary: string;
  source_url: string | null;
  tags: string[];
  lang: string;
  category: string;
  relevance_score: number;
  is_premium: boolean;
  created_at: string;
}

// =====================================================
// INGEST EVENT
// =====================================================

/**
 * Grava um evento de comportamento do usuário
 *
 * @param userId - ID do usuário
 * @param kind - Tipo do evento (onboarding_submitted, mood_update, habit_check, etc)
 * @param payload - Dados adicionais do evento
 * @returns Event criado
 *
 * @example
 * await ingestEvent(userId, 'mood_update', { mood: 4, energy: 3 });
 */
export async function ingestEvent(userId: string, kind: string, payload: Record<string, any>): Promise<Event> {
  const response = await fetch(`${SUPABASE_CONFIG.URL}/functions/v1/ingest-event`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_CONFIG.ANON_KEY}`,
    },
    body: JSON.stringify({ userId, kind, payload }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to ingest event');
  }

  const data = await response.json();
  return data.event;
}

// =====================================================
// GET PLANO DO DIA
// =====================================================

/**
 * Busca o plano do dia do usuário
 *
 * @param userId - ID do usuário
 * @param date - Data no formato YYYY-MM-DD (opcional, padrão: hoje)
 * @returns MessagePlan ou null se não existir
 *
 * @example
 * const plan = await getPlanoDoDia(userId);
 * if (plan) {
 *   console.log('Itens:', plan.items.length);
 * }
 */
export async function getPlanoDoDia(userId: string, date?: string): Promise<MessagePlan | null> {
  const planDate = date || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('message_plan')
    .select('*')
    .eq('user_id', userId)
    .eq('plan_date', planDate)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

// =====================================================
// REPLANEJAR HOJE (on-demand)
// =====================================================

/**
 * Gera um novo plano para hoje/amanhã
 *
 * @param userId - ID do usuário
 * @returns MessagePlan gerado
 *
 * @example
 * const newPlan = await replanToday(userId);
 * console.log('Novo plano criado:', newPlan.id);
 */
export async function replanToday(userId: string): Promise<MessagePlan> {
  // Registrar evento de replanejamento
  await ingestEvent(userId, 'plan_requested', {
    requested_at: new Date().toISOString(),
  });

  // Chamar plan-daily para este usuário
  const response = await fetch(`${SUPABASE_CONFIG.URL}/functions/v1/plan-daily`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_CONFIG.ANON_KEY}`,
    },
    body: JSON.stringify({ userId, forceRegenerate: true }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to replan');
  }

  // Buscar plano recém-criado
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const planDate = tomorrow.toISOString().split('T')[0];

  const plan = await getPlanoDoDia(userId, planDate);
  if (!plan) {
    throw new Error('Plan was created but not found');
  }

  return plan;
}

// =====================================================
// UPDATE FREQUENCY CAP
// =====================================================

/**
 * Atualiza o limite de notificações por dia
 *
 * @param userId - ID do usuário
 * @param cap - Novo limite (0-10)
 *
 * @example
 * await updateFrequencyCap(userId, 1); // Apenas 1 notificação por dia
 */
export async function updateFrequencyCap(userId: string, cap: number): Promise<void> {
  if (cap < 0 || cap > 10) {
    throw new Error('Frequency cap must be between 0 and 10');
  }

  const { error } = await supabase.from('user_profiles').update({ frequency_cap: cap }).eq('id', userId);

  if (error) {
    throw error;
  }

  // Registrar evento
  await ingestEvent(userId, 'feedback_given', {
    type: 'frequency_cap_update',
    new_value: cap,
  });
}

// =====================================================
// GET LATEST SIGNAL
// =====================================================

/**
 * Busca o sinal mais recente do usuário
 *
 * @param userId - ID do usuário
 * @returns Signal mais recente ou null
 *
 * @example
 * const signal = await getLatestSignal(userId);
 * if (signal) {
 *   console.log('Tags:', signal.tags);
 *   console.log('Stress:', signal.scores.stress_score);
 * }
 */
export async function getLatestSignal(userId: string): Promise<Signal | null> {
  const { data, error } = await supabase
    .from('signals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

// =====================================================
// GET CURATED CONTENT
// =====================================================

/**
 * Busca conteúdo curado por tags
 *
 * @param tags - Tags de interesse
 * @param limit - Limite de resultados (padrão: 10)
 * @returns Array de ContentCatalog
 *
 * @example
 * const content = await getCuratedContent(['support_low', 'tag_lonely']);
 * console.log('Conteúdo encontrado:', content.length);
 */
export async function getCuratedContent(tags: string[], limit = 10): Promise<ContentCatalog[]> {
  const { data, error } = await supabase
    .from('content_catalog')
    .select('*')
    .overlaps('tags', tags)
    .order('relevance_score', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data || [];
}

// =====================================================
// MARK DELIVERY AS OPENED
// =====================================================

/**
 * Marca uma entrega como aberta (métrica)
 *
 * @param deliveryId - ID da entrega
 *
 * @example
 * await markDeliveryAsOpened(deliveryId);
 */
export async function markDeliveryAsOpened(deliveryId: string): Promise<void> {
  const { error } = await supabase.from('message_deliveries').update({ opened: true }).eq('id', deliveryId);

  if (error) {
    throw error;
  }
}

// =====================================================
// MARK DELIVERY AS CLICKED
// =====================================================

/**
 * Marca uma entrega como clicada (métrica)
 *
 * @param deliveryId - ID da entrega
 *
 * @example
 * await markDeliveryAsClicked(deliveryId);
 */
export async function markDeliveryAsClicked(deliveryId: string): Promise<void> {
  const { error } = await supabase.from('message_deliveries').update({ clicked: true }).eq('id', deliveryId);

  if (error) {
    throw error;
  }
}

// =====================================================
// INFER USER PREFERENCES
// =====================================================

export interface InferredPreference {
  tag_id: string;
  tag_name: string;
  category: string;
  weight: number;
  reason: string;
}

export interface InferPreferencesResponse {
  success: boolean;
  inferred: InferredPreference[];
  updated_count: number;
  metadata?: {
    total_interactions: number;
    unique_tags: number;
    inference_date: string;
  };
}

/**
 * Infere preferências do usuário baseado em histórico de interações
 *
 * @param userId - ID do usuário
 * @returns Preferências inferidas e contagem de atualizações
 *
 * @example
 * const result = await inferUserPreferences(userId);
 * console.log('Preferências inferidas:', result.inferred.length);
 * console.log('Atualizações realizadas:', result.updated_count);
 */
export async function inferUserPreferences(userId: string): Promise<InferPreferencesResponse> {
  const response = await fetch(`${SUPABASE_CONFIG.URL}/functions/v1/infer-preferences`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_CONFIG.ANON_KEY}`,
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to infer preferences');
  }

  const data = await response.json();
  return data;
}
