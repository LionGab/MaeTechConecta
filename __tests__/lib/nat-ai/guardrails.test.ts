/**
 * Testes - NAT-AI Guardrails
 */

import { describe, it, expect } from 'vitest';
import { containsForbiddenTopic, containsRiskKeywords, getRiskLevel } from '../../../src/lib/nat-ai/guardrails';

describe('NAT-AI Guardrails', () => {
  describe('containsForbiddenTopic', () => {
    it('deve detectar termos médicos', () => {
      expect(containsForbiddenTopic('devo tomar remédio')).toBe(true);
      expect(containsForbiddenTopic('qual diagnóstico')).toBe(true);
      expect(containsForbiddenTopic('preciso de exame')).toBe(true);
    });

    it('não deve flaggar conversa normal', () => {
      expect(containsForbiddenTopic('estou me sentindo ansiosa')).toBe(false);
      expect(containsForbiddenTopic('como está o tempo hoje')).toBe(false);
    });
  });

  describe('containsRiskKeywords', () => {
    it('deve detectar palavras-chave de risco', () => {
      expect(containsRiskKeywords('quero morrer')).toBe(true);
      expect(containsRiskKeywords('me matar')).toBe(true);
      expect(containsRiskKeywords('machucar o bebê')).toBe(true);
    });

    it('não deve flaggar conversa normal', () => {
      expect(containsRiskKeywords('estou feliz')).toBe(false);
      expect(containsRiskKeywords('meu bebê está bem')).toBe(false);
    });
  });

  describe('getRiskLevel', () => {
    it('deve retornar risco alto para ideação suicida', () => {
      const level = getRiskLevel('quero me matar');
      expect(level).toBeGreaterThanOrEqual(10);
    });

    it('deve retornar risco alto para harm ao bebê', () => {
      const level = getRiskLevel('quero machucar o bebê');
      expect(level).toBeGreaterThanOrEqual(10);
    });

    it('deve retornar risco baixo para conversa normal', () => {
      const level = getRiskLevel('estou bem hoje');
      expect(level).toBeLessThanOrEqual(2);
    });
  });
});

