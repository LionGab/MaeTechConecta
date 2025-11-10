/**
 * Habits Screen - PROMPT 7
 *
 * Sistema completo de checklist de hábitos
 * 5 hábitos pré-definidos + progresso + streaks
 * Refatorado com Nath Design System
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { makeStyles, theme } from '@/theme/nathTheme';
import { supabase } from '@/services/supabase';
import { EmptyState } from '@/shared/components/EmptyState';
import { SkeletonPresets } from '@/shared/components/Skeleton';
import { Loading } from '@/shared/components/Loading';
import {
  scheduleHabitReminder,
  cancelHabitReminder,
  scheduleStreakCelebration,
  requestNotificationPermissions,
} from '@/services/notifications';

interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  is_custom: boolean;
  completed_today: boolean;
  streak_days: number;
}

const DEFAULT_HABITS = [
  {
    name: 'Respiração/pausa de 2 min',
    description: 'Uma pausa para respirar e se reconectar',
    category: 'bem-estar',
  },
  {
    name: 'Check-in emocional 1x/dia',
    description: 'Como você está se sentindo hoje?',
    category: 'bem-estar',
  },
  {
    name: '10 min de descanso/alongamento',
    description: 'Um momento para cuidar do corpo',
    category: 'bem-estar',
  },
  {
    name: '1 pedido de ajuda por dia (rede de apoio)',
    description: 'Conecte-se com quem te apoia',
    category: 'social',
  },
  {
    name: '1 conteúdo curto "que me ajudou hoje"',
    description: 'Compartilhe algo que te fez bem',
    category: 'crescimento',
  },
];

export default function HabitsScreen() {
  const navigation = useNavigation();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayCompleted, setTodayCompleted] = useState(0);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar hábitos do usuário
      const { data: userHabits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (!userHabits || userHabits.length === 0) {
        // Criar hábitos padrão
        await createDefaultHabits(user.id);
        await loadHabits();
        return;
      }

      // Verificar completions de hoje
      const today = new Date().toISOString().split('T')[0];
      const { data: completions } = await supabase
        .from('habit_completions')
        .select('habit_id')
        .eq('user_id', user.id)
        .eq('date', today);

      const completedIds = new Set(completions?.map((c) => c.habit_id) || []);

      // Calcular streaks
      const habitsWithStats = await Promise.all(
        userHabits.map(async (habit) => {
          const { data: streakData } = await supabase
            .from('habit_completions')
            .select('date')
            .eq('habit_id', habit.id)
            .eq('user_id', user.id)
            .order('date', { ascending: false })
            .limit(30);

          let streak = 0;
          if (streakData && streakData.length > 0) {
            const dates = streakData.map((d) => new Date(d.date).getTime()).sort((a, b) => b - a);
            let currentDate = new Date().getTime();
            for (const date of dates) {
              const diff = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
              if (diff === streak) {
                streak++;
                currentDate = date;
              } else {
                break;
              }
            }
          }

          return {
            id: habit.id,
            name: habit.name,
            description: habit.description || '',
            category: habit.category || '',
            is_custom: habit.is_custom || false,
            completed_today: completedIds.has(habit.id),
            streak_days: streak,
          };
        })
      );

      setHabits(habitsWithStats);
      setTodayCompleted(habitsWithStats.filter((h) => h.completed_today).length);
    } catch (error) {
      console.error('Error loading habits:', error);
      Alert.alert('Erro', 'Não foi possível carregar os hábitos');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultHabits = async (userId: string) => {
    const habitsToCreate = DEFAULT_HABITS.map((habit) => ({
      user_id: userId,
      name: habit.name,
      description: habit.description,
      category: habit.category,
      is_custom: false,
      is_active: true,
    }));

    await supabase.from('habits').insert(habitsToCreate);
  };

  const toggleHabit = async (habitId: string, completed: boolean) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      if (completed) {
        // Marcar como feito
        await supabase.from('habit_completions').insert({
          habit_id: habitId,
          user_id: user.id,
          date: today,
          completed_at: new Date().toISOString(),
        });
      } else {
        // Desmarcar
        await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', habitId)
          .eq('user_id', user.id)
          .eq('date', today);
      }

      await loadHabits();
    } catch (error) {
      console.error('Error toggling habit:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o hábito');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <SkeletonPresets.Text width="60%" height={32} />
          <SkeletonPresets.Text width="40%" height={16} style={{ marginTop: theme.spacing.sm }} />
        </View>
        <View style={styles.habitsList}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonPresets.HabitCard key={i} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Hábitos</Text>
        <Text style={styles.subtitle}>
          {habits.length > 0 ? `${todayCompleted} de ${habits.length} completados hoje` : 'Nenhum hábito criado ainda'}
        </Text>
      </View>

      {habits.length > 0 && (
        <View style={styles.stats}>
          <Card variant="outlined" padding="md">
            <Text style={styles.statLabel}>Hábitos de hoje</Text>
            <Text style={styles.statValue}>
              {todayCompleted}/{habits.length}
            </Text>
          </Card>
        </View>
      )}

      {habits.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Nenhum hábito criado"
          description="Vamos começar sua jornada juntas. Criar hábitos saudáveis é um ato de amor próprio."
          actionLabel="Criar primeiro hábito"
          onAction={() => Alert.alert('Em breve', 'Funcionalidade de criar hábito será adicionada em breve!')}
        />
      ) : (
        <View style={styles.habitsList}>
          {habits.map((habit) => (
            <Card
              key={habit.id}
              variant="elevated"
              style={styles.habitCard}
              onPress={() => toggleHabit(habit.id, !habit.completed_today)}
              accessibilityLabel={`${habit.name} - ${habit.completed_today ? 'Completo' : 'Incompleto'}`}
            >
              <View style={styles.habitContent}>
                <TouchableOpacity
                  style={styles.checkboxWrapper}
                  onPress={() => toggleHabit(habit.id, !habit.completed_today)}
                  accessible={false}
                >
                  <View style={[styles.checkbox, habit.completed_today && styles.checkboxCompleted]}>
                    {habit.completed_today && <Icon name="check" size={24} color={theme.colors.card} />}
                  </View>
                </TouchableOpacity>

                <View style={styles.habitInfo}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  {habit.description && <Text style={styles.habitDescription}>{habit.description}</Text>}
                  {habit.streak_days > 0 && (
                    <View style={styles.streakBadge}>
                      <Text style={styles.streakText}>🔥 {habit.streak_days} dias seguidos</Text>
                    </View>
                  )}
                  {/* Progress bar */}
                  {habit.completed_today && (
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBar} />
                    </View>
                  )}
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },
  header: {
    padding: t.spacing.xl,
    paddingBottom: t.spacing.md,
  },
  title: {
    ...t.typography.h1,
    color: t.colors.text,
    marginBottom: t.spacing.sm,
  },
  subtitle: {
    ...t.typography.body,
    color: t.colors.textMuted,
  },
  stats: {
    paddingHorizontal: t.spacing.xl,
    marginBottom: t.spacing.lg,
  },
  statLabel: {
    ...t.typography.sub,
    color: t.colors.textMuted,
    marginBottom: t.spacing.xs,
  },
  statValue: {
    ...t.typography.h1,
    fontSize: 24,
    color: t.colors.primary,
  },
  habitsList: {
    paddingHorizontal: t.spacing.xl,
    paddingBottom: t.spacing.xl,
  },
  habitCard: {
    marginBottom: t.spacing.lg,
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxWrapper: {
    marginRight: t.spacing.md,
  },
  checkbox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: t.colors.border,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    borderColor: t.colors.primary,
    backgroundColor: t.colors.primary,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    ...t.typography.h2,
    color: t.colors.text,
    marginBottom: t.spacing.xs,
  },
  habitDescription: {
    ...t.typography.body,
    color: t.colors.textMuted,
    marginBottom: t.spacing.sm,
  },
  streakBadge: {
    marginTop: t.spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: t.spacing.sm,
    paddingVertical: t.spacing.xs,
    backgroundColor: t.colors.success,
    borderRadius: t.radius.sm,
  },
  streakText: {
    ...t.typography.sub,
    fontSize: 14,
    color: t.colors.card,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: t.colors.primarySoft,
    borderRadius: 2,
    marginTop: t.spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: t.colors.primary,
    borderRadius: 2,
    width: '100%',
  },
}));
