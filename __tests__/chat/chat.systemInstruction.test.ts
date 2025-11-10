import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest';
import { createChatService } from '@/services/gemini/chat';
import * as utils from '@/services/gemini/utils';
import type { GeminiClient } from '@/services/gemini';

const buildClient = (callMock: ReturnType<typeof vi.fn>): GeminiClient => ({
  call: callMock,
  config: {
    defaultModel: 'gemini-2.5-flash',
    fallbackModel: 'gemini-2.5-pro',
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 600,
      topK: 40,
      topP: 0.95,
    },
    safetySettings: [],
    maxRetries: 3,
    retryDelayMs: 1_000,
    rateLimit: {
      maxRequests: 60,
      intervalMs: 60_000,
    },
  },
});

describe('chat systemInstruction', () => {
  const buildSpy = vi.spyOn(utils, 'buildChatSystemPrompt');

  beforeEach(() => {
    buildSpy.mockReturnValue('Você é a NathIA, acolhedora e segura.');
  });

  afterEach(() => {
    buildSpy.mockReset();
  });

  afterAll(() => {
    buildSpy.mockRestore();
  });

  it('propaga systemInstruction corretamente para o Gemini', async () => {
    const callMock = vi.fn().mockResolvedValue({
      candidates: [
        {
          content: {
            parts: [{ text: 'Tudo bem, vamos conversar.' }],
          },
        },
      ],
      usageMetadata: {},
    });
    const client = buildClient(callMock);
    const chatService = createChatService(client);

    await chatService.sendMessage({
      message: 'Olá',
      userId: 'test-user',
      onboardingData: {
        name: 'Maria',
        maternal_stage: 'gestante',
        self_care_frequency: 'diario' as any,
        emotional_state: 'feliz' as any,
        stress_level: 5,
        sleep_quality: 'bom' as any,
        energy_level: 5,
        main_challenges: [] as any,
        main_needs: [] as any,
        support_network: 'moderado' as any,
        expectations: ['bem-estar'],
        content_interests: [] as any,
        communication_style: 'empatico' as any,
      },
    });

    expect(buildSpy).toHaveBeenCalled();
    const lastCallArgs = callMock.mock.calls.at(-1)?.[0];
    expect(lastCallArgs?.systemInstruction).toBe('Você é a NathIA, acolhedora e segura.');
  });
});

