import { describe, it, expect } from 'vitest';
import { parseChallengesResponse } from '@/services/gemini/utils';

const buildResponse = (payload: unknown) =>
  ({
    candidates: [
      {
        content: {
          parts: [
            {
              text: JSON.stringify(payload),
            },
          ],
        },
      },
    ],
  }) as any;

describe('parseChallengesResponse', () => {
  it('aceita categories e difficulties válidos', () => {
    const input = [
      { title: 'Sono', description: 'Melhorar rotina', category: 'autocuidado', difficulty: 'easy' },
      { title: 'Amamentação', description: 'Apoio', category: 'maternidade', difficulty: 'medium' },
      { title: 'Pré-natal', description: 'Consultas', category: 'saude', difficulty: 'hard' },
      { title: 'Ansiedade', description: 'Respiração', category: 'emocional', difficulty: 'easy' },
    ];

    const parsed = parseChallengesResponse(buildResponse(input));

    expect(parsed).toHaveLength(4);
    expect(parsed.every((item) => item.category && item.difficulty)).toBe(true);
  });

  it('rejeita category inválida', () => {
    const bad = [{ title: 'X', description: 'Y', category: 'zzz', difficulty: 'easy' }];

    expect(() => parseChallengesResponse(buildResponse(bad))).toThrow();
  });

  it('rejeita difficulty inválida', () => {
    const bad = [{ title: 'X', description: 'Y', category: 'saude', difficulty: 'ultra' }];

    expect(() => parseChallengesResponse(buildResponse(bad))).toThrow();
  });
});
