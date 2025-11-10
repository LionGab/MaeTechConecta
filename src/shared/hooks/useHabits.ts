/**
 * useHabits Hook
 *
 * Hook para gerenciar hábitos do usuário
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import type { Habit, HabitLog, HabitTemplate } from '../types/database.types';

export function useHabits(userId: string | null) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [templates, setTemplates] = useState<HabitTemplate[]>([]);
  const [todayLogs, setTodayLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar hábitos ativos do usuário
  const fetchHabits = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setHabits(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar hábitos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Buscar templates disponíveis
  const fetchTemplates = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('habit_templates')
        .select('*')
        .order('category', { ascending: true });

      if (fetchError) throw fetchError;
      setTemplates(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar templates:', err);
    }
  }, []);

  // Buscar logs de hoje
  const fetchTodayLogs = useCallback(async () => {
    if (!userId) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error: fetchError } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('logged_at', `${today}T00:00:00`)
        .lte('logged_at', `${today}T23:59:59`);

      if (fetchError) throw fetchError;
      setTodayLogs(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar logs de hoje:', err);
    }
  }, [userId]);

  // Criar hábito a partir de template
  const createFromTemplate = useCallback(
    async (templateId: string) => {
      if (!userId) return null;

      try {
        const template = templates.find((t) => t.id === templateId);
        if (!template) throw new Error('Template não encontrado');

        const { data, error: createError } = await supabase
          .from('habits')
          .insert({
            user_id: userId,
            template_id: templateId,
            name: template.name,
            icon: template.icon,
            points: template.default_points,
            is_active: true,
          })
          .select()
          .single();

        if (createError) throw createError;

        setHabits((prev) => [...prev, data]);
        return data;
      } catch (err: any) {
        console.error('Erro ao criar hábito:', err);
        setError(err.message);
        return null;
      }
    },
    [userId, templates]
  );

  // Marcar hábito como concluído
  const completeHabit = useCallback(
    async (habitId: string) => {
      if (!userId) return false;

      try {
        // Verificar se já foi concluído hoje
        const existingLog = todayLogs.find((log) => log.habit_id === habitId);
        if (existingLog && existingLog.done) {
          return true; // Já concluído
        }

        const { data, error: logError } = await supabase
          .from('habit_logs')
          .insert({
            habit_id: habitId,
            user_id: userId,
            done: true,
            skipped: false,
          })
          .select()
          .single();

        if (logError) throw logError;

        setTodayLogs((prev) => [...prev.filter((l) => l.habit_id !== habitId), data]);
        return true;
      } catch (err: any) {
        console.error('Erro ao completar hábito:', err);
        setError(err.message);
        return false;
      }
    },
    [userId, todayLogs]
  );

  // Pular hábito
  const skipHabit = useCallback(
    async (habitId: string) => {
      if (!userId) return false;

      try {
        const { data, error: logError } = await supabase
          .from('habit_logs')
          .insert({
            habit_id: habitId,
            user_id: userId,
            done: false,
            skipped: true,
          })
          .select()
          .single();

        if (logError) throw logError;

        setTodayLogs((prev) => [...prev.filter((l) => l.habit_id !== habitId), data]);
        return true;
      } catch (err: any) {
        console.error('Erro ao pular hábito:', err);
        return false;
      }
    },
    [userId]
  );

  // Desativar hábito
  const deactivateHabit = useCallback(async (habitId: string) => {
    try {
      const { error: updateError } = await supabase.from('habits').update({ is_active: false }).eq('id', habitId);

      if (updateError) throw updateError;

      setHabits((prev) => prev.filter((h) => h.id !== habitId));
      return true;
    } catch (err: any) {
      console.error('Erro ao desativar hábito:', err);
      return false;
    }
  }, []);

  // Verificar se hábito foi concluído hoje
  const isCompletedToday = useCallback(
    (habitId: string): boolean => {
      const log = todayLogs.find((l) => l.habit_id === habitId);
      return log ? log.done : false;
    },
    [todayLogs]
  );

  useEffect(() => {
    fetchHabits();
    fetchTemplates();
    fetchTodayLogs();
  }, [fetchHabits, fetchTemplates, fetchTodayLogs]);

  return {
    habits,
    templates,
    todayLogs,
    loading,
    error,
    createFromTemplate,
    completeHabit,
    skipHabit,
    deactivateHabit,
    isCompletedToday,
    refresh: fetchHabits,
  };
}

