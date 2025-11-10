/**
 * Plan Daily - Edge Function (JOB PRINCIPAL)
 * Orquestra todo o fluxo de personalização:
 * 1. build-signals → 2. curate-content → 3. compose-copy → 4. salva message_plan
 *
 * Roda via pg_cron às 23:15 todo dia
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlanDailyRequest {
  userId?: string; // Opcional: se fornecido, planeja apenas para este usuário
  forceRegenerate?: boolean;
  planDate?: string; // Opcional: data alvo no formato YYYY-MM-DD
}

interface PolicyResult {
  priority: string;
  items: PlanItem[];
  rationale: Record<string, string>;
}

interface PlanItem {
  scheduled_at: string; // HH:MM (hora local)
  type: 'check-in' | 'content' | 'habit' | 'alert' | 'closure';
  template_id: string;
  message_text: string;
  cta?: string;
  rationale: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase env vars não configuradas');
    }

    const authHeader = req.headers.get('Authorization');
    let authUserId: string | null = null;

    if (authHeader) {
      if (!supabaseAnonKey) {
        throw new Error('SUPABASE_ANON_KEY não configurada');
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

      authUserId = user.id;
    }

    const {
      userId: rawSingleUserId,
      forceRegenerate = false,
      planDate: requestedPlanDate,
    }: PlanDailyRequest = await req.json();

    if (!authUserId && rawSingleUserId) {
      return new Response(JSON.stringify({ error: 'Authorization required for single user planning' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (authUserId && rawSingleUserId && rawSingleUserId !== authUserId) {
      return new Response(JSON.stringify({ error: 'userId mismatch' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const singleUserId = authUserId ?? rawSingleUserId;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (requestedPlanDate && !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(requestedPlanDate)) {
      return new Response(JSON.stringify({ error: 'Invalid planDate format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 1);
    const defaultPlanDate = defaultDate.toISOString().split('T')[0];

    const planDate = requestedPlanDate || defaultPlanDate;

    // 1. Buscar usuários para planejar
    let usersToProcess = [];
    if (singleUserId) {
      // Modo single-user (on-demand)
      const { data: user } = await supabase
        .from('user_profiles')
        .select('id, name, type, pregnancy_week, timezone, frequency_cap, opt_in_notifications')
        .eq('id', singleUserId)
        .single();

      if (user) usersToProcess = [user];
    } else {
      // Modo batch (todos os usuários com opt-in)
      const { data: users } = await supabase
        .from('user_profiles')
        .select('id, name, type, pregnancy_week, timezone, frequency_cap, opt_in_notifications')
        .eq('opt_in_notifications', true);

      usersToProcess = users || [];
    }

    console.log(`Processing ${usersToProcess.length} users for plan_date=${planDate}`);

    const results = {
      success: 0,
      errors: 0,
      skipped: 0,
    };

    // 2. Processar cada usuário
    for (const user of usersToProcess) {
      try {
        // Verificar se já tem plano para amanhã (skip se não forçar)
        if (!forceRegenerate) {
          const { data: existingPlan } = await supabase
            .from('message_plan')
            .select('id')
            .eq('user_id', user.id)
            .eq('plan_date', planDate)
            .single();

          if (existingPlan) {
            console.log(`User ${user.id} already has plan for ${planDate}, skipping`);
            results.skipped++;
            continue;
          }
        }

        // 3. STEP 1: Build signals (análise comportamental)
        console.log(`Building signals for user ${user.id}`);
        const signalsResponse = await fetch(`${supabaseUrl}/functions/v1/build-signals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!signalsResponse.ok) {
          throw new Error(`build-signals failed: ${signalsResponse.status}`);
        }

        const signalsData = await signalsResponse.json();
        const signal = signalsData.signal;

        // 4. STEP 2: Aplicar Policy Engine (regras determinísticas)
        const policyResult = applyPolicyEngine(signal, user);

        // 5. STEP 3: Curate content (se necessário)
        let curatedContent = [];
        if (['support', 'belonging', 'habit'].includes(policyResult.priority)) {
          console.log(`Curating content for user ${user.id} with tags ${signal.tags}`);
          const curateResponse = await fetch(`${supabaseUrl}/functions/v1/curate-content-personalized`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({
              userId: user.id,
              tags: signal.tags,
            }),
          });

          if (curateResponse.ok) {
            const curateData = await curateResponse.json();
            curatedContent = curateData.content || [];
          }
        }

        // 6. STEP 4: Compose copy (personalizar mensagens)
        const finalItems = [];
        for (const item of policyResult.items) {
          const composeResponse = await fetch(`${supabaseUrl}/functions/v1/compose-copy`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({
              template: item.message_text,
              variables: { nome: user.name },
              rationale: item.rationale,
              tone: item.type === 'alert' ? 'urgente' : 'acolhedor',
              maxLength: 240,
            }),
          });

          if (composeResponse.ok) {
            const composeData = await composeResponse.json();
            finalItems.push({
              ...item,
              message_text: composeData.copy.text,
              cta: composeData.copy.cta || item.cta,
            });
          } else {
            // Fallback: usar template original
            finalItems.push(item);
          }
        }

        // 7. STEP 5: Salvar message_plan
        const { error: planError } = await supabase.from('message_plan').upsert({
          user_id: user.id,
          plan_date: planDate,
          timezone: user.timezone || 'America/Cuiaba',
          items: finalItems,
          rationale: {
            priority: policyResult.priority,
            tags: signal.tags,
            scores: signal.scores,
            risk_level: signal.risk_level,
            reasons: policyResult.rationale,
          },
        });

        if (planError) {
          throw planError;
        }

        console.log(`Successfully created plan for user ${user.id}`);
        results.success++;
      } catch (error: any) {
        console.error(`Error processing user ${user.id}:`, error);
        results.errors++;
      }
    }

    // 8. Retornar resumo
    return new Response(
      JSON.stringify({
        success: true,
        plan_date: planDate,
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in plan-daily function:', error);
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
 * Policy Engine: regras determinísticas para priorizar trilhas
 */
