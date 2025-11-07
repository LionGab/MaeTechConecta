/**
 * Gamification Utils
 *
 * Utilitários para cálculo de pontos, levels, streaks e badges
 */

import {
  calculateLevel,
  getProgressToNextLevel,
  BADGES,
  checkBadgeUnlock,
  type BadgeDefinition,
} from '../types/gamification.types';

// ==========================================
// STREAK CALCULATION
// ==========================================

/**
 * Calcula streak baseado em datas de conclusão
 *
 * @param completionDates - Array de datas em que hábitos foram concluídos
 * @returns Número de dias consecutivos
 *
 * @example
 * const streak = calculateStreakFromDates([
 *   new Date('2025-01-05'),
 *   new Date('2025-01-06'),
 *   new Date('2025-01-07')
 * ]);
 * console.log(streak); // 3
 */
export function calculateStreakFromDates(completionDates: Date[]): number {
  if (completionDates.length === 0) return 0;

  // Ordenar datas (mais recente primeiro)
  const sorted = completionDates.map((d) => new Date(d)).sort((a, b) => b.getTime() - a.getTime());

  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Verificar se a última data é hoje ou ontem
  const lastDate = new Date(sorted[0]);
  lastDate.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  // Se última conclusão foi há mais de 1 dia, streak quebrado
  if (daysDiff > 1) return 0;

  // Contar dias consecutivos
  for (let i = 1; i < sorted.length; i++) {
    const currentDate = new Date(sorted[i]);
    currentDate.setHours(0, 0, 0, 0);

    const prevDate = new Date(sorted[i - 1]);
    prevDate.setHours(0, 0, 0, 0);

    const diff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// ==========================================
// POINTS & LEVEL
// ==========================================

/**
 * Calcula pontos ganhos por completar hábitos
 *
 * @param habitsCompleted - Número de hábitos concluídos
 * @param basePoints - Pontos base por hábito (padrão: 10)
 * @param multiplier - Multiplicador de streak (padrão: 1)
 * @returns Total de pontos
 */
export function calculatePoints(habitsCompleted: number, basePoints: number = 10, multiplier: number = 1): number {
  return Math.floor(habitsCompleted * basePoints * multiplier);
}

/**
 * Calcula multiplicador de pontos baseado em streak
 *
 * @param streak - Dias consecutivos
 * @returns Multiplicador (1.0 a 2.0)
 *
 * @example
 * getStreakMultiplier(0)  // 1.0
 * getStreakMultiplier(7)  // 1.2
 * getStreakMultiplier(30) // 1.5
 */
export function getStreakMultiplier(streak: number): number {
  if (streak < 3) return 1.0;
  if (streak < 7) return 1.1;
  if (streak < 14) return 1.2;
  if (streak < 30) return 1.3;
  if (streak < 60) return 1.5;
  return 2.0; // Streak máximo
}

// ==========================================
// BADGES
// ==========================================

/**
 * Verifica quais badges foram desbloqueados
 *
 * @param currentBadges - IDs dos badges já desbloqueados
 * @param stats - Estatísticas do usuário
 * @returns Array de badges recém-desbloqueados
 */
export function getNewlyUnlockedBadges(
  currentBadges: string[],
  stats: {
    current_streak: number;
    total_points: number;
    level: number;
    habits_completed: number;
  }
): BadgeDefinition[] {
  const newBadges: BadgeDefinition[] = [];

  for (const badge of BADGES) {
    // Já desbloqueado
    if (currentBadges.includes(badge.id)) {
      continue;
    }

    // Verificar requisito
    const unlocked = checkBadgeUnlock(badge, {
      current_streak: stats.current_streak,
      total_points: stats.total_points,
      level: stats.level,
      badges: currentBadges,
    });

    if (unlocked) {
      newBadges.push(badge);
    }
  }

  return newBadges;
}

// ==========================================
// FORMATTING
// ==========================================

/**
 * Formata pontos para exibição (ex: 1000 → 1K)
 */
export function formatPoints(points: number): string {
  if (points < 1000) return points.toString();
  if (points < 1000000) return `${(points / 1000).toFixed(1)}K`;
  return `${(points / 1000000).toFixed(1)}M`;
}

/**
 * Formata streak para exibição
 */
export function formatStreak(days: number): string {
  if (days === 0) return 'Nenhum';
  if (days === 1) return '1 dia';
  return `${days} dias`;
}

// ==========================================
// EXPORT ALL
// ==========================================

export { calculateLevel, getProgressToNextLevel, BADGES, type BadgeDefinition };
