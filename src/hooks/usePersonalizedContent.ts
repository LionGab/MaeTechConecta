/**
 * FASE 4: Hook usePersonalizedContent
 *
 * Hook para buscar e gerenciar conteúdo personalizado
 * - Cache com AsyncStorage (1 hora)
 * - Registro automático de interações
 * - Retry logic para falhas de rede
 * - Optimistic updates
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_CONFIG } from '@/config/api';
import { ingestEvent } from '@/services/personalization';

// =====================================================
// TYPES
// =====================================================

export interface PersonalizedContent {
  id: string;
  title: string;
  summary: string;
  source_url: string | null;
  tags: string[];
  relevance_score: number;
  why_relevant: string;
}

export interface UserPreference {
  tag_id: string;
  tag_name: string;
  tag_category: string;
  combined_score: number;
}

export interface PersonalizedContentResponse {
  success: boolean;
  content: PersonalizedContent[];
  user_preferences: UserPreference[];
  query: string;
  source: 'catalog' | 'perplexity';
}

interface UsePersonalizedContentOptions {
  userId: string;
  limit?: number;
  cacheKey?: string;
  cacheDuration?: number; // em milissegundos
  autoFetch?: boolean;
}

interface UsePersonalizedContentResult {
  content: PersonalizedContent[];
  preferences: UserPreference[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  trackInteraction: (contentId: string, interactionType: 'like' | 'save' | 'share' | 'view') => Promise<void>;
  hasCache: boolean;
}

// =====================================================
// CONSTANTS
// =====================================================

const DEFAULT_CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hora
const STORAGE_KEY_PREFIX = 'personalized_content_';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo

// =====================================================
// HELPERS
// =====================================================

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (!response.ok && retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

async function getCachedData(key: string): Promise<PersonalizedContentResponse | null> {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    const { data, timestamp } = parsed;

    // Verificar se cache ainda é válido
    const now = Date.now();
    if (now - timestamp > DEFAULT_CACHE_DURATION) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

async function setCachedData(key: string, data: PersonalizedContentResponse): Promise<void> {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Error writing cache:', error);
  }
}

// =====================================================
// HOOK
// =====================================================

export function usePersonalizedContent({
  userId,
  limit = 10,
  cacheKey,
  cacheDuration = DEFAULT_CACHE_DURATION,
  autoFetch = true,
}: UsePersonalizedContentOptions): UsePersonalizedContentResult {
  const [content, setContent] = useState<PersonalizedContent[]>([]);
  const [preferences, setPreferences] = useState<UserPreference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasCache, setHasCache] = useState(false);

  const storageKey = cacheKey || `${STORAGE_KEY_PREFIX}${userId}`;

  // Função para buscar conteúdo personalizado
  const fetchContent = useCallback(
    async (skipCache = false) => {
      setIsLoading(true);
      setError(null);

      try {
        // Tentar buscar do cache primeiro
        if (!skipCache) {
          const cached = await getCachedData(storageKey);
          if (cached) {
            setContent(cached.content);
            setPreferences(cached.user_preferences);
            setHasCache(true);
            setIsLoading(false);
            return;
          }
        }

        // Buscar da API
        const response = await fetchWithRetry(`${SUPABASE_CONFIG.URL}/functions/v1/curate-content-personalized`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_CONFIG.ANON_KEY}`,
          },
          body: JSON.stringify({ userId, limit }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch personalized content: ${response.status}`);
        }

        const data: PersonalizedContentResponse = await response.json();

        // Atualizar estado
        setContent(data.content);
        setPreferences(data.user_preferences);
        setHasCache(false);

        // Salvar no cache
        await setCachedData(storageKey, data);

        // Registrar evento de visualização de conteúdo curado
        await ingestEvent(userId, 'content_curated_viewed', {
          count: data.content.length,
          source: data.source,
          query: data.query,
        });
      } catch (err) {
        console.error('Error fetching personalized content:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [userId, limit, storageKey]
  );

  // Função para registrar interação com conteúdo
  const trackInteraction = useCallback(
    async (contentId: string, interactionType: 'like' | 'save' | 'share' | 'view') => {
      try {
        // Buscar engagement_score via função calculate_engagement_score
        // Por enquanto, usar scores fixos
        const engagementScores: Record<string, number> = {
          view: 0.1,
          like: 0.6,
          save: 0.8,
          share: 0.9,
        };

        const engagementScore = engagementScores[interactionType] || 0.5;

        // Inserir no histórico de interações
        const response = await fetch(`${SUPABASE_CONFIG.URL}/rest/v1/user_interaction_history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_CONFIG.ANON_KEY}`,
            apikey: SUPABASE_CONFIG.ANON_KEY,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            user_id: userId,
            content_id: contentId,
            content_type: 'article',
            interaction_type: interactionType,
            engagement_score: engagementScore,
            context: {
              source: 'personalized_content_card',
              timestamp: new Date().toISOString(),
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to track interaction: ${response.status}`);
        }

        // Atualizar estado otimisticamente (se for like/save)
        if (interactionType === 'like' || interactionType === 'save') {
          setContent((prevContent) =>
            prevContent.map((item) =>
              item.id === contentId ? { ...item, [interactionType === 'like' ? 'liked' : 'saved']: true } : item
            )
          );
        }

        // Registrar evento genérico
        await ingestEvent(userId, `content_${interactionType}`, {
          content_id: contentId,
          engagement_score: engagementScore,
        });
      } catch (err) {
        console.error('Error tracking interaction:', err);
        throw err;
      }
    },
    [userId]
  );

  // Refetch forçado (ignora cache)
  const refetch = useCallback(async () => {
    await fetchContent(true);
  }, [fetchContent]);

  // Auto-fetch no mount
  useEffect(() => {
    if (autoFetch && userId) {
      fetchContent();
    }
  }, [autoFetch, userId, fetchContent]);

  return {
    content,
    preferences,
    isLoading,
    error,
    refetch,
    trackInteraction,
    hasCache,
  };
}
