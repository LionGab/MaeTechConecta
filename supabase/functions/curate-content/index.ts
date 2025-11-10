/**
 * Curate Content Edge Function
 * Curadoria diária automática usando Perplexity AI + Claude
 * Para a seção MãeValente
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.27.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Tópicos rotativos para curadoria diária
const DAILY_TOPICS = [
  'Desenvolvimento infantil 0-12 meses', // Domingo
  'Amamentação: últimas descobertas', // Segunda
  'Saúde mental materna', // Terça
  'Dicas de sono para bebês', // Quarta
  'Introdução alimentar BLW', // Quinta
  'Exercícios pós-parto', // Sexta
  'Vínculo mãe-bebê', // Sábado
];

interface PerplexityResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
  source?: string;
}

interface CuratedContent {
  title: string;
  summary: string;
  source_url: string;
  source_name: string;
  category: 'maternidade' | 'gestacao' | 'puerperio' | 'forca-feminina';
  tags: string[];
  relevance_score: number;
  read_time: number;
  thumbnail?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determinar tópico do dia (baseado no dia da semana)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Segunda, ...
    const topic = DAILY_TOPICS[dayOfWeek];

    console.log(`[Curate Content] Tópico do dia: ${topic}`);

    // 1. Buscar conteúdo com Perplexity AI
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');

    if (!perplexityApiKey) {
      console.warn('[Curate Content] PERPLEXITY_API_KEY não configurada, usando mock data');

      // Fallback: criar conteúdo curado sem Perplexity
      const mockContent = await generateMockCuratedContent(topic);
      const savedContent = await saveCuratedContent(supabase, mockContent);

      return new Response(
        JSON.stringify({
          success: true,
          topic,
          content: savedContent,
          source: 'mock',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Buscar no Perplexity
    const perplexityResults = await searchPerplexity(perplexityApiKey, topic);

    // 2. Enriquecer com Claude AI
    const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');
    const enrichedContent = await enrichWithClaude(claudeApiKey!, perplexityResults, topic);

    // 3. Salvar no banco
    const savedContent = await saveCuratedContent(supabase, enrichedContent);

    // 4. Retornar resultado
    return new Response(
      JSON.stringify({
        success: true,
        topic,
        content: savedContent,
        source: 'perplexity + claude',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[Curate Content] Error:', error);
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

/**
 * Busca conteúdo no Perplexity AI
 */
async function searchPerplexity(apiKey: string, query: string): Promise<PerplexityResult[]> {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'user',
            content: `Busque os 5 melhores artigos RECENTES sobre: ${query}

Critérios de seleção:
- Fontes confiáveis (médicos, instituições, estudos científicos)
- Publicado nos últimos 30 dias
- Relevante para mães brasileiras
- Informação prática e acionável
- Em português ou inglês (com fontes internacionais respeitáveis)

Para cada artigo, retorne:
1. Título completo
2. URL da fonte
3. Resumo de 2-3 frases
4. Data de publicação (se disponível)
5. Nome da fonte/instituição

Formate como JSON array:
[
  {
    "title": "...",
    "url": "...",
    "snippet": "...",
    "publishedDate": "YYYY-MM-DD",
    "source": "..."
  }
]`,
          },
        ],
        temperature: 0.2,
        search_recency_filter: 'month',
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '[]';

    // Extrair JSON da resposta
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Perplexity response as JSON');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('[Perplexity] Error:', error);
    throw error;
  }
}

/**
 * Enriquece os resultados do Perplexity com Claude AI
 */
