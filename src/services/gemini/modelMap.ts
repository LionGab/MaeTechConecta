import { API_URLS } from '@/config/api';
import { GeminiError, type GeminiModel } from './types';

type SupportedEndpointModel =
  | GeminiModel
  | 'gemini-2.5-flash-exp'
  | 'gemini-2.5-pro-exp';

const MODEL_REGISTRY: Record<SupportedEndpointModel, string> = {
  'gemini-2.5-flash': 'gemini-2.5-flash-exp',
  'gemini-2.5-flash-exp': 'gemini-2.5-flash-exp',
  'gemini-2.5-pro': 'gemini-2.5-pro-exp',
  'gemini-2.5-pro-exp': 'gemini-2.5-pro-exp',
  'gemini-2.0-flash-exp': 'gemini-2.0-flash-exp',
};

export function getGeminiEndpointForModel(model: SupportedEndpointModel): string {
  const apiModelName = MODEL_REGISTRY[model];

  if (!apiModelName) {
    throw new GeminiError(`Modelo não suportado: ${String(model)}`, 'unknown');
  }

  return `${API_URLS.GEMINI}/models/${apiModelName}:generateContent`;
}
