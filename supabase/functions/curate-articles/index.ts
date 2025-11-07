/**
 * Curate Articles - Edge Function
 *
 * Busca e cura artigos sobre maternidade usando Perplexity + Claude
 * Executa via cron job diário
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// =====================================================
// SCHEMA VALIDATION
// =====================================================

const RequestSchema = z.object({
  category: z.enum(['maternidade', 'gestacao', 'puerperio', 'forca-feminina']).optional(),
  limit: z.number().min(1).max(20).optional().default(5),
  adminKey: z.string().optional(), // Para autenticar cron jobs
});

const ArticleSchema = z.object({
  title: z.string().min(10),
  summary: z.string().min(50),
  source_url: z.string().url(),
  source_name: z.string().optional(),
  category: z.enum(['maternidade', 'gestacao', 'puerperio', 'forca-feminina']),
  tags: z.array(z.string()).optional(),
  relevance_score: z.number().min(0).max(100).optional(),
  read_time: z.number().optional(),
});

// =====================================================
// TYPES
// =====================================================

interface CuratedArticle {
  title: string;
  summary: string;
  source_url: string;
  source_name?: string;
  category: 'maternidade' | 'gestacao' | 'puerperio' | 'forca-feminina';
  tags?: string[];
  relevance_score?: number;
  read_time?: number;
  thumbnail?: string;
}

// =====================================================
// RETRY CONFIG
// =====================================================

async function retryWithBackoff<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        console.log(`Retry attempt ${attempt}/${maxAttempts}, waiting ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// =====================================================
// BUSCAR ARTIGOS COM PERPLEXITY
// =====================================================

async function searchWithPerplexity(query: string): Promise<string[]> {
  const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');

  if (!perplexityApiKey) {
    console.warn('PERPLEXITY_API_KEY not configured, using mock data');
    return ['https://example.com/article-1', 'https://example.com/article-2', 'https://example.com/article-3'];
  }

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${perplexityApiKey}`,
    },
    body: JSON.stringify({
      model: 'sonar-medium-online',
      messages: [
        {
          role: 'system',
          content:
            'Você é um curador de conteúdo especializado em maternidade. Retorne apenas URLs de artigos relevantes em português.',
        },
        {
          role: 'user',
          content: query,
        },
      ],
      max_tokens: 500,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';

  // Extrair URLs do texto
  const urlRegex = /https?:\/\/[^\s<>"]+/g;
  const urls = text.match(urlRegex) || [];

  return urls.slice(0, 10); // Máximo 10 URLs
}

// =====================================================
// ANALISAR E CURAR ARTIGO COM CLAUDE
// =====================================================

async function curateArticleWithClaude(url: string, category: string): Promise<CuratedArticle | null> {
  const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');

  if (!claudeApiKey) {
    console.warn('CLAUDE_API_KEY not configured, using mock data');
    return {
      title: 'Artigo sobre Maternidade (Mock)',
      summary:
        'Este é um artigo mockado sobre maternidade, usado apenas para desenvolvimento. Configure CLAUDE_API_KEY para curadoria real.',
      source_url: url,
      source_name: 'Mock Source',
      category: category as any,
      tags: ['maternidade', 'mock'],
      relevance_score: 75,
      read_time: 5,
    };
  }

  const prompt = `Analise o seguinte artigo e gere um resumo estruturado:

URL: ${url}
Categoria: ${category}

Retorne APENAS um JSON válido no seguinte formato:
{
  "title": "Título do artigo",
  "summary": "Resumo objetivo em 2-3 sentenças (máx 500 chars)",
  "source_name": "Nome do site/fonte",
  "tags": ["tag1", "tag2", "tag3"],
  "relevance_score": 85,
  "read_time": 5
}

Se o artigo não for relevante ou não for em português, retorne: {"relevant": false}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': claudeApiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;

  if (!text) {
    return null;
  }

  // Extrair JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return null;
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Verificar se é relevante
  if (parsed.relevant === false) {
    return null;
  }

  return {
    title: parsed.title,
    summary: parsed.summary,
    source_url: url,
    source_name: parsed.source_name || 'Fonte Externa',
    category: category as any,
    tags: parsed.tags || [],
    relevance_score: parsed.relevance_score || 80,
    read_time: parsed.read_time || 5,
  };
}

// =====================================================
// SALVAR ARTIGOS NO BANCO
// =====================================================

async function saveArticles(articles: CuratedArticle[], supabase: any): Promise<number> {
  let savedCount = 0;

  for (const article of articles) {
    try {
      // Verificar se já existe (por URL)
      const { data: existing } = await supabase
        .from('curated_content')
        .select('id')
        .eq('source_url', article.source_url)
        .single();

      if (existing) {
        console.log(`Article already exists: ${article.source_url}`);
        continue;
      }

      // Inserir novo artigo
      const { error } = await supabase.from('curated_content').insert({
        title: article.title,
        summary: article.summary,
        source_url: article.source_url,
        source_name: article.source_name,
        category: article.category,
        tags: article.tags,
        relevance_score: article.relevance_score,
        read_time: article.read_time,
        thumbnail: article.thumbnail,
        is_premium: false,
        is_external: true,
        curated_by: 'IA Perplexity + Claude',
        curated_at: new Date().toISOString(),
      });

      if (error) {
        console.error(`Failed to save article: ${article.title}`, error);
      } else {
        savedCount++;
      }
    } catch (error) {
      console.error(`Error saving article: ${article.title}`, error);
    }
  }

  return savedCount;
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
    // Parse request
    const body = await req.json().catch(() => ({}));
    const { category, limit, adminKey } = RequestSchema.parse(body);

    // Verificar admin key (para cron jobs)
    const expectedAdminKey = Deno.env.get('ADMIN_API_KEY');
    if (expectedAdminKey && adminKey !== expectedAdminKey) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Inicializar Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase config missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Definir queries por categoria
    const queries = category ? [category] : ['maternidade', 'gestacao', 'puerperio', 'forca-feminina'];

    const searchQueries: Record<string, string> = {
      maternidade:
        'Busque os 5 melhores artigos recentes em português sobre maternidade, desenvolvimento infantil e criação de filhos',
      gestacao: 'Busque os 5 melhores artigos recentes em português sobre gravidez, gestação e pré-natal',
      puerperio: 'Busque os 5 melhores artigos recentes em português sobre pós-parto, puerpério e amamentação',
      'forca-feminina':
        'Busque os 5 melhores artigos recentes em português sobre empoderamento feminino, saúde mental materna e autocuidado',
    };

    const allArticles: CuratedArticle[] = [];

    // Buscar e curar artigos para cada categoria
    for (const cat of queries) {
      try {
        const query = searchQueries[cat] || searchQueries.maternidade;

        // Buscar URLs com Perplexity
        const urls = await retryWithBackoff(() => searchWithPerplexity(query));

        // Curar cada artigo com Claude
        for (const url of urls.slice(0, limit)) {
          try {
            const article = await retryWithBackoff(() => curateArticleWithClaude(url, cat));
            if (article) {
              allArticles.push(article);
            }
          } catch (error) {
            console.error(`Failed to curate article: ${url}`, error);
          }
        }
      } catch (error) {
        console.error(`Failed to process category: ${cat}`, error);
      }
    }

    // Salvar artigos no banco
    const savedCount = await saveArticles(allArticles, supabase);

    return new Response(
      JSON.stringify({
        success: true,
        curated: allArticles.length,
        saved: savedCount,
        categories: queries,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in curate-articles:', error);

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
