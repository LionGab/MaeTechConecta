import { supabase } from './supabase';

interface ContentGeneratorResponse<T> {
  success?: boolean;
  error?: string;
  message?: string;
  videoUrl?: string | null;
  imageUrl?: string | null;
  items?: T;
  exercises?: T;
}

async function invokeContentGenerator<T>(action: string, payload: Record<string, unknown>): Promise<T | null> {
  const { data, error } = await supabase.functions.invoke<ContentGeneratorResponse<T>>('content-generator', {
    body: {
      action,
      payload,
    },
  });

  if (error) {
    console.error(`[contentGenerator] invoke error (${action}):`, error);
    return null;
  }

  if (data?.error) {
    console.error(`[contentGenerator] remote error (${action}):`, data.error);
    return null;
  }

  if (data?.message && !data.success) {
    console.error(`[contentGenerator] remote message (${action}):`, data.message);
    return null;
  }

  return (data?.videoUrl ?? data?.imageUrl ?? data?.items ?? data?.exercises ?? null) as T | null;
}

/**
 * Gera vídeo com avatar via Edge Function segura.
 */
export const generateVideoWithAvatar = async (script: string): Promise<string> => {
  const result = await invokeContentGenerator<string>('generateVideoWithAvatar', { script });
  return result ?? '';
};

/**
 * Gera imagem via Edge Function segura.
 */
export const generateImage = async (prompt: string): Promise<string> => {
  const result = await invokeContentGenerator<string>('generateImage', { prompt });
  return result ?? '';
};

/**
 * Gera lista de conteúdo via Edge Function segura.
 */
export const generateListContent = async (topic: string, context: string): Promise<string[]> => {
  const result = await invokeContentGenerator<string[]>('generateListContent', { topic, context });
  return result ?? [];
};

/**
 * Gera exercícios personalizados via Edge Function segura.
 */
export const generateExercises = async (pregnancyWeek: number, preferences: string[] = []): Promise<any[]> => {
  const result = await invokeContentGenerator<any[]>('generateExercises', { pregnancyWeek, preferences });
  return result ?? [];
};
