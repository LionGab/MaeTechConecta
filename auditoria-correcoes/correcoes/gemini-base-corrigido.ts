/**
 * Gemini Base Service - CORRIGIDO
 *
 * CORREÇÃO: DEFAULT_MODEL alterado para 'gemini-2.0-flash-exp'
 * (modelo experimental estável e suportado pela API)
 */

import { API_CONFIG } from '@/config/api';
import { logger } from '@/lib/logger';
import {
  GeminiCallOptions,
  GeminiClient,
  GeminiClientConfig,
  GeminiError,
  GeminiModel,
  GeminiRequestPayload,
  GeminiResponseData,
  RateLimitHit,
} from './types';
import { getGeminiEndpointForModel } from './modelMap';

// CORREÇÃO: Modelo padrão alterado para gemini-2.0-flash-exp (estável)
const DEFAULT_MODEL: GeminiModel = 'gemini-2.0-flash-exp';
const FALLBACK_MODEL: GeminiModel = 'gemini-2.0-flash-exp';

const DEFAULT_CONFIG: GeminiClientConfig = {
  defaultModel: DEFAULT_MODEL,
  fallbackModel: FALLBACK_MODEL,
  generationConfig: {
    temperature: 0.8,
    maxOutputTokens: 800,
    topP: 0.95,
    topK: 40,
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE',
    },
  ],
  maxRetries: 3,
  retryDelayMs: 1_000,
  rateLimit: {
    maxRequests: 60,
    intervalMs: 60_000,
  },
};

const rateLimitState = new Map<string, number[]>();

function getApiKey(): string {
  const apiKey = API_CONFIG.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiError('Gemini API key is missing', 'missing-api-key');
  }
  return apiKey;
}

function assertRateLimit(key: string, limit: RateLimitHit['limit']): void {
  const timestamps = rateLimitState.get(key) ?? [];
  const now = Date.now();
  const windowStart = now - limit.intervalMs;
  const recentCalls = timestamps.filter((timestamp) => timestamp > windowStart);

  if (recentCalls.length >= limit.maxRequests) {
    throw new GeminiError('Rate limit exceeded', 'rate-limit', {
      retryAfterSeconds: Math.ceil((recentCalls[0] + limit.intervalMs - now) / 1_000),
    });
  }

  rateLimitState.set(key, [...recentCalls, now]);
}

async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function performRequest(
  payload: GeminiRequestPayload,
  model: GeminiModel,
  config: GeminiClientConfig,
  abortSignal?: AbortSignal
): Promise<GeminiResponseData> {
  const url = `${getGeminiEndpointForModel(model)}?key=${getApiKey()}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal: abortSignal,
  });

  if (!response.ok) {
    const retryAfterHeader = response.headers.get('retry-after');
    const retryAfterSeconds = retryAfterHeader ? Number.parseInt(retryAfterHeader, 10) : undefined;

    let errorMessage = `Gemini API error: ${response.status} ${response.statusText}`;
    let errorDetails: unknown;

    try {
      errorDetails = await response.json();
    } catch {
      errorDetails = await response.text();
    }

    if (errorDetails && typeof errorDetails === 'object') {
      errorMessage = `${errorMessage} - ${JSON.stringify(errorDetails)}`;
    }

    throw new GeminiError(errorMessage, 'http-error', {
      status: response.status,
      retryAfterSeconds,
      details: errorDetails,
    });
  }

  const data = (await response.json()) as GeminiResponseData;

  if (!data.candidates || data.candidates.length === 0) {
    throw new GeminiError('Resposta vazia do Gemini', 'empty-response');
  }

  return data;
}

export function createGeminiClient(partialConfig: Partial<GeminiClientConfig> = {}): GeminiClient {
  const config: GeminiClientConfig = {
    ...DEFAULT_CONFIG,
    ...partialConfig,
    generationConfig: {
      ...DEFAULT_CONFIG.generationConfig,
      ...partialConfig.generationConfig,
    },
    rateLimit: {
      ...DEFAULT_CONFIG.rateLimit,
      ...partialConfig.rateLimit,
    },
  };

  const call = async (options: GeminiCallOptions): Promise<GeminiResponseData> => {
    const {
      contents,
      systemInstruction,
      model = config.defaultModel,
      generationConfig,
      safetySettings,
      abortSignal,
      userId,
      requestId,
    } = options;

    const rateKey = options.rateLimitKey ?? userId ?? 'global';
    assertRateLimit(rateKey, config.rateLimit);

    const payload: GeminiRequestPayload = {
      contents,
      systemInstruction,
      generationConfig: {
        ...config.generationConfig,
        ...generationConfig,
      },
      safetySettings: safetySettings ?? config.safetySettings,
    };

    let attempt = 0;
    let lastError: unknown;
    let currentModel: GeminiModel = model;

    while (attempt <= config.maxRetries) {
      try {
        attempt += 1;
        const response = await performRequest(payload, currentModel, config, abortSignal);

        logger.debug('Gemini call succeeded', {
          model: currentModel,
          requestId,
          attempt,
        });

        return response;
      } catch (error) {
        lastError = error;

        if (!(error instanceof GeminiError)) {
          throw error;
        }

        const isRetryable =
          error.code === 'http-error' && error.metadata?.status !== 400 && error.metadata?.status !== 401;

        if (!isRetryable || attempt > config.maxRetries) {
          logger.error('Gemini call failed', error instanceof Error ? error : undefined, {
            model: currentModel,
            attempt,
            error: error instanceof Error ? error.message : String(error),
            requestId,
          });
          throw error;
        }

        const retryAfterSeconds = error.metadata?.retryAfterSeconds;
        const backoffMs = retryAfterSeconds
          ? retryAfterSeconds * 1_000
          : config.retryDelayMs * Math.pow(2, attempt - 1);

        logger.warn('Gemini call retrying', {
          model: currentModel,
          attempt,
          requestId,
          backoffMs,
          status: error.metadata?.status,
        });

        if (currentModel === config.defaultModel && config.fallbackModel) {
          currentModel = config.fallbackModel;
        }

        await wait(backoffMs);
      }
    }

    throw lastError instanceof Error ? lastError : new GeminiError('Erro desconhecido ao chamar Gemini', 'unknown');
  };

  return {
    call,
    config,
  };
}
