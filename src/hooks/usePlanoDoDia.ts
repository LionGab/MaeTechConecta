/**
 * usePlanoDoDia Hook
 * Hook para buscar e gerenciar plano do dia
 */

import { useState, useEffect, useCallback } from 'react';
import { getPlanoDoDia, replanToday, MessagePlan } from '@/services/personalization';

interface UsePlanoDoDiaReturn {
  plan: MessagePlan | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  replan: () => Promise<void>;
  isReplanning: boolean;
}

/**
 * Hook para gerenciar plano do dia
 * 
 * @param userId - ID do usuário
 * @param autoRefresh - Refresh automático a cada hora (padrão: true)
 * @returns { plan, isLoading, error, refresh, replan, isReplanning }
 * 
 * @example
 * const { plan, isLoading, replan } = usePlanoDoDia(userId);
 * 
 * if (isLoading) return <Loading />;
 * if (plan) {
 *   return <PlanoDoDia items={plan.items} />;
 * }
 */
export function usePlanoDoDia(
  userId: string,
  autoRefresh = true
): UsePlanoDoDiaReturn {
  const [plan, setPlan] = useState<MessagePlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isReplanning, setIsReplanning] = useState(false);

  // Buscar plano
  const fetchPlan = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getPlanoDoDia(userId);
      setPlan(data);
    } catch (err) {
      console.error('Error fetching plan:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Refresh manual
  const refresh = useCallback(async () => {
    await fetchPlan();
  }, [fetchPlan]);

  // Replanejar (on-demand)
  const replan = useCallback(async () => {
    if (!userId) return;

    try {
      setIsReplanning(true);
      setError(null);
      const newPlan = await replanToday(userId);
      setPlan(newPlan);
    } catch (err) {
      console.error('Error replanning:', err);
      setError(err as Error);
    } finally {
      setIsReplanning(false);
    }
  }, [userId]);

  // Fetch inicial
  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  // Auto-refresh a cada hora
  useEffect(() => {
    if (!autoRefresh || !userId) return;

    const interval = setInterval(() => {
      fetchPlan();
    }, 60 * 60 * 1000); // 1 hora

    return () => clearInterval(interval);
  }, [autoRefresh, userId, fetchPlan]);

  return {
    plan,
    isLoading,
    error,
    refresh,
    replan,
    isReplanning,
  };
}

