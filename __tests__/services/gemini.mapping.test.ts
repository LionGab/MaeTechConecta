import { describe, it, expect } from 'vitest';
import { getGeminiEndpointForModel } from '@/services/gemini/modelMap';
import { GeminiError } from '@/services/gemini';

describe('Gemini model mapping', () => {
  it('resolve endpoints de flash e pro', () => {
    expect(getGeminiEndpointForModel('gemini-2.5-flash-exp')).toMatch(/flash/i);
    expect(getGeminiEndpointForModel('gemini-2.5-pro-exp')).toMatch(/pro/i);
  });

  it('aceita aliases internos sem sufixo exp', () => {
    expect(getGeminiEndpointForModel('gemini-2.5-flash')).toMatch(/flash/i);
    expect(getGeminiEndpointForModel('gemini-2.5-pro')).toMatch(/pro/i);
  });

  it('lança GeminiError para modelo desconhecido', () => {
    expect(() => getGeminiEndpointForModel('foo-bar' as any)).toThrow(GeminiError);
  });
});

