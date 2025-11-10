/**
 * Testes reais para utilitários de gamificação
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  calculatePoints,
  calculateStreakFromDates,
  formatPoints,
  formatStreak,
  getNewlyUnlockedBadges,
  getStreakMultiplier,
} from '../../src/shared/lib/gamification';
import { BADGES, calculateLevel } from '../../src/shared/types/gamification.types';

describe('Gamificação - Streak', () => {
  const today = new Date('2025-01-08T08:00:00Z');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(today);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve retornar 0 quando não há completions', () => {
    expect(calculateStreakFromDates([])).toBe(0);
  });

  it('deve contar streak contínuo até hoje', () => {
    const completions = [
      new Date('2025-01-08T01:00:00Z'),
      new Date('2025-01-07T09:00:00Z'),
      new Date('2025-01-06T20:00:00Z'),
    ];

    expect(calculateStreakFromDates(completions)).toBe(3);
  });

  it('deve quebrar streak quando última data é anterior a ontem', () => {
    const completions = [new Date('2025-01-05T10:00:00Z')];

    expect(calculateStreakFromDates(completions)).toBe(0);
  });

  it('deve respeitar limites de fuso horário', () => {
    const completions = [new Date('2025-01-07T23:59:59-03:00'), new Date('2025-01-08T00:01:00-03:00')];

    expect(calculateStreakFromDates(completions)).toBe(2);
  });
});

describe('Gamificação - Pontos e Multiplicadores', () => {
  it('deve calcular pontos com multiplicador padrão', () => {
    expect(calculatePoints(5)).toBe(50);
  });

  it('deve aplicar multiplicador customizado', () => {
    expect(calculatePoints(5, 10, 1.5)).toBe(75);
  });

  it('deve aplicar multiplicadores de streak corretamente', () => {
    expect(getStreakMultiplier(0)).toBe(1);
    expect(getStreakMultiplier(5)).toBeCloseTo(1.1);
    expect(getStreakMultiplier(15)).toBeCloseTo(1.2);
    expect(getStreakMultiplier(45)).toBeCloseTo(1.3);
    expect(getStreakMultiplier(80)).toBeCloseTo(2);
  });

  it('deve formatar pontos para exibição', () => {
    expect(formatPoints(500)).toBe('500');
    expect(formatPoints(2500)).toBe('2.5K');
    expect(formatPoints(1200000)).toBe('1.2M');
  });

  it('deve formatar streaks para exibição', () => {
    expect(formatStreak(0)).toBe('Nenhum');
    expect(formatStreak(1)).toBe('1 dia');
    expect(formatStreak(7)).toBe('7 dias');
  });
});

describe('Gamificação - Níveis e Badges', () => {
  it('deve determinar nível com base nos pontos', () => {
    expect(calculateLevel(0).level).toBe(1);
    expect(calculateLevel(150).level).toBe(2);
    expect(calculateLevel(1200).level).toBe(5);
    expect(calculateLevel(60000).level).toBe(10);
  });

  it('deve desbloquear badges novos', () => {
    const stats = {
      current_streak: 8,
      total_points: 1500,
      level: calculateLevel(1500).level,
      habits_completed: 120,
    };

    const unlocked = getNewlyUnlockedBadges(['first_habit'], stats);

    expect(unlocked.map((badge) => badge.id)).toEqual(expect.arrayContaining(['streak_7', 'points_1000', 'level_5']));
  });

  it('não deve duplicar badges já desbloqueados', () => {
    const stats = {
      current_streak: 10,
      total_points: 5000,
      level: calculateLevel(5000).level,
      habits_completed: 500,
    };

    const unlocked = getNewlyUnlockedBadges(['streak_7', 'points_1000'], stats);

    expect(unlocked.some((badge) => ['streak_7', 'points_1000'].includes(badge.id))).toBe(false);
  });

  it('deve manter catálogo de badges sincronizado', () => {
    expect(BADGES.length).toBeGreaterThan(0);
    expect(BADGES.every((badge) => badge.id && badge.name && badge.requirement)).toBe(true);
  });
});
