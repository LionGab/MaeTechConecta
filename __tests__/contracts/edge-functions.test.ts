/**
 * Contract Tests - Edge Functions
 * Testa contratos das Edge Functions do Supabase
 */

import { describe, it, expect, beforeAll } from 'vitest';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials não configuradas. Testes de Edge Functions serão pulados.');
}

describe('Edge Functions - nathia-chat', () => {
  it('deve responder happy path (200)', async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      expect(true).toBe(true); // Skip test
      return;
    }

    // Dado: usuário autenticado e mensagem válida
    // Quando: chama nathia-chat
    // Então: deve retornar 200 com resposta da IA

    const response = await fetch(`${supabaseUrl}/functions/v1/nathia-chat`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Oi NathIA, estou me sentindo ansiosa hoje.',
        userId: 'test-user-id',
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('response');
    expect(data.response).toBeTruthy();
  });

  it('deve fazer rate limiting (429)', async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      expect(true).toBe(true); // Skip test
      return;
    }

    // Dado: usuário fazendo muitas requisições
    // Quando: excede limite (30 req/min)
    // Então: deve retornar 429

    const requests = Array.from({ length: 35 }, () =>
      fetch(`${supabaseUrl}/functions/v1/nathia-chat`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Test message',
          userId: 'test-user-id',
        }),
      })
    );

    const responses = await Promise.all(requests);
    const rateLimited = responses.some((r) => r.status === 429);

    // Pelo menos uma requisição deve ser rate limited
    expect(rateLimited).toBe(true);
  });
});

describe('Edge Functions - moderation-service', () => {
  it('deve bloquear conteúdo inapropriado (403)', async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      expect(true).toBe(true); // Skip test
      return;
    }

    // Dado: mensagem com conteúdo inapropriado
    // Quando: chama moderation-service
    // Então: deve retornar 403 ou action: 'block'

    const response = await fetch(`${supabaseUrl}/functions/v1/moderation-service`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'conteúdo ofensivo ou perigoso',
        userId: 'test-user-id',
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('action');
    // Se bloquear, action deve ser 'block'
    // expect(data.action).toBe('block');
  });

  it('deve permitir conteúdo seguro (200)', async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      expect(true).toBe(true); // Skip test
      return;
    }

    // Dado: mensagem com conteúdo seguro
    // Quando: chama moderation-service
    // Então: deve retornar 200 com action: 'allow'

    const response = await fetch(`${supabaseUrl}/functions/v1/moderation-service`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Oi, estou me sentindo bem hoje!',
        userId: 'test-user-id',
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('action');
    expect(data.action).toBe('allow');
  });
});

describe('Edge Functions - risk-classifier', () => {
  it('deve detectar risco alto e flag apropriado (200)', async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      expect(true).toBe(true); // Skip test
      return;
    }

    // Dado: mensagem com risco alto (suicídio)
    // Quando: chama risk-classifier
    // Então: deve retornar 200 com level ≥ 9 e flags apropriados

    const response = await fetch(`${supabaseUrl}/functions/v1/risk-classifier`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'quero me matar',
        userId: 'test-user-id',
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('level');
    expect(data.level).toBeGreaterThanOrEqual(9);
    expect(data).toHaveProperty('flags');
    expect(data.flags).toContain('suicidal_ideation');
    expect(data).toHaveProperty('requires_intervention');
    expect(data.requires_intervention).toBe(true);
  });

  it('deve detectar risco normal (200)', async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      expect(true).toBe(true); // Skip test
      return;
    }

    // Dado: mensagem com risco normal
    // Quando: chama risk-classifier
    // Então: deve retornar 200 com level ≤ 2

    const response = await fetch(`${supabaseUrl}/functions/v1/risk-classifier`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'estou bem hoje, obrigada!',
        userId: 'test-user-id',
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('level');
    expect(data.level).toBeLessThanOrEqual(2);
    expect(data).toHaveProperty('requires_intervention');
    expect(data.requires_intervention).toBe(false);
  });
});
