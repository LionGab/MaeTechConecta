/**
 * NAT-AI Chat - Edge Function completa
 *
 * Sistema completo de chat com:
 * - Context Manager (3 camadas de contexto)
 * - Guardrails (proteção contra conselhos médicos)
 * - Risk Analyzer (análise paralela de risco)
 * - Gemini 2.5 Pro (acolhimento emocional)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { checkRateLimit } from '../_shared/rateLimiter.ts';

// =====================================================
// SYSTEM PROMPT - Importado do sistema de prompts
// =====================================================

const SYSTEM_PROMPT = `Você é a NAT-AI, uma assistente virtual de acolhimento emocional criada pela influenciadora brasileira Natália Valente para apoiar mães, gestantes e tentantes.

SUA IDENTIDADE:
Você é uma companheira empática, calorosa e acolhedora. Sua personalidade combina calor humano, empatia profunda e presença genuína.

SEU PROPÓSITO:
Seu único propósito é oferecer ACOLHIMENTO EMOCIONAL para mães. Você valida sentimentos, escuta ativamente, acolhe desabafos e oferece palavras de apoio.

Você NUNCA:
- Dá conselhos médicos
- Sugere medicamentos ou tratamentos
- Faz diagnósticos de qualquer tipo
- Prescreve dietas ou exercícios específicos
- Substitui consultas médicas ou profissionais de saúde

COMO RESPONDER:
1. Acolhimento Inicial (1-2 frases)
2. Validação (2-3 frases)
3. Escuta Ativa (1-2 frases)
4. Apoio (2-3 frases)

TOM DE VOZ:
Português brasileiro informal, caloroso, empático, genuíno e respeitoso.

Use emojis moderadamente para humanizar a conversa (💝 🤗 💕 💪 🌸).

Mantenha respostas concisas e empáticas (máximo 300 palavras).`;

// =====================================================
// GUARDRAILS - Proteção contra conselhos médicos
// =====================================================

const FORBIDDEN_TOPICS = [
  'remedio',
  'remédio',
  'medicamento',
  'medicação',
  'comprimido',
  'pílula',
  'diagnostico',
  'diagnóstico',
  'doença',
  'doenca',
  'exame',
  'teste',
  'tratamento',
  'tomar',
  'usar',
  'aplicar',
  'receita',
  'prescrição',
];

function containsForbiddenTopic(message: string): boolean {
  const lowerMessage = message
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return FORBIDDEN_TOPICS.some((topic) => lowerMessage.includes(topic.toLowerCase()));
}

const BLOCKED_RESPONSE = `Oi querida! Entendo sua preocupação ou curiosidade, mas preciso ser honesta: não sou médica e não posso te ajudar com questões de saúde, medicamentos ou diagnósticos.

Para qualquer dúvida sobre sintomas, medicamentos, tratamentos ou sua saúde, é essencial você conversar com seu médico ou buscar atendimento profissional. Eles têm a formação e experiência necessárias para te orientar adequadamente.

O que posso fazer é te acolher emocionalmente enquanto você busca esse apoio. Como você está se sentindo com essa situação? 🤗`;

// =====================================================
// RISK ANALYZER - Análise de risco com Claude
// =====================================================

interface RiskAnalysis {
  level: number;
  flags: string[];
  requires_intervention: boolean;
  suggested_resources: string[];
  reasoning: string;
}

async function analyzeRisk(message: string): Promise<RiskAnalysis> {
  const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');

  if (!claudeApiKey) {
    // Fallback para análise simples
    return fallbackRiskAnalysis(message);
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        temperature: 0.3,
        system: `Você é especialista em saúde mental materna. Analise e retorne JSON com:
{
  "level": 0-10,
  "flags": ["suicidal_ideation", "harm_to_baby", "psychosis", etc],
  "requires_intervention": boolean,
  "suggested_resources": ["cvv", "caps", "emergency"],
  "reasoning": "explicação"
}`,
        messages: [
          {
            role: 'user',
            content: `Analise: "${message}"`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return fallbackRiskAnalysis(message);
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Extrair JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis: RiskAnalysis = JSON.parse(jsonMatch[0]);
      analysis.level = Math.max(0, Math.min(10, analysis.level));
      if (analysis.level >= 9) analysis.requires_intervention = true;
      return analysis;
    }
  } catch (error) {
    console.error('Erro ao analisar risco:', error);
  }

  return fallbackRiskAnalysis(message);
}

function fallbackRiskAnalysis(message: string): RiskAnalysis {
  const lowerMessage = message
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  let level = 0;
  const flags: string[] = [];
  const resources: string[] = [];

  if (lowerMessage.includes('suicidio') || lowerMessage.includes('quero morrer') || lowerMessage.includes('me matar')) {
    level = 10;
    flags.push('suicidal_ideation');
    resources.push('cvv', 'emergency');
  } else if (lowerMessage.includes('machucar o bebe') || lowerMessage.includes('fazer mal ao bebe')) {
    level = 10;
    flags.push('harm_to_baby');
    resources.push('emergency', 'caps');
  } else if (lowerMessage.includes('ouvir vozes') || lowerMessage.includes('ver coisas')) {
    level = 9;
    flags.push('psychosis');
    resources.push('emergency', 'caps');
  } else if (lowerMessage.includes('não consigo cuidar do bebe') || lowerMessage.includes('não saio da cama')) {
    level = 8;
    flags.push('severe_depression');
    resources.push('therapy', 'caps');
  } else if (lowerMessage.includes('não aguento mais')) {
    level = 5;
    flags.push('burnout');
  } else {
    level = 1;
    flags.push('normal_stress');
  }

  return {
    level,
    flags,
    requires_intervention: level >= 7,
    suggested_resources: resources,
    reasoning: `Análise baseada em padrões: nível ${level}`,
  };
}

function generateInterventionResponse(analysis: RiskAnalysis, userName: string): string {
  if (analysis.level >= 9) {
    return `Querida ${userName}, preciso ser direta com você agora. O que você compartilhou é muito sério, e você precisa de ajuda profissional urgente. Por favor:

🚨 **Se você estiver em perigo imediato**: Ligue para o SAMU - 192
💝 **Se você estiver pensando em se machucar**: Ligue para o CVV - 188 (disponível 24h, gratuito e anônimo)
🏥 **Procure um CAPS** (Centro de Atenção Psicossocial) mais próximo de você

Você não está sozinha. Há ajuda disponível, e você merece cuidado e apoio profissional agora. Não hesite em buscar ajuda. 💝`;
  }

  if (analysis.level >= 7) {
    return `Oi ${userName}! Obrigada por compartilhar isso comigo. Sinto muito que você esteja passando por um momento tão difícil.

O que você está enfrentando parece ser algo que requer atenção profissional. Por favor, considere:

💝 **CVV - 188** (24h, gratuito e anônimo) para apoio imediato
🏥 **CAPS** ou um psicólogo especializado em saúde mental materna

Você não está sozinha, e há ajuda disponível. Buscar apoio é um ato de coragem e cuidado com você mesma.

Estou aqui sempre que precisar. 🤗`;
  }

  return '';
}

// =====================================================
// CONTEXT MANAGER - Carregar contexto completo
// =====================================================

async function loadContext(userId: string, supabase: any) {
  // 1. Carregar perfil
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name, type, pregnancy_week, baby_name, preferences, onboarding_data')
    .eq('id', userId)
    .single();

  // 2. Carregar ou criar conversa
  let { data: conversation } = await supabase
    .from('conversation_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!conversation) {
    const { data: newConv } = await supabase
      .from('conversation_history')
      .insert({ user_id: userId, context_summary: '' })
      .select()
      .single();
    conversation = newConv;
  }

  // 3. Carregar mensagens recentes (contexto quente - últimas 30)
  const { data: messages } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30);

  const recentMessages = (messages || []).reverse();

  // 4. Resumo de histórico (se disponível)
  const historySummary = conversation?.context_summary || '';

  return {
    profile: profile || {},
    conversationId: conversation?.id,
    recentMessages,
    historySummary,
  };
}

function formatForGemini(message: string, context: any): string {
  const { profile, recentMessages, historySummary } = context;

  // Construir contexto da usuária
  let userContext = '';
  if (profile.full_name) userContext += `Nome: ${profile.full_name}\n`;
  if (profile.type) {
    const typeText = profile.type === 'gestante' ? 'Gestante' : profile.type === 'mae' ? 'Mãe' : 'Tentante';
    userContext += `Tipo: ${typeText}\n`;
    if (profile.pregnancy_week) userContext += `Semana de gravidez: ${profile.pregnancy_week}\n`;
    if (profile.baby_name) userContext += `Nome do bebê: ${profile.baby_name}\n`;
  }

  // Histórico recente
  let historyText = '';
  if (recentMessages && recentMessages.length > 0) {
    historyText = '\n\nCONVERSAS RECENTES:\n';
    recentMessages.forEach((msg: any) => {
      if (msg.role === 'user') {
        historyText += `Usuária: ${msg.message}\n`;
      } else if (msg.response) {
        historyText += `NAT-AI: ${msg.response}\n`;
      }
    });
  }

  // Resumo de histórico
  const summaryText = historySummary ? `\n\nRESUMO DE CONVERSAS ANTERIORES:\n${historySummary}\n` : '';

  return `${SYSTEM_PROMPT}

# CONTEXTO DA USUÁRIA
${userContext}
${summaryText}
${historyText}

# NOVA MENSAGEM DA USUÁRIA
${message}

Responda com acolhimento emocional, empatia e apoio. Mantenha a resposta concisa (máximo 300 palavras).`;
}

// =====================================================
// GEMINI API
// =====================================================

async function callGemini(prompt: string): Promise<string> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY não configurada');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 800,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Resposta vazia do Gemini');
  }

  return text.trim();
}

// =====================================================
// SALVAR MENSAGEM
// =====================================================

async function saveMessage(
  userId: string,
  conversationId: string,
  message: string,
  response: string,
  riskLevel: number,
  riskFlags: string[],
  supabase: any
) {
  await supabase.from('chat_messages').insert({
    user_id: userId,
    conversation_id: conversationId,
    message: message,
    response: response,
    role: 'user',
    risk_level: riskLevel,
    risk_flags: riskFlags,
    created_at: new Date().toISOString(),
  });
}

// =====================================================
// NOTIFICAR EQUIPE
// =====================================================

async function notifyTeam(userId: string, messageId: string, analysis: RiskAnalysis, supabase: any) {
  // Salvar alerta
  await supabase.from('alert_logs').insert({
    user_id: userId,
    message_id: messageId,
    risk_level: analysis.level,
    risk_flags: analysis.flags,
    notified_at: new Date().toISOString(),
  });

  // Aqui você pode adicionar webhook para Slack/Discord
  console.log(
    `🚨 ALERTA DE ALTO RISCO - User: ${userId}, Level: ${analysis.level}, Flags: ${analysis.flags.join(', ')}`
  );
}

// =====================================================
// RATE LIMITING
// =====================================================
// Rate limiting agora usa modelo event-based do banco
// Ver: supabase/functions/_shared/rateLimiter.ts

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
    // Inicializar Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase não configurado');
    }

    // Criar cliente Supabase com ANON_KEY + Authorization header
    // Isso garante que RLS está ativo e não bypassa segurança
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = user.id;

    // Verificar rate limit (event-based do banco)
    const rateCheck = await checkRateLimit(userId, 'nat-ai-chat', authHeader);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Muitas mensagens. Aguarde um momento.',
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

    // Extrair mensagem
    const { message, context } = await req.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Message required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Verificar guardrails (tópicos proibidos)
    if (containsForbiddenTopic(message)) {
      return new Response(JSON.stringify({ response: BLOCKED_RESPONSE }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Iniciar análise de risco em paralelo (não bloqueia)
    const riskAnalysisPromise = analyzeRisk(message);

    // 3. Carregar contexto
    const contextData = await loadContext(userId, supabase);

    // 4. Formatar prompt para Gemini
    const fullPrompt = formatForGemini(message, contextData);

    // 5. Chamar Gemini
    const aiResponse = await callGemini(fullPrompt);

    // 6. Aguardar análise de risco
    const riskAnalysis = await riskAnalysisPromise;

    // 7. Adicionar intervenção se necessário
    let finalResponse = aiResponse;
    if (riskAnalysis.requires_intervention) {
      const intervention = generateInterventionResponse(riskAnalysis, contextData.profile.full_name || 'querida');
      if (intervention) {
        finalResponse = `${aiResponse}\n\n---\n\n${intervention}`;
      }
    }

    // 8. Salvar mensagem com análise de risco
    const { data: savedMessage } = await supabase
      .from('chat_messages')
      .insert({
        user_id: userId,
        conversation_id: contextData.conversationId,
        message: message,
        response: finalResponse,
        role: 'user',
        risk_level: riskAnalysis.level,
        risk_flags: riskAnalysis.flags,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    // 9. Notificar equipe se alto risco
    if (riskAnalysis.level >= 8 && savedMessage) {
      notifyTeam(userId, savedMessage.id, riskAnalysis, supabase).catch((err) =>
        console.error('Erro ao notificar equipe:', err)
      );
    }

    // 10. Retornar resposta
    return new Response(
      JSON.stringify({
        response: finalResponse,
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
    console.error('Erro na Edge Function:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

