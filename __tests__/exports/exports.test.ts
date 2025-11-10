import { describe, it, expect } from 'vitest';
import { GeminiError, getGeminiEndpointForModel } from '@/services/gemini';

describe('exports barrel', () => {
  it('GeminiError está disponível no barrel público', () => {
    expect(typeof GeminiError).toBe('function');
  });

  it('getGeminiEndpointForModel é exportado pelo barrel', () => {
    expect(typeof getGeminiEndpointForModel).toBe('function');
  });
});

