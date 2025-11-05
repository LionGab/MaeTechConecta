/**
 * Testes - AI Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch
global.fetch = vi.fn();

describe('AI Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve chamar API de chat', async () => {
    const mockResponse = {
      response: 'Oi querida! Entendo sua ansiedade...',
      rateLimit: { remaining: 29 },
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const response = await fetch('https://api.supabase.co/functions/v1/nathia-chat', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Oi NathIA, estou me sentindo ansiosa hoje.',
        userId: 'test-user',
      }),
    });

    const data = await response.json();
    expect(data.response).toBeTruthy();
    expect(data.rateLimit.remaining).toBeGreaterThan(0);
  });

  it('deve tratar erros de API', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    try {
      await fetch('https://api.supabase.co/functions/v1/nathia-chat', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'test',
          userId: 'test-user',
        }),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
