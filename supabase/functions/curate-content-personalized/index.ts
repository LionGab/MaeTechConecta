/**
 * FASE 2: Curate Content (Personalized) - Edge Function
 *
 * Integrado com sistema de personalização v2:
 * - Usa get_user_top_tags() para obter preferências
 * - Busca conteúdo via content_tag_relations
 * - Registra interações em user_interaction_history
 * - Associa tags ao conteúdo salvo
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CurateContentRequest {
  userId: string;
  limit?: number;
}

interface UserTopTag {
  tag_id: string;
  tag_name: string;
  tag_category: string;
  combined_score: number;
}

interface PerplexityResult {
  title: string;
  summary: string;
  source_url: string;
  why_relevant: string;
}

interface CuratedContent {
  id: string;
  title: string;
  summary: string;
  source_url: string | null;
  tags: string[];
  relevance_score: number;
  why_relevant: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, limit = 10 }: CurateContentRequest = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Buscar perfil do usuário
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('type, pregnancy_week, name')
      .eq('id', userId)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: 'User profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Obter top tags personalizadas do usuário via get_user_top_tags()
    const { data: topTags, error: tagsError } = await supabase
      .rpc('get_user_top_tags', {
        p_user_id: userId,
        p_limit: 5
      });

    if (tagsError) {
      console.error('Error fetching user top tags:', tagsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user preferences' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const userTopTags = topTags as UserTopTag[];

    // Se usuário não tem preferências, usar tags default
    let tagNames: string[];
    if (userTopTags.length === 0) {
      // Fallback: tags baseadas no perfil
      tagNames = profile.type === 'gestante'
        ? ['Nutrição', 'Desenvolvimento Fetal', 'Saúde Mental']
        : profile.type === 'mae'
        ? ['Cuidados Bebê', 'Amamentação', 'Saúde Mental']
        : ['Preparação Parto', 'Nutrição', 'Saúde Mental'];
    } else {
      tagNames = userTopTags.map(t => t.tag_name);
    }

    // 3. Verificar se já existe conteúdo relacionado às tags no content_catalog
    const { data: existingContent, error: existingError } = await supabase
      .from('content_catalog')
      .select(`
        id,
        title,
        summary,
        source_url,
        tags,
        relevance_score
      `)
      .overlaps('tags', tagNames)
      .order('relevance_score', { ascending: false })
      .limit(limit);

    if (existingError) {
      console.error('Error fetching existing content:', existingError);
    }

    // Se já temos conteúdo suficiente, retornar
    if (existingContent && existingContent.length >= limit) {
      // Registrar interação de curadoria
      await supabase.from('user_interaction_history').insert({
        user_id: userId,
        content_id: 'curated_batch_' + Date.now(),
        content_type: 'guide',
        interaction_type: 'view',
        engagement_score: 0.5,
        context: {
          tags: tagNames,
          source: 'existing_catalog',
          count: existingContent.length
        }
      });

      return new Response(
        JSON.stringify({
          success: true,
          content: existingContent.map(c => ({
            ...c,
            why_relevant: `Curado para você baseado em: ${tagNames.slice(0, 2).join(', ')}`
          })),
          user_preferences: userTopTags,
          query: tagNames.join(', '),
          source: 'catalog'
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 4. Se não temos conteúdo suficiente, buscar via Perplexity
    const contextPhase =
      profile.type === 'gestante'
        ? `gestante de ${profile.pregnancy_week} semanas`
        : profile.type === 'mae'
        ? 'mãe com bebê'
        : 'tentante';

    const topicQuery = tagNames.join(', ');

    const perplexityPrompt = `Encontre 3 artigos em português brasileiro sobre: ${topicQuery}.

CONTEXTO: Usuária é ${contextPhase}.
PÚBLICO: Mães classe C-D (linguagem simples, acessível).
RESTRIÇÕES:
- Artigos curtos (leitura ≤3 minutos)
- Conteúdo prático e acionável
- Fontes confiáveis (blogs de maternidade, sites de saúde, revistas femininas)
- Evitar conteúdo médico técnico

Retorne APENAS um JSON válido com este formato:
[
  {
    "title": "Título do artigo",
    "summary": "Resumo de 2-3 frases",
    "source_url": "URL completa do artigo",
    "why_relevant": "1 frase explicando relevância para mãe ${contextPhase} com interesse em ${topicQuery}"
  }
]`;

    // 5. Chamar Perplexity API
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!perplexityApiKey) {
      throw new Error('PERPLEXITY_API_KEY not configured');
    }

    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${perplexityApiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content:
              'Você é um curador de conteúdo para mães brasileiras. Retorne apenas JSON válido.',
          },
          {
            role: 'user',
            content: perplexityPrompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });

    if (!perplexityResponse.ok) {
      throw new Error(`Perplexity API error: ${perplexityResponse.status}`);
    }

    const perplexityData = await perplexityResponse.json();
    const perplexityText = perplexityData.choices?.[0]?.message?.content || '';

    // 6. Extrair JSON da resposta
    const jsonMatch = perplexityText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Perplexity response as JSON');
    }

    const results: PerplexityResult[] = JSON.parse(jsonMatch[0]);

    // 7. Obter IDs das tags para associação
    const { data: tagIds } = await supabase
      .from('content_tags')
      .select('id, name')
      .in('name', tagNames);

    const tagIdMap = new Map(tagIds?.map(t => [t.name, t.id]) || []);

    // 8. Salvar em content_catalog e associar tags via content_tag_relations
    const savedContent: CuratedContent[] = [];

    for (const result of results) {
      // Verificar se já existe
      const { data: existing } = await supabase
        .from('content_catalog')
        .select('id')
        .eq('source_url', result.source_url)
        .single();

      let contentId: string;

      if (!existing) {
        // Inserir novo conteúdo
        const { data: content, error: contentError } = await supabase
          .from('content_catalog')
          .insert({
            title: result.title,
            summary: result.summary,
            source_url: result.source_url,
            tags: tagNames, // Manter compatibilidade com formato antigo
            lang: 'pt-BR',
            category: 'curated_personalized',
            relevance_score: 85,
          })
          .select()
          .single();

        if (contentError) {
          console.error('Error saving content:', contentError);
          continue;
        }

        contentId = content.id;

        // Associar tags via content_tag_relations
        const tagRelations = Array.from(tagIdMap.entries()).map(([tagName, tagId]) => ({
          content_id: contentId,
          content_type: 'article' as const,
          tag_id: tagId,
          relevance_score: 0.9
        }));

        if (tagRelations.length > 0) {
          await supabase
            .from('content_tag_relations')
            .insert(tagRelations);
        }

        savedContent.push({
          ...content,
          why_relevant: result.why_relevant,
        });
      } else {
        // Conteúdo já existe
        const { data: existingContent } = await supabase
          .from('content_catalog')
          .select('*')
          .eq('id', existing.id)
          .single();

        if (existingContent) {
          savedContent.push({
            ...existingContent,
            why_relevant: result.why_relevant,
          });
        }
      }
    }

    // 9. Registrar interação de curadoria em user_interaction_history
    await supabase.from('user_interaction_history').insert({
      user_id: userId,
      content_id: 'curated_batch_' + Date.now(),
      content_type: 'guide',
      interaction_type: 'view',
      engagement_score: 0.8,
      context: {
        tags: tagNames,
        source: 'perplexity_api',
        count: savedContent.length,
        top_tags_scores: userTopTags.map(t => ({
          name: t.tag_name,
          score: t.combined_score
        }))
      }
    });

    // 10. Retornar conteúdo curado
    return new Response(
      JSON.stringify({
        success: true,
        content: savedContent,
        user_preferences: userTopTags,
        query: topicQuery,
        source: 'perplexity'
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in curate-content-personalized function:', error);
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
