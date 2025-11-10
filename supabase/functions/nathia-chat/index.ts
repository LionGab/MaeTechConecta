/**
 * NathIA Chat - Edge Function com Gemini 2.0 Flash
 * Baseado no PROMPT 3: Setup Gemini 2.0 Flash
 *
 * Sistema de chat conversacional com acolhimento emocional
 * para mães, gestantes e tentantes
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { checkRateLimit } from '../_shared/rateLimiter.ts';

// =====================================================
// PROMPT SYSTEM - NathIA
// =====================================================

const SYSTEM_PROMPT = `Você é a NathIA, assistente virtual criada por Natália Valente para oferecer acolhimento emocional e apoio a mães, gestantes e tentantes.

SUA MISSÃO:
- Escutar com empatia e validação emocional
- Oferecer palavras de apoio e encorajamento
- Criar senso de pertencimento e comunidade
- NUNCA substituir profissionais de saúde mental ou física

SEU TOM:
- Empático, caloroso, genuíno
- Linguagem coloquial brasileira (PT-BR)
- Como uma amiga próxima e confiável
- Sem julgamentos, sempre acolhedora

RESTRIÇÕES CRÍTICAS:
- NUNCA sugerir medicamentos, remédios ou tratamentos
- NUNCA fazer diagnósticos médicos ou psicológicos
- NUNCA avaliar sintomas físicos ou mentais
- NUNCA recomendar procedimentos médicos
- SEMPRE orientar a buscar ajuda profissional para questões médicas

Para questões médicas, responda:
"Entendo sua preocupação, e é válida! 💕 Infelizmente, não posso ajudar com questões médicas ou diagnósticos. Para isso, é fundamental consultar um médico, psicólogo ou profissional de saúde qualificado. O que posso fazer é te escutar e acolher emocionalmente. Você gostaria de compartilhar como está se sentindo?"

Para emergências (sangramento, dor forte, desmaios):
"🚨 Procure ajuda médica IMEDIATAMENTE. Ligue para o SAMU: 192 ou CVV: 188"

Use emojis moderadamente para humanizar a conversa.
Seja prática e ofereça soluções rápidas de acolhimento emocional.
Mantenha respostas concisas e empáticas (máximo 300 palavras).`;

// =====================================================
// RATE LIMITING
// =====================================================
// Rate limiting agora usa modelo event-based do banco
// Ver: supabase/functions/_shared/rateLimiter.ts

// =====================================================
// SUPABASE AUTH CHECK
// =====================================================

async function verifyAuth(req: Request, supabase: any): Promise<{ userId: string | null; error?: string }> {
  const authHeader = req.headers.get('Authorization');

  if (!authHeader) {
    return { userId: null, error: 'Authorization header missing' };
  }

  const token = authHeader.replace('Bearer ', '');

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { userId: null, error: 'Invalid authentication token' };
  }

  return { userId: user.id };
}

// =====================================================
// BUSCAR CONTEXTO (Últimas 20 mensagens + Perfil)
// =====================================================

async function getContext(userId: string, supabase: any) {
  // Buscar perfil do usuário
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('name, type, pregnancy_week, baby_name, preferences, onboarding_data')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
  }

  // Buscar últimas 20 mensagens
  const { data: messages, error: messagesError } = await supabase
    .from('chat_messages')
    .select('message, response, role, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (messagesError) {
    console.error('Error fetching messages:', messagesError);
  }

  // Formatar contexto
  const context = {
    profile: profile || {},
    messages: (messages || []).reverse(), // Inverter para ordem cronológica
  };

  return context;
}

// =====================================================
// FORMATAR PROMPT COM CONTEXTO
// =====================================================

function formatPromptWithContext(message: string, context: any): string {
  const { profile, messages } = context;

  // Informações do perfil
  const profileInfo = profile.type
    ? `Perfil: ${profile.name || 'Usuária'} - ${profile.type}${profile.pregnancy_week ? ` (${profile.pregnancy_week} semanas)` : ''}${profile.baby_name ? ` - Bebê: ${profile.baby_name}` : ''}`
    : 'Perfil: Em configuração';

  // Histórico de mensagens (formato conversacional)
  let historyText = '';
  if (messages && messages.length > 0) {
    historyText = '\n\nHISTÓRICO DE CONVERSA:\n';
    messages.forEach((msg: any) => {
      if (msg.role === 'user') {
        historyText += `Usuária: ${msg.message}\n`;
      } else {
        historyText += `NathIA: ${msg.response}\n`;
      }
    });
  }

  // Construir prompt completo
  const fullPrompt = `${SYSTEM_PROMPT}

CONTEXTO DA USUÁRIA:
${profileInfo}
${historyText}

NOVA MENSAGEM DA USUÁRIA:
${message}

Responda com acolhimento emocional, empatia e apoio. Mantenha a resposta concisa (máximo 300 palavras).`;

  return fullPrompt;
}

// =====================================================
// CHAMAR GEMINI 2.0 FLASH
// =====================================================

async function callGeminiFlash(prompt: string): Promise<string> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY not configured. Configure no Supabase Dashboard > Edge Functions > Secrets');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_LOW_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_LOW_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();

  // Extrair texto da resposta
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('No response text from Gemini API');
  }

  return text;
}

// =====================================================
// SALVAR MENSAGEM E RESPOSTA NO SUPABASE
// =====================================================

async function saveMessage(userId: string, message: string, response: string, supabase: any): Promise<void> {
  // Salvar uma única mensagem com user message e assistant response
  const { error } = await supabase.from('chat_messages').insert({
    user_id: userId,
    message: message,
    response: response,
    role: 'user',
    context_data: {},
    is_urgent: false,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error saving message:', error);
    // Não falhar a requisição se houver erro ao salvar
  }
}

// =====================================================
// EDGE FUNCTION HANDLER
// =====================================================

serve(async (req: Request) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Inicializar Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables not configured');
    }

    // Criar cliente Supabase com ANON_KEY (não SERVICE_ROLE)
    // Isso garante que RLS está ativo e não bypassa segurança
    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    });

    // Verificar autenticação
    const authResult = await verifyAuth(req, supabase);

    if (!authResult.userId) {
      return new Response(JSON.stringify({ error: authResult.error || 'Authentication failed' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = authResult.userId;

    // Verificar rate limit (event-based do banco)
    const rateCheck = await checkRateLimit(userId, 'nathia-chat', authHeader);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Você fez muitas requisições. Aguarde um momento e tente novamente.',
          remaining: rateCheck.remaining,
          resetAt: rateCheck.resetAt.toISOString(),
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': rateCheck.remaining.toString(),
            'X-RateLimit-Reset': rateCheck.resetAt.toISOString(),
          },
        }
      );
    }

    // Extrair mensagem do body
    const { message } = await req.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Message is required and must be a non-empty string' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Buscar contexto (perfil + últimas 20 mensagens)
    const context = await getContext(userId, supabase);

    // Formatar prompt com contexto
    const fullPrompt = formatPromptWithContext(message, context);

    // Chamar Gemini 2.0 Flash
    const aiResponse = await callGeminiFlash(fullPrompt);

    // Salvar mensagem e resposta no Supabase
    await saveMessage(userId, message, aiResponse, supabase);

    // Retornar resposta
    return new Response(
      JSON.stringify({
        response: aiResponse,
        rateLimit: {
          remaining: rateCheck.remaining,
          resetAt: rateCheck.resetAt.toISOString(),
        },
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': rateCheck.remaining.toString(),
          'X-RateLimit-Reset': rateCheck.resetAt.toISOString(),
        },
      }
    );
  } catch (error: any) {
    console.error('Error in nathia-chat function:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message || 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
