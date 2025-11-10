/**
 * useStreak Hook
 *
 * Hook para gerenciar streak/gamificação do usuário
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import type { Streak } from '../types/database.types';
import { getNewlyUnlockedBadges } from '../lib/gamification';

export function useStreak(userId: string | null) {
  const [streak, setStreak] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar streak do usuário
  const fetchStreak = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase.from('streaks').select('*').eq('user_id', userId).single();

      if (fetchError) {
        // Se não existe, criar
        if (fetchError.code === 'PGRST116') {
          const { data: newStreak, error: createError } = await supabase
            .from('streaks')
            .insert({
              user_id: userId,
              current_streak: 0,
              best_streak: 0,
              total_points: 0,
              level: 1,
              badges: [],
            })
            .select()
            .single();

          if (createError) throw createError;
          setStreak(newStreak);
        } else {
          throw fetchError;
        }
      } else {
        setStreak(data);
      }
    } catch (err: any) {
      console.error('Erro ao buscar streak:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Verificar novos badges desbloqueados
  const checkNewBadges = useCallback(async () => {
    if (!streak) return [];

    const newBadges = getNewlyUnlockedBadges(streak.badges as string[], {
      current_streak: streak.current_streak,
      total_points: streak.total_points,
      level: streak.level,
      habits_completed: 0, // TODO: buscar do banco
    });

    if (newBadges.length > 0) {
      // Atualizar badges no banco
      const updatedBadges = [...(streak.badges as string[]), ...newBadges.map((b) => b.id)];

      await supabase.from('streaks').update({ badges: updatedBadges }).eq('user_id', userId!);

      // Atualizar estado local
      setStreak((prev) => (prev ? { ...prev, badges: updatedBadges } : null));
    }

    return newBadges;
  }, [streak, userId]);

  // Atualizar streak (chamado automaticamente pelo trigger no banco)
  const refresh = useCallback(() => {
    fetchStreak();
  }, [fetchStreak]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  return {
    streak,
    loading,
    error,
    refresh,
    checkNewBadges,
  };
}

