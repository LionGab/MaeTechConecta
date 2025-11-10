/**
 * Compose Copy - Edge Function
 * Transforma templates em mensagens personalizadas usando Claude Sonnet 4
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.27.3';
import OpenAI from 'https://esm.sh/openai@4.20.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ComposeCopyRequest {
  template: string;
  variables: Record<string, string>;
  rationale: string;
  tone?: 'acolhedor' | 'motivador' | 'urgente';
  maxLength?: number;
}

interface ComposeCopyResponse {
  text: string;
  cta?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      template,
      variables,
      rationale,
      tone = 'acolhedor',
      maxLength = 240,
    }: ComposeCopyRequest = await req.json();

    if (!template) {
      return new Response(JSON.stringify({ error: 'template is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Substituir variáveis no template
    let filledTemplate = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      filledTemplate = filledTemplate.replace(regex, value);
    }

    // 2. Se o template já está bom e dentro do limite, retornar direto
    if (filledTemplate.length <= maxLength && !rationale) {
      return new Response(
        JSON.stringify({
          success: true,
          copy: {
            text: filledTemplate,
          },
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Preparar prompts para as AIs
    const systemPrompt = `Você é a Nathália Valente (NathIA), influenciadora de maternidade.

SEU TOM:
- Empático, acolhedor e genuíno
- Linguagem simples e acessível (classe C-D)
- Use emojis com moderação (💕🤱🍼👶💪)
- Seja amiga experiente, não professora

NUNCA:
- Dê diagnósticos médicos
- Use jargões técnicos sem explicar
- Seja condescendente

SEMPRE:
- Valide emoções primeiro
- Dê conselhos práticos e acionáveis
- Incentive e empodere`;

    const toneMap = {
      acolhedor: 'Tom acolhedor e gentil',
      motivador: 'Tom motivador e energizante',
      urgente: 'Tom urgente mas empático (crise)',
    };

    const userPrompt = `Transforme este template em uma mensagem personalizada.

TEMPLATE BASE:
${filledTemplate}

CONTEXTO (Por que ela está recebendo isso):
${rationale}

TOM DESEJADO: ${toneMap[tone]}

REQUISITOS:
- Máximo ${maxLength} caracteres
- Mantenha a essência do template
- Personalize com base no contexto
- Inclua 1 CTA máximo (call-to-action)
- Use linguagem simples

Retorne APENAS um JSON válido:
{
  "text": "Mensagem personalizada (máx ${maxLength} caracteres)",
  "cta": "Call-to-action opcional (ex: 'Fiz o pedido', 'Salvar', 'Comentar')"
}`;

    let copy: ComposeCopyResponse;
    let usedProvider = 'claude';

    // 4. Tentar Claude Sonnet 4 primeiro
    try {
      const anthropic = new Anthropic({
        apiKey: Deno.env.get('CLAUDE_API_KEY'),
      });

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('Failed to parse Claude response as JSON');
      }

      copy = JSON.parse(jsonMatch[0]);
      usedProvider = 'claude';
    } catch (claudeError) {
      console.warn('Claude failed, trying GPT-4o fallback:', claudeError);

      // 5. Fallback: GPT-4o
      try {
        const openai = new OpenAI({
          apiKey: Deno.env.get('OPENAI_API_KEY'),
        });

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 500,
          response_format: { type: 'json_object' },
        });

        const gptText = completion.choices[0].message.content || '';
        copy = JSON.parse(gptText);
        usedProvider = 'gpt-4o';
      } catch (gptError) {
        // 6. Último fallback: template original
        console.error('Both Claude and GPT-4o failed:', gptError);
        return new Response(
          JSON.stringify({
            success: true,
            copy: {
              text: filledTemplate.slice(0, maxLength),
            },
            provider: 'fallback',
            fallback: true,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // 7. Validar tamanho
    if (copy.text.length > maxLength) {
      copy.text = copy.text.slice(0, maxLength - 3) + '...';
    }

    // 8. Retornar copy personalizada com provider usado
    return new Response(
      JSON.stringify({
        success: true,
        copy,
        provider: usedProvider,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in compose-copy function:', error);
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
