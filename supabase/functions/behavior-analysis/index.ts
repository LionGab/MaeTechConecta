// Behavior Analysis - Edge Function
// Análise comportamental diária com Gemini 2.0 Flash

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface BehaviorAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  predominantEmotions: string[];
  topicsOfInterest: string[];
  riskLevel: number; // 0-10
  suggestions: string[];
  summary: string;
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

    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar últimas 30 mensagens do usuário
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('message, response, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (messagesError) throw messagesError;

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No conversation history found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Buscar perfil do usuário
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('type, pregnancy_week')
      .eq('id', userId)
      .single();

    // Preparar histórico para análise
    const conversationHistory = messages
      .reverse()
      .map((m) => `User: ${m.message}\nNathIA: ${m.response}`)
      .join('\n\n');

    // Análise com Gemini
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const analysisPrompt = `Analise o histórico de 30 dias desta usuária de maternidade.

Contexto: ${profile?.type || 'gestante/mãe'}, ${profile?.pregnancy_week || 'N/A'} semanas

Responda APENAS JSON:
{
  "sentiment": "positive|neutral|negative|mixed",
  "predominantEmotions": ["string array"],
  "topicsOfInterest": ["string array"],
  "riskLevel": 0-10,
  "suggestions": ["string array com sugestões"],
  "summary": "resumo em 2-3 frases"
}

Histórico:
${conversationHistory}`;

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
      throw new Error('Failed to parse analysis');
    }

    const analysis: BehaviorAnalysis = JSON.parse(jsonMatch[0]);

    // Atualizar behavior_analysis no perfil
    await supabase
      .from('user_profiles')
      .update({
        behavior_analysis: analysis,
        risk_level: analysis.riskLevel,
      })
      .eq('id', userId);

    return new Response(JSON.stringify(analysis), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

