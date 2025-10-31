// Moderation Service - Edge Function
// 3 camadas de moderação: Safety Settings + Gemini + Flag Queue

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface ModerationResult {
  safe: boolean;
  category: string;
  severity: number;
  action: 'allow' | 'block' | 'flag';
  reason?: string;
}

// Camada 1: Gemini Safety Settings (instantâneo)
async function checkSafetySettings(message: string): Promise<ModerationResult> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    return { safe: true, category: 'unknown', severity: 0, action: 'allow' };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 100,
          }
        })
      }
    );

    if (!response.ok) {
      // Se bloqueou por safety, significa conteúdo inapropriado
      const blocked = response.status === 400;
      return {
        safe: !blocked,
        category: blocked ? 'safety_block' : 'unknown',
        severity: blocked ? 4 : 0,
        action: blocked ? 'block' : 'allow'
      };
    }

    return { safe: true, category: 'safe', severity: 0, action: 'allow' };
  } catch (error) {
    console.error('Safety check error:', error);
    return { safe: true, category: 'unknown', severity: 0, action: 'allow' };
  }
}

// Camada 2: Gemini análise contextual
async function analyzeContext(message: string): Promise<ModerationResult> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    return { safe: true, category: 'unknown', severity: 0, action: 'allow' };
  }

  try {
    const response = await fetch(
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
  "category": "spam|harassment|hate_speech|sexual|medical_advice|other",
  "severity": 1-5,
  "action": "allow" | "block" | "flag",
  "reason": "string curta"
}

Mensagem: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 200,
          }
        })
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse JSON da resposta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { safe: true, category: 'unknown', severity: 0, action: 'allow' };
  } catch (error) {
    console.error('Context analysis error:', error);
    return { safe: true, category: 'unknown', severity: 0, action: 'allow' };
  }
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

    const { message, userId } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Camada 1: Safety Settings (instantâneo)
    const safetyResult = await checkSafetySettings(message);

    if (safetyResult.action === 'block') {
      return new Response(
        JSON.stringify({
          ...safetyResult,
          layer: 'safety_settings'
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    // Camada 2: Análise contextual
    const contextResult = await analyzeContext(message);

    const finalResult = contextResult;

    // Se flag, adicionar à queue para revisão humana
    if (finalResult.action === 'flag' && userId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from('moderation_queue').insert({
        user_id: userId,
        message,
        category: finalResult.category,
        severity: finalResult.severity,
        reviewed: false,
        action: 'flagged'
      });
    }

    return new Response(
      JSON.stringify({
        ...finalResult,
        layer: 'contextual_analysis'
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
