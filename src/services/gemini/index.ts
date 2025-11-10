export { createGeminiClient } from './base';
export { createChatService } from './chat';
export { createContentService } from './content';
export { createAnalysisService } from './analysis';
export { getGeminiEndpointForModel } from './modelMap';

export type {
  GeminiClient,
  GeminiClientConfig,
  GeminiContent,
  GeminiContentPart,
  GeminiGenerationConfig,
  GeminiModel,
  GeminiResponseData,
  GeminiUsageMetadata,
  GeminiCallOptions,
  GeminiErrorCode,
  GeminiSafetySetting,
  GeminiSafetyCategory,
  GeminiSafetyThreshold,
  RateLimitConfig,
  RateLimitHit,
} from './types';

export { GeminiError } from './types';

export {
  buildChatSystemPrompt,
  buildChatContents,
  buildDailyInsightPrompt,
  buildDailyChallengesPrompt,
  buildMotivationalPrompt,
  buildMundoNathPrompt,
  buildPostpartumScreeningPrompt,
  buildProfileAnalysisPrompt,
  extractPrimaryText,
  parseJsonResponse,
  parseChallengesResponse,
} from './utils';
