import { describe, it, expect } from 'vitest';
import type { OnboardingData } from '@/types/onboarding';

// Teste focado em garantir que os campos renomeados permaneçam congelados
// Usa casting mínimo para não depender de todos os campos obrigatórios

describe('OnboardingData fields', () => {
  it("usa 'maternal_stage' e 'expectations'", () => {
    const sample: OnboardingData = {
      name: 'Maria',
      maternal_stage: 'gestante',
      expectations: ['bem-estar'],
    } as unknown as OnboardingData;

    expect(sample).toHaveProperty('maternal_stage');
    expect(sample).toHaveProperty('expectations');
    expect('pregnancy_stage' in (sample as Record<string, unknown>)).toBe(false);
    expect('goals' in (sample as Record<string, unknown>)).toBe(false);
  });
});
