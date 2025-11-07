/**
 * Build Signals - Edge Function
 * Analisa últimos 14 dias de eventos e cria snapshot de comportamento
 * Usa Gemini 2.0 Flash para análise semântica
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import OpenAI from 'https://esm.sh/openai@4.20.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BuildSignalsRequest {
  userId: string;
}

interface AnalysisResult {
  tags: string[];
  scores: {
    stress_score: number;
    sleep_quality: number;
    support_score: number;
    mood_average: number;
  };
  priority: string;
  risk_level: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId }: BuildSignalsRequest = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Buscar perfil do usuário
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('type, pregnancy_week, preferences, name')
      .eq('id', userId)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: 'User profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Buscar eventos dos últimos 14 dias
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentEvents } = await supabase
      .from('events')
      .select('kind, payload, created_at')
      .eq('user_id', userId)
      .gte('created_at', fourteenDaysAgo)
      .order('created_at', { ascending: false })
      .limit(200);

    // 3. Buscar últimas mensagens de chat para análise de linguagem
    const { data: recentMessages } = await supabase
      .from('chat_messages')
      .select('message, response, created_at')
      .eq('user_id', userId)
      .gte('created_at', fourteenDaysAgo)
      .order('created_at', { ascending: false })
      .limit(30);

    // 4. Preparar contexto para Gemini
    const eventSummary = recentEvents
      ?.map((e) => `${e.kind}: ${JSON.stringify(e.payload)}`)
      .join('\n');

    const chatSummary = recentMessages
      ?.map((m) => `User: ${m.message}\nNathIA: ${m.response}`)
      .join('\n\n');

    // 5. Preparar prompt de análise
    const analysisPrompt = `Analise o comportamento desta usuária de maternidade nos últimos 14 dias.

PERFIL:
- Nome: ${profile.name}
- Tipo: ${profile.type}
- Semana de gestação: ${profile.pregnancy_week || 'N/A'}

EVENTOS RECENTES (últimos 14 dias):
${eventSummary || 'Nenhum evento registrado'}

CONVERSAS RECENTES:
${chatSummary || 'Nenhuma conversa recente'}

ANÁLISE REQUERIDA (responda APENAS JSON válido):
{
  "tags": ["array de tags detectadas"],
  "scores": {
    "stress_score": 0-100,
    "sleep_quality": 0-100,
    "support_score": 0-100,
    "mood_average": 0-100
  },
  "priority": "alert|stress|support|belonging|habit",
  "risk_level": 0-10
}

TAGS POSSÍVEIS:
- tag_father_absent: pai ausente ou pouco envolvido
- tag_lonely: menções de solidão, isolamento
- tag_single_mom: mãe solo
- support_low: pouco apoio prático
- stress_high: stress elevado
- sleep_low: qualidade de sono ruim
- overwhelmed: sobrecarregada
- pp_intrusive: pensamentos intrusivos pós-parto
- harm_thoughts: pensamentos de auto-dano (ALERTA)
- isolation: isolamento social

PRIORIDADE:
- alert: se pp_intrusive ou harm_thoughts
- stress: se stress_score > 70
- support: se support_low ou tag_lonely
- belonging: se tag_lonely ou tag_single_mom
- habit: padrão (foco em hábitos)

SCORES (0-100):
- stress_score: baseado em palavras-chave de stress + frequência de chat urgente
- sleep_quality: baseado em menções de sono + humor matinal
- support_score: baseado em menções de rede de apoio
- mood_average: média de humor dos últimos 7 dias

RISK_LEVEL (0-10):
- 8-10: CRÍTICO (pp_intrusive, harm_thoughts)
- 5-7: ALTO (stress crítico, isolamento severo)
- 2-4: MÉDIO (stress moderado, sono ruim)
- 0-1: BAIXO (comportamento normal)`;

    let analysis: AnalysisResult;
    let usedProvider = 'gemini';

    // 6. Tentar Gemini 2.0 Flash primeiro
    try {
      const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
      if (!geminiApiKey) {
        throw new Error('GEMINI_API_KEY not configured');
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: analysisPrompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse Gemini analysis');
      }

      analysis = JSON.parse(jsonMatch[0]);
      usedProvider = 'gemini';
    } catch (geminiError) {
      console.warn('Gemini failed, trying GPT-4o fallback:', geminiError);

      // 7. Fallback: GPT-4o
      const openai = new OpenAI({
        apiKey: Deno.env.get('OPENAI_API_KEY'),
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1024,
        response_format: { type: 'json_object' }
      });

      const gptText = completion.choices[0].message.content || '';
      analysis = JSON.parse(gptText);
      usedProvider = 'gpt-4o';
    }

    // 8. Salvar signal no banco com provider usado
    const { data: signal, error: signalError } = await supabase
      .from('signals')
      .insert({
        user_id: userId,
        tags: analysis.tags,
        scores: analysis.scores,
        source: usedProvider === 'gemini' ? 'gemini_2.0_flash' : 'gpt-4o_fallback',
      })
      .select()
      .single();

    if (signalError) {
      console.error('Error saving signal:', signalError);
      throw signalError;
    }

    // 7. Atualizar user_profile com risk_level
    await supabase
      .from('user_profiles')
      .update({
        risk_level: analysis.risk_level,
        last_signal_update: new Date().toISOString(),
      })
      .eq('id', userId);

    // 8. Se risco crítico, criar alert_history
    if (analysis.risk_level >= 8) {
      const criticalTags = analysis.tags.filter((tag) =>
        ['pp_intrusive', 'harm_thoughts'].includes(tag)
      );

      if (criticalTags.length > 0) {
        await supabase.from('alert_history').insert({
          user_id: userId,
          alert_type: criticalTags[0] as any,
          severity: analysis.risk_level,
          trigger_reason: `Tags detectadas: ${criticalTags.join(', ')}`,
          resolved: false,
        });
      }
    }

    // 9. Retornar análise
    return new Response(
      JSON.stringify({
        success: true,
        signal: {
          id: signal.id,
          tags: analysis.tags,
          scores: analysis.scores,
          priority: analysis.priority,
          risk_level: analysis.risk_level,
          created_at: signal.created_at,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in build-signals function:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

