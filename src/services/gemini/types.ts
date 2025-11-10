export type GeminiModel =
  | 'gemini-2.5-flash'
  | 'gemini-2.5-flash-exp'
  | 'gemini-2.5-pro'
  | 'gemini-2.5-pro-exp'
  | 'gemini-2.0-flash-exp';

export type GeminiSafetyCategory =
  | 'HARM_CATEGORY_HARASSMENT'
  | 'HARM_CATEGORY_HATE_SPEECH'
  | 'HARM_CATEGORY_SEXUALLY_EXPLICIT'
  | 'HARM_CATEGORY_DANGEROUS_CONTENT';

export type GeminiSafetyThreshold = 'BLOCK_NONE' | 'BLOCK_ONLY_HIGH' | 'BLOCK_MEDIUM_AND_ABOVE';

export interface GeminiSafetySetting {
  category: GeminiSafetyCategory;
  threshold: GeminiSafetyThreshold;
}

export interface GeminiGenerationConfig {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  candidateCount?: number;
  stopSequences?: string[];
}

export interface GeminiContentPart {
  text: string;
}

export interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiContentPart[];
}

export interface GeminiSafetyRating {
  category: GeminiSafetyCategory;
  probability: 'PROBABILITY_UNSPECIFIED' | 'VERY_UNLIKELY' | 'UNLIKELY' | 'POSSIBLE' | 'LIKELY' | 'VERY_LIKELY';
}

export interface GeminiUsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
}

export interface GeminiResponseCandidate {
  content: {
    parts: GeminiContentPart[];
    role: 'model';
  };
  finishReason?: 'FINISH_REASON_UNSPECIFIED' | 'STOP' | 'MAX_TOKENS' | 'SAFETY' | 'RECITATION' | 'OTHER';
  safetyRatings?: GeminiSafetyRating[];
}

export interface GeminiResponseData {
  candidates: GeminiResponseCandidate[];
  usageMetadata?: GeminiUsageMetadata;
  promptFeedback?: {
    safetyRatings?: GeminiSafetyRating[];
  };
}

export interface GeminiRequestPayload {
  contents: GeminiContent[];
  systemInstruction?: string;
  generationConfig?: GeminiGenerationConfig;
  safetySettings?: GeminiSafetySetting[];
}

export interface RateLimitConfig {
  maxRequests: number;
  intervalMs: number;
}

export interface GeminiClientConfig {
  defaultModel: GeminiModel;
  fallbackModel?: GeminiModel;
  generationConfig: GeminiGenerationConfig;
  safetySettings: GeminiSafetySetting[];
  maxRetries: number;
  retryDelayMs: number;
  rateLimit: RateLimitConfig;
}

export type GeminiErrorCode = 'missing-api-key' | 'http-error' | 'empty-response' | 'rate-limit' | 'unknown';

export interface GeminiErrorMetadata {
  status?: number;
  retryAfterSeconds?: number;
  details?: unknown;
  rateLimit?: RateLimitHit;
}

export class GeminiError extends Error {
  public readonly code: GeminiErrorCode;

  public readonly metadata?: GeminiErrorMetadata;

  constructor(message: string, code: GeminiErrorCode, metadata?: GeminiErrorMetadata) {
    super(message);
    this.name = 'GeminiError';
    this.code = code;
    this.metadata = metadata;
  }
}

export interface GeminiCallOptions {
  contents: GeminiContent[];
  systemInstruction?: string;
  model?: GeminiModel;
  generationConfig?: GeminiGenerationConfig;
  safetySettings?: GeminiSafetySetting[];
  abortSignal?: AbortSignal;
  userId?: string;
  requestId?: string;
  rateLimitKey?: string;
}

export interface RateLimitHit {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

export interface GeminiClient {
  call: (options: GeminiCallOptions) => Promise<GeminiResponseData>;
  config: GeminiClientConfig;
}