async function enrichWithClaude(
  apiKey: string,
  perplexityResults: PerplexityResult[],
  topic: string
): Promise<CuratedContent[]> {
  const anthropic = new Anthropic({ apiKey });

  const enrichedContent: CuratedContent[] = [];

  for (const result of perplexityResults.slice(0, 3)) {
    // Limitar a 3 artigos por dia
    try {
      const prompt = `Você é uma curadora especializada em maternidade.

ARTIGO ENCONTRADO:
Título: ${result.title}
URL: ${result.url}
Fonte: ${result.source || 'Desconhecida'}
Snippet: ${result.snippet}

TAREFA:
Crie um resumo rico e informativo deste artigo para mães brasileiras.

REQUISITOS:
1. Mantenha o título original ou melhore-o (máx 80 caracteres)
2. Escreva um resumo de 100-150 palavras que:
   - Seja envolvente e fácil de ler
   - Destaque os pontos-chave práticos
   - Mencione por que é relevante
   - Use linguagem acessível
3. Classifique em uma categoria: maternidade, gestacao, puerperio, forca-feminina
4. Adicione 3-5 tags relevantes
5. Dê um relevance_score (0-100) baseado em:
   - Qualidade da fonte
   - Praticidade da informação
   - Relevância para mães brasileiras
6. Estime read_time (tempo de leitura em minutos)

Retorne APENAS um JSON válido:
{
  "title": "...",
  "summary": "...",
  "category": "...",
  "tags": ["...", "..."],
  "relevance_score": 0-100,
  "read_time": 0-15
}`;

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const enriched = JSON.parse(jsonMatch[0]);

        enrichedContent.push({
          title: enriched.title,
          summary: enriched.summary,
          source_url: result.url,
          source_name: result.source || 'Fonte externa',
          category: enriched.category,
          tags: enriched.tags,
          relevance_score: enriched.relevance_score,
          read_time: enriched.read_time,
        });
      }
    } catch (error) {
      console.error('[Claude] Error enriching result:', error);
      // Continuar com os próximos
    }
  }

  return enrichedContent;
}

/**
 * Salva conteúdo curado no Supabase
 */
async function saveCuratedContent(supabase: any, content: CuratedContent[]) {
  const savedContent = [];

  for (const item of content) {
    try {
      // Verificar se já existe (por URL)
      const { data: existing } = await supabase
        .from('curated_content')
        .select('id')
        .eq('source_url', item.source_url)
        .single();

      if (existing) {
        console.log(`[Save] Conteúdo já existe: ${item.title}`);
        continue;
      }

      // Inserir novo
      const { data: saved, error } = await supabase
        .from('curated_content')
        .insert({
          title: item.title,
          summary: item.summary,
          source_url: item.source_url,
          source_name: item.source_name,
          category: item.category,
          tags: item.tags,
          relevance_score: item.relevance_score,
          read_time: item.read_time,
          is_premium: false,
          is_external: true,
          curated_at: new Date().toISOString(),
          curated_by: 'IA Perplexity + Claude',
        })
        .select()
        .single();

      if (error) {
        console.error('[Save] Error:', error);
      } else {
        savedContent.push(saved);
        console.log(`[Save] ✅ Salvo: ${item.title}`);
      }
    } catch (error) {
      console.error('[Save] Error saving content:', error);
    }
  }

  return savedContent;
}

/**
 * Gera conteúdo curado mock (quando Perplexity não está disponível)
 */
async function generateMockCuratedContent(topic: string): Promise<CuratedContent[]> {
  // Detectar categoria baseada no tópico
  const detectCategory = (topic: string): CuratedContent['category'] => {
    if (topic.includes('gestação') || topic.includes('gravidez')) return 'gestacao';
    if (topic.includes('pós-parto') || topic.includes('puerpério')) return 'puerperio';
    if (topic.includes('força') || topic.includes('empoderamento')) return 'forca-feminina';
    return 'maternidade';
  };

  return [
    {
      title: `Guia Completo: ${topic}`,
      summary: `Um guia abrangente sobre ${topic.toLowerCase()}, baseado em evidências científicas recentes e adaptado para a realidade brasileira. Inclui dicas práticas, depoimentos de especialistas e orientações passo a passo para mães que buscam informação de qualidade.`,
      source_url: `https://example.com/artigos/${topic.toLowerCase().replace(/\s+/g, '-')}`,
      source_name: 'Portal de Maternidade',
      category: detectCategory(topic),
      tags: topic.split(' ').slice(0, 3),
      relevance_score: 85,
      read_time: 5,
    },
  ];
}

