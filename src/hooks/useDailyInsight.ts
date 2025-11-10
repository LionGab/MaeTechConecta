/**
 * useDailyInsight Hook
 *
 * Gerencia dica diária personalizada do usuário
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import { logger } from '@/utils/logger';

import { DailyInsight } from '@/services/dailyInsight';

export interface UseDailyInsightReturn {
  insight: DailyInsight | null;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  regenerate: () => Promise<void>;
  markAsViewed: () => Promise<void>;
}

export function useDailyInsight(): UseDailyInsightReturn {
  const [insight, setInsight] = useState<DailyInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsight = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar dica de hoje
      const today = new Date().toISOString().split('T')[0];

      const { data, error: fetchError } = await supabase.from('daily_insights').select('*').eq('date', today).single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // Não encontrou - gerar nova dica
          await generateNewInsight();
          return;
        }
        throw fetchError;
      }

      setInsight(data);
    } catch (err: any) {
      logger.error('Error fetching daily insight:', err instanceof Error ? err : undefined, {
        error: err instanceof Error ? err.message : String(err),
      });
      setError('Não foi possível carregar sua dica do dia');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateNewInsight = useCallback(async (forceNew = false) => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Chamar Edge Function
      const { data, error } = await supabase.functions.invoke('personalize-tip', {
        body: { userId: user.id, forceNew },
      });

      if (error) throw error;

      setInsight(data.tip);
    } catch (err: any) {
      logger.error('Error generating insight:', err instanceof Error ? err : undefined, {
        userId: user?.id,
        error: err instanceof Error ? err.message : String(err),
      });
      setError('Não foi possível gerar sua dica do dia');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsViewed = useCallback(async () => {
    if (!insight) return;

    try {
      const { error } = await supabase
        .from('daily_insights')
        .update({
          viewed: true,
          viewed_at: new Date().toISOString(),
        })
        .eq('id', insight.id);

      if (error) throw error;

      setInsight((prev) => (prev ? { ...prev, viewed: true } : null));
    } catch (err: any) {
      logger.error('Error marking insight as viewed:', err instanceof Error ? err : undefined, {
        insightId: insight?.id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }, [insight]);

  useEffect(() => {
    fetchInsight();
  }, [fetchInsight]);

  const regenerate = useCallback(async () => {
    await generateNewInsight(true);
  }, [generateNewInsight]);

  return {
    insight,
    loading: isLoading,
    isLoading,
    error,
    refetch: fetchInsight,
    regenerate,
    markAsViewed,
  };
}

