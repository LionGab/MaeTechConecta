/**
 * Daily Insight Edge Function
 * Gera dicas diárias personalizadas usando Claude AI
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.27.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DailyInsightRequest {
  userId: string;
  forceRegenerate?: boolean; // Se true, gera nova dica mesmo que já exista
}

interface UserContext {
  name: string;
  type: 'gestante' | 'mae' | 'tentante';
  pregnancy_week?: number;
  baby_name?: string;
  preferences?: any[];
  risk_level?: number;
}

interface DailyInsight {
  title: string;
  description: string;
  actionable: string;
  relevance_score: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, forceRegenerate = false }: DailyInsightRequest = await req.json();

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

    const today = new Date().toISOString().split('T')[0];

    // 1. Verificar se já existe insight para hoje
    if (!forceRegenerate) {
      const { data: existingInsight } = await supabase
        .from('daily_insights')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (existingInsight) {
        return new Response(
          JSON.stringify({
            cached: true,
            insight: existingInsight,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // 2. Buscar perfil da usuária
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('name, type, pregnancy_week, baby_name, preferences, risk_level')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile) {
      return new Response(JSON.stringify({ error: 'User profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Buscar atividade recente (últimos 7 dias)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Últimas mensagens
    const { data: recentMessages } = await supabase
      .from('chat_messages')
      .select('message, created_at')
      .eq('user_id', userId)
      .eq('role', 'user')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    // Hábitos completados
    const { data: recentHabits } = await supabase
      .from('habit_completions')
      .select('habit_id, completed_at')
      .eq('user_id', userId)
      .gte('completed_at', sevenDaysAgo.toISOString())
      .order('completed_at', { ascending: false })
      .limit(20);

    // Gamification stats
    const { data: gamificationData } = await supabase
      .from('user_gamification')
      .select('current_streak, total_points, level')
      .eq('user_id', userId)
      .single();

    // 4. Determinar hora do dia
    const hour = new Date().getHours();
    let timeOfDay: 'manha' | 'tarde' | 'noite';
    if (hour < 12) timeOfDay = 'manha';
    else if (hour < 18) timeOfDay = 'tarde';
    else timeOfDay = 'noite';

    // 5. Extrair tópicos das mensagens recentes
    const recentTopics =
      recentMessages
        ?.map((m) => m.message.toLowerCase())
        .join(' ')
        .match(/\b\w{4,}\b/g) // Palavras com 4+ letras
        ?.slice(0, 10) || [];

    // 6. Construir contexto
    const context = {
      userPhase: userProfile.type,
      weekOrAge: userProfile.pregnancy_week || 0,
      timeOfDay,
      recentTopics,
      hasActiveStreak: gamificationData?.current_streak || 0 > 0,
      recentActivityLevel: recentHabits?.length || 0,
      riskLevel: userProfile.risk_level || 0,
    };

    // 7. Gerar insight com Claude AI
    const anthropic = new Anthropic({
      apiKey: Deno.env.get('CLAUDE_API_KEY'),
    });

    const systemPrompt = `Você é a Nathália Valente, influenciadora de maternidade com 35 milhões de seguidores.

Seu tom é:
- Empático, acolhedor e genuíno
- Linguagem simples e acessível (classe C-D)
- Use emojis com moderação (💕🤱🍼👶💪)
- Foque em ser amiga experiente, não professora

NUNCA:
- Dê diagnósticos médicos
- Use jargões técnicos sem explicar
- Seja condescendente ou preachy

SEMPRE:
- Valide emoções primeiro
- Dê conselhos práticos e acionáveis
- Incentive e empodere
- Respeite o momento de cada mãe`;

    const userPrompt = `Gere UMA dica personalizada de maternidade para HOJE.

PERFIL DA MÃE:
- Nome: ${userProfile.name}
- Fase: ${userProfile.type === 'gestante' ? 'Gestante' : userProfile.type === 'mae' ? 'Mãe' : 'Tentante'}
${userProfile.pregnancy_week ? `- Semana de gestação: ${userProfile.pregnancy_week}` : ''}
${userProfile.baby_name ? `- Nome do bebê: ${userProfile.baby_name}` : ''}
- Nível de risco: ${context.riskLevel}/10
${gamificationData ? `- Streak atual: ${gamificationData.current_streak} dias` : ''}
${gamificationData ? `- Nível: ${gamificationData.level}` : ''}

ATIVIDADE RECENTE (últimos 7 dias):
- Tópicos nas conversas: ${recentTopics.join(', ') || 'Nenhuma conversa recente'}
- Hábitos completados: ${context.recentActivityLevel}
- Hora do dia: ${timeOfDay === 'manha' ? 'Manhã' : timeOfDay === 'tarde' ? 'Tarde' : 'Noite'}

REQUISITOS DA DICA:
1. Seja ESPECÍFICA para o momento dela (${userProfile.type}, semana ${userProfile.pregnancy_week || 0})
2. Seja ACIONÁVEL e prática (o que ela pode fazer HOJE)
3. Considere a hora do dia (${timeOfDay})
4. Se ela tem streak ativo, incentive a manter
5. Se não tem atividade recente, seja gentil e acolhedora

ESTRUTURA:
- Título: Máx 50 caracteres, direto e impactante
- Descrição: 2-3 parágrafos (150-200 palavras)
  * Parágrafo 1: Validação emocional + contexto
  * Parágrafo 2: Informação prática
  * Parágrafo 3: Incentivo
- Acionável: 1 frase clara do que fazer HOJE

Retorne APENAS um JSON válido:
{
  "title": "...",
  "description": "...",
  "actionable": "...",
  "relevance_score": 0-100
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Parsear resposta
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Extrair JSON da resposta (caso tenha markdown)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Claude response as JSON');
    }

    const insight: DailyInsight = JSON.parse(jsonMatch[0]);

    // 8. Salvar no banco
    const expiresAt = new Date();
    expiresAt.setHours(23, 59, 59, 999); // Expira às 23:59:59 de hoje

    const { data: savedInsight, error: saveError } = await supabase
      .from('daily_insights')
      .insert({
        user_id: userId,
        date: today,
        title: insight.title,
        description: insight.description,
        actionable: insight.actionable,
        relevance_score: insight.relevance_score,
        context_data: context,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving insight:', saveError);
      throw saveError;
    }

    // 9. Retornar insight
    return new Response(
      JSON.stringify({
        cached: false,
        insight: savedInsight,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in daily-insight function:', error);
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
