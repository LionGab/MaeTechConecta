/**
 * Content Generator - Edge Function
 *
 * Encapsula integrações externas (HeyGen, OpenAI) para manter secrets fora do cliente.
 * Todas as chamadas exigem usuário autenticado e impõem limites básicos de payload.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateVideoPayload {
  script: string;
}

interface GenerateImagePayload {
  prompt: string;
}

interface GenerateListPayload {
  topic: string;
  context: string;
}

interface GenerateExercisesPayload {
  pregnancyWeek: number;
  preferences?: string[];
}

type Action = 'generateVideoWithAvatar' | 'generateImage' | 'generateListContent' | 'generateExercises';

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return unauthorized('Authorization header ausente');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('SUPABASE_URL ou SUPABASE_ANON_KEY não configurados');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return unauthorized('Token inválido');
    }

    const body = await req.json();
    const action: Action | undefined = body?.action;

    if (!action) {
      return badRequest('action é obrigatório');
    }

    switch (action) {
      case 'generateVideoWithAvatar': {
        const payload: GenerateVideoPayload | undefined = body?.payload;
        if (!payload?.script) {
          return badRequest('script é obrigatório');
        }
        const result = await handleGenerateVideo(payload);
        return success({ videoUrl: result });
      }

      case 'generateImage': {
        const payload: GenerateImagePayload | undefined = body?.payload;
        if (!payload?.prompt) {
          return badRequest('prompt é obrigatório');
        }
        const result = await handleGenerateImage(payload);
        return success({ imageUrl: result });
      }

      case 'generateListContent': {
        const payload: GenerateListPayload | undefined = body?.payload;
        if (!payload?.topic || !payload?.context) {
          return badRequest('topic e context são obrigatórios');
        }
        const items = await handleGenerateList(payload);
        return success({ items });
      }

      case 'generateExercises': {
        const payload: GenerateExercisesPayload | undefined = body?.payload;
        if (!payload?.pregnancyWeek || isNaN(Number(payload.pregnancyWeek))) {
          return badRequest('pregnancyWeek é obrigatório');
        }
        const exercises = await handleGenerateExercises(payload);
        return success({ exercises });
      }

      default:
        return badRequest(`action inválida: ${action}`);
    }
  } catch (error) {
    console.error('[content-generator] Erro inesperado', error);
    return new Response(
      JSON.stringify({
        error: 'Erro interno',
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function handleGenerateVideo({ script }: GenerateVideoPayload): Promise<string | null> {
  const trimmed = script.trim();
  if (trimmed.length === 0 || trimmed.length > 2000) {
    throw new Error('Script inválido (1-2000 caracteres)');
  }

  const heygenKey = Deno.env.get('HEYGEN_API_KEY');
  if (!heygenKey) {
    throw new Error('HEYGEN_API_KEY não configurada');
  }

  const response = await fetch('https://api.heygen.com/v2/video/generate', {
    method: 'POST',
    headers: {
      'X-API-KEY': heygenKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      character_id: Deno.env.get('HEYGEN_CHARACTER_ID') || 'default_character',
      text: trimmed,
      voice_id: Deno.env.get('HEYGEN_VOICE_ID') || 'default_voice',
      test: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[content-generator] HeyGen erro', response.status, errorText);
    throw new Error('Falha ao gerar vídeo');
  }

  const data = await response.json();
  return data?.data?.video_url ?? null;
}

async function handleGenerateImage({ prompt }: GenerateImagePayload): Promise<string | null> {
  const trimmed = prompt.trim();
  if (trimmed.length === 0 || trimmed.length > 300) {
    throw new Error('Prompt inválido (1-300 caracteres)');
  }

  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiKey) {
    throw new Error('OPENAI_API_KEY não configurada');
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: `Ilustração gentil e acolhedora sobre ${trimmed}. Estilo cartoon brasileiro, cores suaves (rosa e azul), apropriado para gestantes e mães.`,
      size: '1024x1024',
      quality: 'high',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[content-generator] OpenAI image erro', response.status, errorText);
    throw new Error('Falha ao gerar imagem');
  }

  const data = await response.json();
  return data?.data?.[0]?.url ?? null;
}

async function handleGenerateList({ topic, context }: GenerateListPayload): Promise<string[]> {
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiKey) {
    throw new Error('OPENAI_API_KEY não configurada');
  }

  const trimmedTopic = topic.trim();
  const trimmedContext = context.trim();

  if (!trimmedTopic || !trimmedContext) {
    throw new Error('topic e context não podem ser vazios');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente de maternidade. Gere listas práticas e econômicas em PT-BR.',
        },
        {
          role: 'user',
          content: `Liste ${trimmedTopic} ${trimmedContext}. Retorne apenas os itens numerados ou com bullet.`,
        },
      ],
      temperature: 0.6,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[content-generator] OpenAI list erro', response.status, errorText);
    throw new Error('Falha ao gerar lista');
  }

  const data = await response.json();
  const content: string = data?.choices?.[0]?.message?.content || '';

  return content
    .split('\n')
    .map((line: string) =>
      line
        .trim()
        .replace(/^[-•\d.\s]+/, '')
        .trim()
    )
    .filter((item) => item.length > 0)
    .slice(0, 20);
}

async function handleGenerateExercises({ pregnancyWeek, preferences = [] }: GenerateExercisesPayload): Promise<any[]> {
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiKey) {
    throw new Error('OPENAI_API_KEY não configurada');
  }

  const safeWeek = Math.max(1, Math.min(42, Number(pregnancyWeek)));
  const stage = safeWeek <= 12 ? 'primeiro trimestre' : safeWeek <= 27 ? 'segundo trimestre' : 'terceiro trimestre';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Você é um instrutor certificado em exercícios para gestantes. Gere rotinas seguras, curtas e com instruções claras.',
        },
        {
          role: 'user',
          content: `Gere exercícios seguros para ${stage}, semana ${safeWeek}. Considere preferências: ${
            preferences.join(', ') || 'nenhuma'
          }. Responda em JSON com campos name, duration, instructions (array).`,
        },
      ],
      temperature: 0.65,
      max_tokens: 700,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[content-generator] OpenAI exercises erro', response.status, errorText);
    throw new Error('Falha ao gerar exercícios');
  }

  const data = await response.json();
  const content: string = data?.choices?.[0]?.message?.content || '';

  try {
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('JSON não encontrado na resposta');
    }

    const parsed = JSON.parse(content.slice(jsonStart, jsonEnd + 1));
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (Array.isArray(parsed.exercises)) {
      return parsed.exercises;
    }
    return [parsed];
  } catch (error) {
    console.warn('[content-generator] Falha ao parsear exercícios, fallback para parser heurístico', error);
    return fallbackParseExercises(content);
  }
}

function fallbackParseExercises(text: string): any[] {
  const lines = text.split('\n');
  const exercises: any[] = [];
  let current: any = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^\d+[\).\s-]/.test(line)) {
      if (current) exercises.push(current);
      current = { name: line.replace(/^\d+[\).\s-]+/, ''), duration: '', instructions: [] };
      continue;
    }

    if (/duração:/i.test(line)) {
      if (current) current.duration = line.replace(/duração:\s*/i, '').trim();
      continue;
    }

    if (current) {
      current.instructions.push(line);
    }
  }

  if (current) exercises.push(current);
  return exercises;
}

function success(data: Record<string, unknown>) {
  return new Response(
    JSON.stringify({
      success: true,
      ...data,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

function badRequest(message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function unauthorized(message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
