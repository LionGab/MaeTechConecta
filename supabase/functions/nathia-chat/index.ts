// NathIA Chat - Edge Function com Gemini 2.0 Flash
// Sistema de chat conversacional com memória, moderação e RAG

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SYSTEM_PROMPT = `Você é a NathIA, assistente virtual inspirada em Nathália Valente, especialista em maternidade e cuidados com gestantes.

INSTRUÇÕES CRÍTICAS:
- Use PT-BR informal e empático (como uma amiga próxima)
- NUNCA faça diagnósticos ou prescrições médicas
- SEMPRE inclua disclaimer: "💡 Lembre-se: cada gestação é única. Consulte sempre seu médico para dúvidas importantes."
- Para emergências (sangramento, dor forte, desmaios): "🚨 Procure ajuda médica IMEDIATAMENTE. Ligue para o SAMU: 192 ou CVV: 188"
- Use emojis moderadamente para humanizar a conversa
- Seja prática e ofereça soluções rápidas
- Valide com base de dados médicos (OMS, SBP, SUS)
- Temperatura: 0.3 para segurança máxima (evitar alucinações)
- Seja empática, mas profissional`;

interface RateLimiter {
  requests: Map<string, { count: number; resetTime: number }>;
}

const rateLimiter: RateLimiter = {
  requests: new Map(),
};

function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowMs = 60000; // 1 minuto
  const maxRequests = 100;

  const userData = rateLimiter.requests.get(userId);

  if (!userData || now > userData.resetTime) {
    rateLimiter.requests.set(userId, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (userData.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  userData.count++;
  return { allowed: true, remaining: maxRequests - userData.count };
}

async function moderateMessage(message: string): Promise<{ safe: boolean; action: string; reason?: string }> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    console.error('GEMINI_API_KEY not configured');
    return { safe: true, action: 'allow' }; // Fail open
  }

  try {
    const moderationResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analise esta mensagem para moderação. Responda APENAS JSON:
{
  "safe": boolean,
  "category": string,
  "severity": 1-5,
  "action": "allow" | "block" | "flag",
  "reason": string
}

Mensagem: ${message}`
            }]
          }],
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 200,
          }
        })
      }
    );

    const data = await moderationResponse.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const result = JSON.parse(text);

    return {
      safe: result.safe,
      action: result.action || 'allow',
      reason: result.reason
    };
  } catch (error) {
    console.error('Moderation error:', error);
    return { safe: true, action: 'allow' }; // Fail open
  }
}

async function getConversationMemory(userId: string, supabase: any) {
  const { data, error } = await supabase
    .from('conversation_memory')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching memory:', error);
    return null;
  }

  return data;
}

async function getChatHistory(userId: string, limit: number, supabase: any) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching history:', error);
    return [];
  }

  return data?.reverse() || [];
}

async function callGeminiFlash(message: string, context: any, history: any[]) {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const fullContext = context.type
    ? `Perfil: ${context.type}, Semana: ${context.pregnancy_week || 'N/A'}, Bebê: ${context.baby_name || 'Aguardando...'}`
    : 'Perfil em configuração';

  const systemPromptWithContext = SYSTEM_PROMPT + `\n\nCONTEXTO DO USUÁRIO: ${fullContext}`;

  const conversationHistory = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.role === 'user' ? msg.message : msg.response }]
  }));

  conversationHistory.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'model',
            parts: [{ text: systemPromptWithContext }]
          },
          ...conversationHistory
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        }
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Gemini API error: ${JSON.stringify(data)}`);
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      });
    }

    const { userId, message, context } = await req.json();

    if (!userId || !message) {
      return new Response(
        JSON.stringify({ error: 'userId and message are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit
    const rateCheck = checkRateLimit(userId);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded', remaining: 0 }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Moderate message
    const moderationResult = await moderateMessage(message);

    if (moderationResult.action === 'block') {
      // Save to moderation_queue
      await supabase.from('moderation_queue').insert({
        user_id: userId,
        message,
        category: 'blocked',
        severity: 5,
        reviewed: false
      });

      return new Response(
        JSON.stringify({
          response: 'Desculpa, não posso responder essa mensagem. Ela viola nossas diretrizes de uso.',
          moderated: true
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (moderationResult.action === 'flag') {
      await supabase.from('moderation_queue').insert({
        user_id: userId,
        message,
        category: 'flagged',
        severity: 3,
        reviewed: false
      });
      // Continue processing but flag
    }

    // Get conversation memory
    const memory = await getConversationMemory(userId, supabase);
    const history = await getChatHistory(userId, 30, supabase);

    // Call Gemini
    const aiResponse = await callGeminiFlash(message, context || {}, history);

    // Save message and response
    await supabase.from('chat_messages').insert({
      user_id: userId,
      message,
      response: aiResponse,
      context_data: { moderated: moderationResult.action !== 'allow' }
    });

    // Update or create memory
    if (memory) {
      await supabase
        .from('conversation_memory')
        .update({
          updated_at: new Date().toISOString(),
          last_30_messages: JSON.stringify(history.slice(-30))
        })
        .eq('id', memory.id);
    } else {
      await supabase.from('conversation_memory').insert({
        user_id: userId,
        last_30_messages: JSON.stringify(history.slice(-30)),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    return new Response(
      JSON.stringify({
        response: aiResponse,
        rateLimit: rateCheck
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
