/**
 * Tela de Hábitos Saudáveis
 *
 * Uma jornada de autocuidado para mães
 * Sistema completo de hábitos com progresso, streaks e motivação
 * Design System: Nath Theme (mom-blue)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Pressable } from 'react-native';
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
  icon?: string;
  color?: string;
}

const DEFAULT_HABITS = [
  {
    name: 'Pausa para Respirar (2 minutos)',
    description: 'Respire fundo. Você merece esse momento só seu.',
    category: 'bem-estar',
    icon: 'meditation',
    color: theme.colors.primary,
  },
  {
    name: 'Check-in Emocional',
    description: 'Como você está se sentindo hoje? Validar suas emoções é importante.',
    category: 'bem-estar',
    icon: 'heart-pulse',
    color: theme.colors.secondary,
  },
  {
    name: 'Alongamento (10 minutos)',
    description: 'Cuide do seu corpo. Ele faz tanto por você todos os dias.',
    category: 'bem-estar',
    icon: 'yoga',
    color: theme.colors.success,
  },
  {
    name: 'Peça Ajuda',
    description: 'Conecte-se com sua rede de apoio. Você não precisa fazer tudo sozinha.',
    category: 'social',
    icon: 'account-group',
    color: theme.colors.info,
  },
  {
    name: 'Momento de Inspiração',
    description: 'Leia ou assista algo que te faz bem. Alimente sua alma.',
    category: 'crescimento',
    icon: 'book-open-variant',
    color: theme.colors.warning,
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
            icon: habit.icon || 'check-circle',
            color: habit.color || theme.colors.primary,
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
      icon: habit.icon,
      color: habit.color,
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

  const progressPercentage = habits.length > 0 ? Math.round((todayCompleted / habits.length) * 100) : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cabeçalho Motivacional */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerIcon}>
            <Icon name="heart-flash" size={32} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>Seus Hábitos Saudáveis</Text>
        </View>
        <Text style={styles.subtitle}>
          Pequenos passos todos os dias fazem grandes transformações. Você está indo muito bem!
        </Text>
      </View>

      {/* Seção Explicativa */}
      <View style={styles.infoSection}>
        <Card variant="filled" padding="lg" style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Icon name="information" size={20} color={theme.colors.primary} />
            <Text style={styles.infoTitle}>Por que criar hábitos saudáveis?</Text>
          </View>
          <Text style={styles.infoText}>
            Hábitos são ações que você repete até se tornarem automáticas. Para criar um novo hábito, lembre-se:
          </Text>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Icon name="bell-ring" size={16} color={theme.colors.secondary} />
              <Text style={styles.infoItemText}><Text style={styles.bold}>Deixa:</Text> O que te lembra de fazer</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="repeat" size={16} color={theme.colors.secondary} />
              <Text style={styles.infoItemText}><Text style={styles.bold}>Rotina:</Text> A ação em si</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="star" size={16} color={theme.colors.secondary} />
              <Text style={styles.infoItemText}><Text style={styles.bold}>Recompensa:</Text> O que você ganha ao fazer</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Progresso Geral */}
      {habits.length > 0 && (
        <View style={styles.progressSection}>
          <Card variant="elevated" padding="lg" style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Progresso de Hoje</Text>
              <View style={styles.progressBadge}>
                <Text style={styles.progressBadgeText}>{progressPercentage}%</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.progressSubtitle}>
              {todayCompleted} de {habits.length} hábitos completados
            </Text>
            {todayCompleted === habits.length && (
              <View style={styles.celebrationBanner}>
                <Icon name="party-popper" size={24} color={theme.colors.success} />
                <Text style={styles.celebrationText}>Parabéns! Você completou todos os hábitos de hoje!</Text>
              </View>
            )}
          </Card>
        </View>
      )}

      {/* Lista de Hábitos */}
      {habits.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Nenhum hábito criado ainda"
          description="Vamos começar sua jornada de autocuidado juntas. Criar hábitos saudáveis é um ato de amor próprio."
          actionLabel="Criar meu primeiro hábito"
          onAction={() => Alert.alert('Em breve', 'Funcionalidade de criar hábitos personalizados será adicionada em breve!')}
        />
      ) : (
        <>
          <View style={styles.habitsHeader}>
            <Text style={styles.habitsTitle}>Meus Hábitos Diários</Text>
            <Text style={styles.habitsSubtitle}>Toque para marcar como concluído</Text>
          </View>
          <View style={styles.habitsList}>
            {habits.map((habit, index) => (
              <Card
                key={habit.id}
                variant="elevated"
                style={[styles.habitCard, habit.completed_today && styles.habitCardCompleted]}
                onPress={() => toggleHabit(habit.id, !habit.completed_today)}
                accessibilityLabel={`${habit.name} - ${habit.completed_today ? 'Completo' : 'Incompleto'}`}
              >
                <View style={styles.habitContent}>
                  {/* Ícone do Hábito */}
                  <View style={[styles.habitIconContainer, { backgroundColor: habit.color + '20' }]}>
                    <Icon name={habit.icon || 'check-circle'} size={28} color={habit.color || theme.colors.primary} />
                  </View>

                  {/* Informações do Hábito */}
                  <View style={styles.habitInfo}>
                    <View style={styles.habitHeader}>
                      <Text style={styles.habitName}>{habit.name}</Text>
                      {habit.streak_days > 0 && (
                        <View style={styles.streakBadge}>
                          <Icon name="fire" size={14} color={theme.colors.warning} />
                          <Text style={styles.streakText}>{habit.streak_days}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.habitDescription}>{habit.description}</Text>

                    {/* Badge de categoria */}
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{habit.category}</Text>
                    </View>
                  </View>

                  {/* Checkbox */}
                  <TouchableOpacity
                    style={styles.checkboxWrapper}
                    onPress={() => toggleHabit(habit.id, !habit.completed_today)}
                    accessible={false}
                  >
                    <View style={[styles.checkbox, habit.completed_today && styles.checkboxCompleted]}>
                      {habit.completed_today && <Icon name="check-bold" size={24} color={theme.colors.card} />}
                    </View>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>

          {/* CTA: Adicionar Mais Hábitos */}
          <View style={styles.ctaSection}>
            <Pressable
              style={styles.ctaButton}
              onPress={() => Alert.alert('Em breve', 'Funcionalidade de criar hábitos personalizados será adicionada em breve!')}
            >
              <Icon name="plus-circle" size={24} color={theme.colors.primary} />
              <Text style={styles.ctaText}>Adicionar novo hábito personalizado</Text>
            </Pressable>
          </View>
        </>
      )}

      {/* Dica do Dia */}
      <View style={styles.tipSection}>
        <Card variant="outlined" padding="lg" style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Icon name="lightbulb-on" size={20} color={theme.colors.warning} />
            <Text style={styles.tipTitle}>Dica do dia</Text>
          </View>
          <Text style={styles.tipText}>
            Comece pequeno! Não tente mudar tudo de uma vez. Foque em um hábito por vez e celebre cada pequena vitória.
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = makeStyles((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.bg,
  },

  // Header
  header: {
    padding: t.spacing.xl,
    paddingBottom: t.spacing.lg,
    backgroundColor: t.colors.card,
    borderBottomLeftRadius: t.radius.xl,
    borderBottomRightRadius: t.radius.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: t.spacing.md,
  },
  headerIcon: {
    marginRight: t.spacing.md,
  },
  title: {
    ...t.typography.h1,
    fontSize: 24,
    color: t.colors.text,
    flex: 1,
  },
  subtitle: {
    ...t.typography.body,
    color: t.colors.textMuted,
    lineHeight: 22,
  },

  // Info Section
  infoSection: {
    paddingHorizontal: t.spacing.xl,
    paddingTop: t.spacing.xl,
  },
  infoCard: {
    backgroundColor: t.colors.primarySoft,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: t.spacing.md,
  },
  infoTitle: {
    ...t.typography.h2,
    fontSize: 18,
    color: t.colors.text,
    marginLeft: t.spacing.sm,
  },
  infoText: {
    ...t.typography.body,
    color: t.colors.textMuted,
    marginBottom: t.spacing.md,
    lineHeight: 22,
  },
  infoList: {
    gap: t.spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm,
  },
  infoItemText: {
    ...t.typography.body,
    color: t.colors.text,
    flex: 1,
  },
  bold: {
    fontWeight: '700',
    color: t.colors.primary,
  },

  // Progress Section
  progressSection: {
    paddingHorizontal: t.spacing.xl,
    paddingTop: t.spacing.lg,
  },
  progressCard: {
    backgroundColor: t.colors.card,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: t.spacing.md,
  },
  progressTitle: {
    ...t.typography.h2,
    fontSize: 18,
    color: t.colors.text,
  },
  progressBadge: {
    backgroundColor: t.colors.primary,
    paddingHorizontal: t.spacing.md,
    paddingVertical: t.spacing.xs,
    borderRadius: t.radius.full,
  },
  progressBadgeText: {
    ...t.typography.sub,
    fontSize: 14,
    fontWeight: '700',
    color: t.colors.card,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: t.colors.border,
    borderRadius: t.radius.sm,
    overflow: 'hidden',
    marginBottom: t.spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: t.colors.primary,
    borderRadius: t.radius.sm,
  },
  progressSubtitle: {
    ...t.typography.sub,
    color: t.colors.textMuted,
  },
  celebrationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: t.colors.successSoft,
    padding: t.spacing.md,
    borderRadius: t.radius.md,
    marginTop: t.spacing.md,
    gap: t.spacing.sm,
  },
  celebrationText: {
    ...t.typography.body,
    color: t.colors.success,
    fontWeight: '600',
    flex: 1,
  },

  // Habits List
  habitsHeader: {
    paddingHorizontal: t.spacing.xl,
    paddingTop: t.spacing.xl,
    paddingBottom: t.spacing.md,
  },
  habitsTitle: {
    ...t.typography.h2,
    fontSize: 20,
    color: t.colors.text,
    marginBottom: t.spacing.xs,
  },
  habitsSubtitle: {
    ...t.typography.sub,
    color: t.colors.textMuted,
  },
  habitsList: {
    paddingHorizontal: t.spacing.xl,
    paddingBottom: t.spacing.md,
    gap: t.spacing.md,
  },
  habitCard: {
    backgroundColor: t.colors.card,
    borderLeftWidth: 4,
    borderLeftColor: t.colors.border,
  },
  habitCardCompleted: {
    borderLeftColor: t.colors.success,
    backgroundColor: t.colors.successSoft + '30',
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
  },
  habitIconContainer: {
    width: 56,
    height: 56,
    borderRadius: t.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitInfo: {
    flex: 1,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: t.spacing.xs,
  },
  habitName: {
    ...t.typography.h3,
    fontSize: 16,
    color: t.colors.text,
    fontWeight: '600',
    flex: 1,
  },
  habitDescription: {
    ...t.typography.body,
    fontSize: 14,
    color: t.colors.textMuted,
    marginBottom: t.spacing.xs,
    lineHeight: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: t.spacing.sm,
    paddingVertical: 2,
    backgroundColor: t.colors.border,
    borderRadius: t.radius.sm,
  },
  categoryText: {
    ...t.typography.sub,
    fontSize: 11,
    color: t.colors.textMuted,
    textTransform: 'uppercase',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: t.spacing.sm,
    paddingVertical: 2,
    backgroundColor: t.colors.warning + '20',
    borderRadius: t.radius.sm,
  },
  streakText: {
    ...t.typography.sub,
    fontSize: 12,
    color: t.colors.warning,
    fontWeight: '700',
  },
  checkboxWrapper: {
    padding: t.spacing.xs,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: t.colors.border,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    borderColor: t.colors.success,
    backgroundColor: t.colors.success,
  },

  // CTA Section
  ctaSection: {
    paddingHorizontal: t.spacing.xl,
    paddingVertical: t.spacing.lg,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.spacing.sm,
    padding: t.spacing.lg,
    backgroundColor: t.colors.primarySoft,
    borderRadius: t.radius.lg,
    borderWidth: 2,
    borderColor: t.colors.primary,
    borderStyle: 'dashed',
  },
  ctaText: {
    ...t.typography.body,
    fontSize: 16,
    color: t.colors.primary,
    fontWeight: '600',
  },

  // Tip Section
  tipSection: {
    paddingHorizontal: t.spacing.xl,
    paddingBottom: t.spacing.xl,
  },
  tipCard: {
    backgroundColor: t.colors.card,
    borderColor: t.colors.warning + '40',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm,
    marginBottom: t.spacing.sm,
  },
  tipTitle: {
    ...t.typography.h3,
    fontSize: 16,
    color: t.colors.text,
    fontWeight: '600',
  },
  tipText: {
    ...t.typography.body,
    color: t.colors.textMuted,
    lineHeight: 22,
  },
}));
