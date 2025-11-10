/**
 * Personalize Tip - Edge Function
 *
 * Gera dica diária personalizada baseada no contexto da usuária
 * Usa Gemini 2.0 Flash ou Claude com retry exponential backoff
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// =====================================================
// SCHEMA VALIDATION (Zod)
// =====================================================

const RequestSchema = z.object({
  userId: z.string().uuid(),
  forceNew: z.boolean().optional().default(false),
});

const DailyTipSchema = z.object({
  title: z.string().min(10).max(100),
  description: z.string().min(50).max(500),
  actionable: z.string().min(20).max(200),
  relevance_score: z.number().min(0).max(100).optional(),
});

// =====================================================
// TYPES
// =====================================================

interface DailyTip {
  title: string;
  description: string;
  actionable: string;
  relevance_score?: number;
}

interface UserContext {
  type: 'gestante' | 'mae' | 'tentante' | null;
  pregnancy_week?: number | null;
  baby_name?: string | null;
  onboarding_data?: any;
  recent_messages?: any[];
}

// =====================================================
// RETRY CONFIG
// =====================================================

const RETRY_CONFIG = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 segundo
  maxDelay: 10000, // 10 segundos
};

async function retryWithBackoff<T>(fn: () => Promise<T>, attempt = 1): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (attempt >= RETRY_CONFIG.maxAttempts) {
      throw error;
    }

    const delay = Math.min(RETRY_CONFIG.baseDelay * Math.pow(2, attempt - 1), RETRY_CONFIG.maxDelay);

    console.log(`Retry attempt ${attempt}/${RETRY_CONFIG.maxAttempts}, waiting ${delay}ms`);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return retryWithBackoff(fn, attempt + 1);
  }
}

// =====================================================
// BUSCAR CONTEXTO DA USUÁRIA
// =====================================================

async function getUserContext(userId: string, supabase: any): Promise<UserContext> {
  // Buscar perfil
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('type, pregnancy_week, baby_name, onboarding_data')
    .eq('id', userId)
    .single();

  // Buscar últimas 5 mensagens do chat
  const { data: messages } = await supabase
    .from('chat_messages')
    .select('message, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    type: profile?.type || null,
    pregnancy_week: profile?.pregnancy_week || null,
    baby_name: profile?.baby_name || null,
    onboarding_data: profile?.onboarding_data || {},
    recent_messages: messages || [],
  };
}

// =====================================================
// VERIFICAR SE JÁ TEM DICA DO DIA
// =====================================================

async function getExistingTip(userId: string, supabase: any): Promise<any | null> {
  const { data, error } = await supabase
    .from('daily_insights')
    .select('*')
    .eq('user_id', userId)
    .eq('date', new Date().toISOString().split('T')[0])
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = not found
    console.error('Error checking existing tip:', error);
  }

  return data;
}

// =====================================================
// GERAR DICA COM GEMINI 2.0 FLASH
// =====================================================

async function generateTipWithGemini(context: UserContext): Promise<DailyTip> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const userPhase = context.type || 'mãe em geral';
  const weekInfo = context.pregnancy_week ? `(${context.pregnancy_week} semanas)` : '';
  const babyInfo = context.baby_name ? `Bebê: ${context.baby_name}` : '';

  const prompt = `Você é uma assistente especializada em maternidade. Gere uma DICA DIÁRIA personalizada e relevante.

CONTEXTO DA USUÁRIA:
- Fase: ${userPhase} ${weekInfo}
${babyInfo ? `- ${babyInfo}` : ''}
- Data: ${new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}

INSTRUÇÕES:
1. Crie uma dica PRÁTICA e APLICÁVEL no dia de hoje
2. Seja ESPECÍFICA para a fase dela (${userPhase})
3. Tom: empático, encorajador, sem julgamentos
4. Sem aconselhamento médico
5. Máximo 500 caracteres na descrição

FORMATO DE RESPOSTA (JSON válido):
{
  "title": "Título curto e chamativo (máx 100 chars)",
  "description": "Descrição detalhada da dica (máx 500 chars)",
  "actionable": "Call-to-action clara e simples (máx 200 chars)",
  "relevance_score": 85
}

Gere APENAS o JSON, sem texto adicional.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 400,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('No response from Gemini');
  }

  // Extrair JSON da resposta
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Invalid JSON in response');
  }

  const tipData = JSON.parse(jsonMatch[0]);

  // Validar com Zod
  return DailyTipSchema.parse(tipData);
}

// =====================================================
// GERAR DICA COM CLAUDE (FALLBACK)
// =====================================================

async function generateTipWithClaude(context: UserContext): Promise<DailyTip> {
  const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');

  if (!claudeApiKey) {
    throw new Error('CLAUDE_API_KEY not configured');
  }

  const userPhase = context.type || 'mãe em geral';
  const weekInfo = context.pregnancy_week ? `(${context.pregnancy_week} semanas)` : '';

  const prompt = `Gere uma dica diária de maternidade para ${userPhase} ${weekInfo}. Responda em JSON: {"title": "...", "description": "...", "actionable": "...", "relevance_score": 90}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': claudeApiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;

  if (!text) {
    throw new Error('No response from Claude');
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Invalid JSON in response');
  }

  return DailyTipSchema.parse(JSON.parse(jsonMatch[0]));
}

// =====================================================
// MOCK TIP (DESENVOLVIMENTO)
// =====================================================

function generateMockTip(context: UserContext): DailyTip {
  const phase = context.type || 'mãe';
  return {
    title: `Dica do Dia para ${phase}`,
    description:
      'Hoje é um ótimo dia para praticar autocuidado! Reserve 15 minutos só para você, seja lendo, meditando ou apenas respirando. Você merece esse tempo.',
    actionable: 'Reserve 15 minutos hoje para fazer algo que te acalme e te faça bem.',
    relevance_score: 85,
  };
}

// =====================================================
// SALVAR DICA NO BANCO
// =====================================================

async function saveDailyTip(userId: string, tip: DailyTip, context: UserContext, supabase: any): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setHours(23, 59, 59, 999); // Expira no final do dia

  const { error } = await supabase.from('daily_insights').upsert(
    {
      user_id: userId,
      date: new Date().toISOString().split('T')[0],
      title: tip.title,
      description: tip.description,
      actionable: tip.actionable,
      relevance_score: tip.relevance_score || 80,
      context_data: {
        userPhase: context.type,
        weekOrAge: context.pregnancy_week,
        generatedAt: new Date().toISOString(),
      },
      expires_at: expiresAt.toISOString(),
    },
    {
      onConflict: 'user_id,date',
    }
  );

  if (error) {
    throw new Error(`Failed to save tip: ${error.message}`);
  }
}

// =====================================================
// EDGE FUNCTION HANDLER
// =====================================================

serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse e validar request
    const body = await req.json();
    const { userId, forceNew } = RequestSchema.parse(body);

    // Inicializar Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase config missing');
    }

    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    });

    // Verificar se já tem dica de hoje (se não forçar nova)
    if (!forceNew) {
      const existingTip = await getExistingTip(userId, supabase);
      if (existingTip) {
        return new Response(
          JSON.stringify({
            tip: existingTip,
            cached: true,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Buscar contexto da usuária
    const context = await getUserContext(userId, supabase);

    // Gerar dica com retry e fallback
    let tip: DailyTip;

    const provider = Deno.env.get('LLM_PROVIDER') || 'gemini';

    try {
      if (provider === 'gemini' && Deno.env.get('GEMINI_API_KEY')) {
        tip = await retryWithBackoff(() => generateTipWithGemini(context));
      } else if (provider === 'claude' && Deno.env.get('CLAUDE_API_KEY')) {
        tip = await retryWithBackoff(() => generateTipWithClaude(context));
      } else {
        // Mock para desenvolvimento
        console.log('Using mock tip (no API keys configured)');
        tip = generateMockTip(context);
      }
    } catch (error) {
      console.error('Error generating tip, using mock:', error);
      tip = generateMockTip(context);
    }

    // Salvar no banco
    await saveDailyTip(userId, tip, context, supabase);

    return new Response(
      JSON.stringify({
        tip: {
          ...tip,
          date: new Date().toISOString().split('T')[0],
        },
        cached: false,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in personalize-tip:', error);

    // Zod validation errors
    if (error.name === 'ZodError') {
      return new Response(
        JSON.stringify({
          error: 'Validation error',
          details: error.errors,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message || 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

