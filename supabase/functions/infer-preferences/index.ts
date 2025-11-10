/**
 * FASE 3: Infer Preferences - Edge Function
 *
 * Infere preferências implícitas do usuário baseado em:
 * - Histórico de interações (user_interaction_history)
 * - Eventos comportamentais (events table)
 * - Tags associadas ao conteúdo (content_tag_relations)
 *
 * Atualiza user_preferences com explicit=false, source='ai_inferred'
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InferPreferencesRequest {
  userId: string;
}

interface TagAggregation {
  tag_id: string;
  tag_name: string;
  tag_category: string;
  interaction_count: number;
  total_engagement: number;
  avg_engagement: number;
  weight: number;
  reason: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseAnonKey) {
      throw new Error('Supabase env vars não configuradas');
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { userId: requestedUserId }: InferPreferencesRequest = await req.json();

    if (requestedUserId && requestedUserId !== user.id) {
      return new Response(JSON.stringify({ error: 'userId mismatch' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = user.id;

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // 1. Buscar últimas 50 interações dos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: interactions, error: interactionsError } = await supabase
      .from('user_interaction_history')
      .select('content_id, content_type, interaction_type, engagement_score, created_at')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(50);

    if (interactionsError) {
      console.error('Error fetching interactions:', interactionsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch user interactions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!interactions || interactions.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          inferred: [],
          updated_count: 0,
          message: 'No interactions found to infer preferences',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 2. Extrair content_ids das interações
    const contentIds = [...new Set(interactions.map((i) => i.content_id))];

    // 3. Buscar tags associadas ao conteúdo via content_tag_relations
    const { data: tagRelations, error: tagRelationsError } = await supabase
      .from('content_tag_relations')
      .select(
        `
        content_id,
        tag_id,
        relevance_score,
        content_tags (
          id,
          name,
          category
        )
      `
      )
      .in('content_id', contentIds);

    if (tagRelationsError) {
      console.error('Error fetching tag relations:', tagRelationsError);
    }

    // 4. Agregar dados: tag → interações → engagement
    const tagMap = new Map<string, TagAggregation>();

    if (tagRelations && tagRelations.length > 0) {
      for (const relation of tagRelations) {
        const tag = relation.content_tags as any;
        if (!tag) continue;

        const tagId = tag.id;
        const tagName = tag.name;
        const tagCategory = tag.category;

        // Buscar todas as interações com este content_id
        const contentInteractions = interactions.filter((i) => i.content_id === relation.content_id);

        for (const interaction of contentInteractions) {
          const engagementScore = interaction.engagement_score || 0;

          if (!tagMap.has(tagId)) {
            tagMap.set(tagId, {
              tag_id: tagId,
              tag_name: tagName,
              tag_category: tagCategory,
              interaction_count: 0,
              total_engagement: 0,
              avg_engagement: 0,
              weight: 0,
              reason: '',
            });
          }

          const tagData = tagMap.get(tagId)!;
          tagData.interaction_count++;
          tagData.total_engagement += engagementScore * (relation.relevance_score || 1);
        }
      }
    }

    // 5. Calcular pesos e razões
    const inferredTags: TagAggregation[] = [];

    for (const [tagId, data] of tagMap.entries()) {
      data.avg_engagement = data.total_engagement / data.interaction_count;

      // Fórmula: (avg_engagement * frequency_factor)
      // frequency_factor = log2(interaction_count + 1) para suavizar
      const frequencyFactor = Math.log2(data.interaction_count + 1);
      data.weight = Math.min(1.0, (data.avg_engagement * frequencyFactor) / 5);

      // Gerar razão humanizada
      if (data.interaction_count >= 5) {
        data.reason = `Alto engajamento (${data.interaction_count} interações)`;
      } else if (data.avg_engagement > 0.7) {
        data.reason = `Engajamento forte (score ${data.avg_engagement.toFixed(2)})`;
      } else {
        data.reason = `Interesse identificado (${data.interaction_count} interações)`;
      }

      inferredTags.push(data);
    }

    // 6. Ordenar por peso e limitar top 10 por categoria
    inferredTags.sort((a, b) => b.weight - a.weight);

    const topTagsByCategory = new Map<string, TagAggregation[]>();
    for (const tag of inferredTags) {
      if (!topTagsByCategory.has(tag.tag_category)) {
        topTagsByCategory.set(tag.tag_category, []);
      }
      const categoryTags = topTagsByCategory.get(tag.tag_category)!;
      if (categoryTags.length < 10) {
        categoryTags.push(tag);
      }
    }

    // Flatten top tags
    const topTags = Array.from(topTagsByCategory.values()).flat();

    // 7. Upsert em user_preferences (apenas se peso > 0.1)
    const preferencesToUpsert = topTags
      .filter((t) => t.weight > 0.1)
      .map((tag) => ({
        user_id: userId,
        tag_id: tag.tag_id,
        preference_type: 'interest',
        weight: tag.weight,
        explicit: false,
        source: 'ai_inferred',
        metadata: {
          interaction_count: tag.interaction_count,
          avg_engagement: tag.avg_engagement,
          reason: tag.reason,
          inferred_at: new Date().toISOString(),
        },
      }));

    let updatedCount = 0;

    if (preferencesToUpsert.length > 0) {
      for (const pref of preferencesToUpsert) {
        const { error: upsertError } = await supabase.from('user_preferences').upsert(pref, {
          onConflict: 'user_id,tag_id,preference_type',
          ignoreDuplicates: false,
        });

        if (upsertError) {
          console.error('Error upserting preference:', upsertError);
        } else {
          updatedCount++;
        }
      }
    }

    // 8. Retornar resultado
    return new Response(
      JSON.stringify({
        success: true,
        inferred: topTags.map((t) => ({
          tag_id: t.tag_id,
          tag_name: t.tag_name,
          category: t.tag_category,
          weight: t.weight,
          reason: t.reason,
        })),
        updated_count: updatedCount,
        metadata: {
          total_interactions: interactions.length,
          unique_tags: tagMap.size,
          inference_date: new Date().toISOString(),
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in infer-preferences function:', error);
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

