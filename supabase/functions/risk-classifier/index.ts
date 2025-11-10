// Risk Classifier - Edge Function
// Classificação paralela de risco médico e psicológico

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface RiskClassification {
  medicalRisk: number; // 0-10
  psychologicalRisk: number; // 0-10
  urgencyKeywords: string[];
  recommendedAction: 'none' | 'consult_doctor' | 'call_samu' | 'call_cvv';
  confidence: number; // 0-1
}

const MEDICAL_URGENCY_KEYWORDS = [
  'sangrando',
  'sangramento',
  'sangue',
  'dor forte',
  'muita dor',
  'dor insuportável',
  'dor intensa',
  'desmaio',
  'desmaiei',
  'tontura extrema',
  'febre alta',
  'febre acima de 38',
  'convulsão',
  'contrações antes da hora',
  'não sinto o bebê mexer',
  'bebê parou de mexer',
  'água rompeu',
  'bolsa rompida',
  'pressão alta',
  'visão embaçada',
  'vendo pontinhos',
];

const PSYCHOLOGICAL_KEYWORDS = [
  'não vejo sentido',
  'não quero mais viver',
  'quero morrer',
  'pensar em me machucar',
  'pensamentos suicidas',
  'muito desesperada',
  'sem esperança',
  'chorando sem parar',
  'não consigo parar de chorar',
  'medo excessivo',
  'pânico',
  'não consigo comer',
  'perdi completamente o apetite',
  'insônia total',
];

async function classifyRisk(message: string): Promise<RiskClassification> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    // Fallback para keyword detection
    return classifyRiskByKeywords(message);
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analise esta mensagem de gestante/mãe para risco médico e psicológico. Responda APENAS JSON:
{
  "medicalRisk": 0-10,
  "psychologicalRisk": 0-10,
  "urgencyKeywords": ["string array"],
  "recommendedAction": "none|consult_doctor|call_samu|call_cvv",
  "confidence": 0-1
}

Mensagem: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return classifyRiskByKeywords(message);
  } catch (error) {
    console.error('Risk classification error:', error);
    return classifyRiskByKeywords(message);
  }
}

function classifyRiskByKeywords(message: string): RiskClassification {
  const lowerMessage = message.toLowerCase();

  const foundMedicalKeywords = MEDICAL_URGENCY_KEYWORDS.filter((kw) => lowerMessage.includes(kw));
  const foundPsychKeywords = PSYCHOLOGICAL_KEYWORDS.filter((kw) => lowerMessage.includes(kw));

  const medicalRisk = foundMedicalKeywords.length > 0 ? Math.min(10, foundMedicalKeywords.length * 3) : 0;
  const psychologicalRisk = foundPsychKeywords.length > 0 ? Math.min(10, foundPsychKeywords.length * 3) : 0;

  let recommendedAction: 'none' | 'consult_doctor' | 'call_samu' | 'call_cvv' = 'none';

  if (medicalRisk >= 7 || foundMedicalKeywords.length >= 2) {
    recommendedAction = 'call_samu';
  } else if (medicalRisk >= 4) {
    recommendedAction = 'consult_doctor';
  } else if (psychologicalRisk >= 7) {
    recommendedAction = 'call_cvv';
  }

  return {
    medicalRisk,
    psychologicalRisk,
    urgencyKeywords: [...foundMedicalKeywords, ...foundPsychKeywords],
    recommendedAction,
    confidence: 0.7, // Lower confidence for keyword-based
  };
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
      return new Response(JSON.stringify({ error: 'message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const classification = await classifyRisk(message);

    // Se risco alto, criar alerta
    if ((classification.medicalRisk >= 7 || classification.psychologicalRisk >= 7) && userId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const riskType = classification.medicalRisk >= classification.psychologicalRisk ? 'medical' : 'psychological';

      await supabase.from('risk_alerts').insert({
        user_id: userId,
        risk_type: riskType,
        severity: Math.max(classification.medicalRisk, classification.psychologicalRisk),
        message_context: message,
        action_taken: classification.recommendedAction,
        resolved: false,
      });
    }

    return new Response(JSON.stringify(classification), {
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
