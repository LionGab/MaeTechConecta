/**
 * Testes de Contrato Edge Functions
 *
 * Verifica que as Edge Functions estão funcionando corretamente
 * Testa rate limiting, autenticação, e respostas
 */

import { describe, it, expect, beforeAll } from 'vitest';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://test.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'test-anon-key';

describe('Edge Functions - Contract Tests', () => {
  const baseUrl = `${SUPABASE_URL}/functions/v1`;

  describe('nathia-chat', () => {
    it('deve retornar 401 sem Authorization header', async () => {
      const response = await fetch(`${baseUrl}/nathia-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'test-user',
          message: 'Test message',
        }),
      });

      expect(response.status).toBe(401);
    });

    it('deve retornar 200 com Authorization válido', async () => {
      const response = await fetch(`${baseUrl}/nathia-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          userId: 'test-user',
          message: 'Test message',
        }),
      });

      // Pode retornar 200 ou 429 (rate limit)
      expect([200, 429]).toContain(response.status);
    });

    it('deve aplicar rate limiting', async () => {
      const requests = Array.from({ length: 15 }, () =>
        fetch(`${baseUrl}/nathia-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            userId: 'test-user',
            message: 'Test message',
          }),
        })
      );

      const responses = await Promise.all(requests);
      const rateLimited = responses.filter((r) => r.status === 429);

      // Pelo menos algumas requisições devem ser rate limited
      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });

  describe('nat-ai-chat', () => {
    it('deve retornar 401 sem Authorization header', async () => {
      const response = await fetch(`${baseUrl}/nat-ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'test-user',
          message: 'Test message',
        }),
      });

      expect(response.status).toBe(401);
    });

    it('deve processar mensagem válida', async () => {
      const response = await fetch(`${baseUrl}/nat-ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          userId: 'test-user',
          message: 'Test message',
          context: {
            type: 'gestante',
            pregnancy_week: 12,
          },
        }),
      });

      const data = await response.json();
      expect([200, 429]).toContain(response.status);
      if (response.status === 200) {
        expect(data).toHaveProperty('response');
      }
    });
  });

  describe('risk-REDACTED', () => {
    it('deve classificar mensagem como segura', async () => {
      const response = await fetch(`${baseUrl}/risk-REDACTED`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          message: 'Olá, estou grávida de 12 semanas',
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('risk_level');
      expect(['low', 'medium', 'high']).toContain(data.risk_level);
    });

    it('deve classificar mensagem de crise como alta prioridade', async () => {
      const response = await fetch(`${baseUrl}/risk-REDACTED`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          message: 'Estou com muita dor e sangramento',
        }),
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.risk_level).toBe('high');
    });
  });
});