function applyPolicyEngine(signal: any, user: any): PolicyResult {
  const { tags, scores, risk_level } = signal;

  // REGRA 1: ALERTA CRÍTICO (pp_intrusive, harm_thoughts)
  if (risk_level >= 8 || tags.includes('pp_intrusive') || tags.includes('harm_thoughts')) {
    return {
      priority: 'alert',
      items: [
        {
          scheduled_at: '09:00',
          type: 'alert',
          template_id: 'acolhimento_crise',
          message_text:
            '{nome}, percebemos que você pode estar passando por um momento muito difícil. Você não está sozinha. Aqui estão recursos que podem te ajudar agora mesmo.',
          rationale: 'Alerta crítico detectado: pensamentos intrusivos ou risco alto',
        },
        {
          scheduled_at: '14:00',
          type: 'alert',
          template_id: 'recursos_imediatos',
          message_text: 'Se você está em crise, ligue AGORA:\n\n🆘 CVV (24h): 188\n🆘 SAMU (emergência): 192',
          rationale: 'Recursos de emergência',
        },
        {
          scheduled_at: '19:30',
          type: 'closure',
          template_id: 'encerramento_positivo',
          message_text: 'Boa noite, {nome}. Você teve coragem de seguir em frente hoje. Isso é força.',
          rationale: 'Encerramento empático',
        },
      ],
      rationale: {
        main: 'Alerta crítico: risco alto detectado',
        priority_reason: 'Segurança e acolhimento imediato',
      },
    };
  }

  // REGRA 2: STRESS CRÍTICO (stress_score > 70)
  if (scores.stress_score > 70) {
    return {
      priority: 'stress',
      items: [
        {
          scheduled_at: '09:00',
          type: 'check-in',
          template_id: 'checkin_manha',
          message_text: 'Bom dia, {nome}! 🌅 Como você está hoje? Vamos cuidar do seu stress juntas.',
          rationale: `Seu nível de stress está alto (${scores.stress_score}/100)`,
        },
        {
          scheduled_at: '14:00',
          type: 'content',
          template_id: 'stress_acao_pratica',
          message_text:
            'Oi, {nome}! Stress alto? Hoje faça 1 coisa de cada vez. Prioridade número 1: você comer algo e beber água.',
          rationale: 'Ação prática para reduzir stress',
        },
        {
          scheduled_at: '19:30',
          type: 'habit',
          template_id: 'respira_simples',
          message_text: '{nome}, quando sentir que vai explodir: respire 4 tempos, segura 4, solta 4. Repete 3 vezes.',
          cta: 'Fiz a respiração',
          rationale: 'Técnica de respiração para alívio imediato',
        },
      ],
      rationale: {
        main: `Stress crítico detectado (${scores.stress_score}/100)`,
        priority_reason: 'Foco em redução de stress e autocuidado',
      },
    };
  }

  // REGRA 3: PERTENCIMENTO (tag_lonely, tag_single_mom, tag_father_absent)
  if (
    tags.includes('tag_lonely') ||
    tags.includes('tag_single_mom') ||
    tags.includes('tag_father_absent') ||
    scores.support_score < 40
  ) {
    return {
      priority: 'belonging',
      items: [
        {
          scheduled_at: '09:00',
          type: 'check-in',
          template_id: 'checkin_manha',
          message_text: 'Bom dia, {nome}! 🌅 Você não está sozinha. Como você está hoje?',
          rationale: `Você sinalizou solidão e pouco apoio (${scores.support_score}/100)`,
        },
        {
          scheduled_at: '14:00',
          type: 'content',
          template_id: 'historia_nath_pertencimento',
          message_text:
            '{nome}, milhões de mães passam exatamente pelo que você sente. Vem ver histórias reais no MundoNath?',
          cta: 'Ver histórias',
          rationale: 'Conexão com comunidade de mães',
        },
        {
          scheduled_at: '19:30',
          type: 'habit',
          template_id: 'rede_de_apoio_simples',
          message_text:
            '{nome}, hoje escolha 1 pessoa para pedir um favor simples (5 min com o bebê). Pequenos pedidos criam apoio real.',
          cta: 'Fiz o pedido',
          rationale: 'Construir rede de apoio prático',
        },
      ],
      rationale: {
        main: 'Solidão e pouco apoio detectados',
        priority_reason: 'Foco em pertencimento e comunidade',
        tags: tags.filter((t) => ['tag_lonely', 'tag_single_mom', 'tag_father_absent'].includes(t)),
      },
    };
  }

  // REGRA 4: PADRÃO (hábito + curadoria)
  return {
    priority: 'habit',
    items: [
      {
        scheduled_at: '09:00',
        type: 'check-in',
        template_id: 'checkin_manha',
        message_text: 'Bom dia, {nome}! 🌅 Como você está hoje? Marque seu humor e receba uma dica personalizada.',
        rationale: 'Check-in diário para acompanhamento',
      },
      {
        scheduled_at: '14:00',
        type: 'content',
        template_id: 'conteudo_curado',
        message_text: '{nome}, separamos um conteúdo especial para você hoje sobre maternidade. 💕',
        cta: 'Ver conteúdo',
        rationale: 'Conteúdo curado personalizado',
      },
      {
        scheduled_at: '19:30',
        type: 'habit',
        template_id: 'habito_simples_5min',
        message_text: "Falta pouco, {nome}! 🍼 Marca um hábito rápido: beber 1 copo d'água agora.",
        cta: 'Bebi água',
        rationale: 'Hábito simples para construir autoeficácia',
      },
    ],
    rationale: {
      main: 'Comportamento estável',
      priority_reason: 'Foco em hábitos e conteúdo educativo',
    },
  };
}
