/**
 * Gamification Types
 *
 * Sistema de pontos, levels, badges e streaks
 */

// ==========================================
// LEVELS
// ==========================================

export interface Level {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

export const LEVELS: Level[] = [
  { level: 1, title: 'Iniciante', minPoints: 0, maxPoints: 99, color: '#CD7F32', tier: 'bronze' },
  { level: 2, title: 'Aprendiz', minPoints: 100, maxPoints: 199, color: '#CD7F32', tier: 'bronze' },
  { level: 3, title: 'Dedicada', minPoints: 200, maxPoints: 499, color: '#C0C0C0', tier: 'silver' },
  { level: 4, title: 'Comprometida', minPoints: 500, maxPoints: 999, color: '#C0C0C0', tier: 'silver' },
  { level: 5, title: 'Expert', minPoints: 1000, maxPoints: 1999, color: '#FFD700', tier: 'gold' },
  { level: 6, title: 'Mestre', minPoints: 2000, maxPoints: 4999, color: '#FFD700', tier: 'gold' },
  { level: 7, title: 'Campeã', minPoints: 5000, maxPoints: 9999, color: '#E6E6FA', tier: 'platinum' },
  { level: 8, title: 'Lendária', minPoints: 10000, maxPoints: 19999, color: '#FF1493', tier: 'diamond' },
  { level: 9, title: 'Divina', minPoints: 20000, maxPoints: 49999, color: '#FF1493', tier: 'diamond' },
  { level: 10, title: 'Imortal', minPoints: 50000, maxPoints: Infinity, color: '#FF1493', tier: 'diamond' },
];

// ==========================================
// BADGES
// ==========================================

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: BadgeRequirement;
}

export type BadgeRequirement =
  | { type: 'streak'; days: number }
  | { type: 'points'; amount: number }
  | { type: 'habits_completed'; count: number }
  | { type: 'level'; level: number }
  | { type: 'special'; condition: string };

export const BADGES: BadgeDefinition[] = [
  {
    id: 'first_habit',
    name: 'Primeiro Passo',
    description: 'Complete seu primeiro hábito',
    icon: '🌟',
    requirement: { type: 'habits_completed', count: 1 },
  },
  {
    id: 'streak_3',
    name: 'Três Dias',
    description: 'Mantenha 3 dias de streak',
    icon: '🔥',
    requirement: { type: 'streak', days: 3 },
  },
  {
    id: 'streak_7',
    name: 'Uma Semana',
    description: 'Mantenha 7 dias de streak',
    icon: '⚡',
    requirement: { type: 'streak', days: 7 },
  },
  {
    id: 'streak_30',
    name: 'Um Mês',
    description: 'Mantenha 30 dias de streak',
    icon: '💎',
    requirement: { type: 'streak', days: 30 },
  },
  {
    id: 'points_100',
    name: 'Centena',
    description: 'Alcance 100 pontos',
    icon: '💯',
    requirement: { type: 'points', amount: 100 },
  },
  {
    id: 'points_1000',
    name: 'Milhar',
    description: 'Alcance 1000 pontos',
    icon: '🏆',
    requirement: { type: 'points', amount: 1000 },
  },
  {
    id: 'level_5',
    name: 'Expert',
    description: 'Alcance o nível 5',
    icon: '👑',
    requirement: { type: 'level', level: 5 },
  },
  {
    id: 'level_10',
    name: 'Imortal',
    description: 'Alcance o nível máximo',
    icon: '✨',
    requirement: { type: 'level', level: 10 },
  },
];

// ==========================================
// HELPERS
// ==========================================

export function calculateLevel(points: number): Level {
  return LEVELS.find((l) => points >= l.minPoints && points <= l.maxPoints) || LEVELS[0];
}

export function getNextLevel(currentLevel: number): Level | null {
  return LEVELS.find((l) => l.level === currentLevel + 1) || null;
}

export function getProgressToNextLevel(points: number): number {
  const current = calculateLevel(points);
  const next = getNextLevel(current.level);

  if (!next) return 100; // Nível máximo

  const progressInCurrentLevel = points - current.minPoints;
  const pointsNeededForNextLevel = next.minPoints - current.minPoints;

  return (progressInCurrentLevel / pointsNeededForNextLevel) * 100;
}

export function checkBadgeUnlock(
  badge: BadgeDefinition,
  streak: { current_streak: number; total_points: number; level: number; badges: string[] }
): boolean {
  // Já desbloqueado
  if (streak.badges.includes(badge.id)) {
    return false;
  }

  const { requirement } = badge;

  switch (requirement.type) {
    case 'streak':
      return streak.current_streak >= requirement.days;
    case 'points':
      return streak.total_points >= requirement.amount;
    case 'level':
      return streak.level >= requirement.level;
    case 'habits_completed':
      // Seria necessário contar os logs, mas por enquanto retorna false
      return false;
    default:
      return false;
  }
}

