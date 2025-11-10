/**
 * Dispatch Plan - Edge Function
 * Envia mensagens agendadas via Expo Push Notifications
 * Roda a cada hora via pg_cron (00, 09, 14, 19)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DispatchPlanRequest {
  userId?: string; // Opcional: dispatch apenas para este usuário
  hour?: number; // Opcional: hora específica (0-23)
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId: singleUserId, hour }: DispatchPlanRequest = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split('T')[0];
    const currentHour = hour !== undefined ? hour : new Date().getHours();
    const currentTime = `${String(currentHour).padStart(2, '0')}:00`;

    console.log(`Dispatching plans for date=${today}, time=${currentTime}`);

    // 1. Buscar message_plans de hoje que devem ser enviados nesta hora
    let query = supabase.from('message_plan').select('id, user_id, items, rationale, timezone').eq('plan_date', today);

    if (singleUserId) {
      query = query.eq('user_id', singleUserId);
    }

    const { data: plans, error: plansError } = await query;

    if (plansError) {
      throw plansError;
    }

    if (!plans || plans.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No plans to dispatch',
          dispatched: 0,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Found ${plans.length} plans for ${today}`);

    const results = {
      dispatched: 0,
      skipped: 0,
      failed: 0,
    };

    // 2. Processar cada plano
    for (const plan of plans) {
      try {
        // Buscar user_profile para push token e frequency_cap
        const { data: user } = await supabase
          .from('user_profiles')
          .select('id, name, push_token, frequency_cap, opt_in_notifications')
          .eq('id', plan.user_id)
          .single();

        if (!user || !user.opt_in_notifications) {
          console.log(`User ${plan.user_id} has opt_in_notifications=false, skipping`);
          results.skipped++;
          continue;
        }

        if (!user.push_token) {
          console.log(`User ${plan.user_id} has no push_token, skipping`);
          results.skipped++;
          continue;
        }

        // Verificar frequency cap (máx. de pushes por dia)
        const { count: todayDeliveries } = await supabase
          .from('message_deliveries')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', plan.user_id)
          .eq('channel', 'push')
          .gte('created_at', `${today}T00:00:00Z`)
          .lte('created_at', `${today}T23:59:59Z`);

        const frequencyCap = user.frequency_cap || 2;
        if (todayDeliveries && todayDeliveries >= frequencyCap) {
          console.log(`User ${plan.user_id} reached frequency cap (${todayDeliveries}/${frequencyCap}), skipping`);
          results.skipped++;
          continue;
        }

        // 3. Filtrar itens que devem ser enviados agora
        // Job roda às 00h, 09h, 14h, 19h
        // Pega todos os itens cujo horário já passou desde a última execução
        const items = plan.items || [];
        const currentHourInt = parseInt(currentHour, 10);

        // Determinar janela de horários com base na hora atual
        let minHour: number;
        let maxHour: number;

        if (currentHourInt === 0) {
          // Às 00h: pega itens de 00:00-08:59 (até próxima execução às 09h)
          minHour = 0;
          maxHour = 8;
        } else if (currentHourInt === 9) {
          // Às 09h: pega itens de 09:00-13:59 (até próxima execução às 14h)
          minHour = 9;
          maxHour = 13;
        } else if (currentHourInt === 14) {
          // Às 14h: pega itens de 14:00-18:59 (até próxima execução às 19h)
          minHour = 14;
          maxHour = 18;
        } else {
          // Às 19h: pega itens de 19:00-23:59 (até próxima execução às 00h)
          minHour = 19;
          maxHour = 23;
        }

        const itemsToSend = items.filter((item: any) => {
          // Extrair hora do scheduled_at (formato: "HH:MM")
          const [itemHourStr] = item.scheduled_at.split(':');
          const itemHour = parseInt(itemHourStr, 10);

          // Verificar se o item está na janela de horários
          // Como o job roda apenas 4x ao dia, enviamos TODOS os itens da janela
          // A proteção contra duplicatas está em !item.delivery_id
          const isInWindow = itemHour >= minHour && itemHour <= maxHour;

          // Não enviar se já tiver delivery_id (já foi enviado)
          const notDeliveredYet = !item.delivery_id;

          return isInWindow && notDeliveredYet;
        });

        if (itemsToSend.length === 0) {
          console.log(`No items scheduled for ${currentTime} in plan ${plan.id}`);
          results.skipped++;
          continue;
        }

        // 4. Enviar cada item via Expo Push Notifications
        for (const item of itemsToSend) {
          try {
            // Verificar se já foi enviado (evitar duplicatas)
            const { data: existingDelivery } = await supabase
              .from('message_deliveries')
              .select('id')
              .eq('plan_id', plan.id)
              .eq('scheduled_at', `${today}T${item.scheduled_at}:00Z`)
              .single();

            if (existingDelivery) {
              console.log(`Item already sent for plan ${plan.id} at ${item.scheduled_at}`);
              continue;
            }

            // Criar registro de delivery (status=scheduled)
            const { data: delivery, error: deliveryError } = await supabase
              .from('message_deliveries')
              .insert({
                plan_id: plan.id,
                user_id: plan.user_id,
                channel: 'push',
                scheduled_at: `${today}T${item.scheduled_at}:00Z`,
                status: 'scheduled',
                message_text: item.message_text,
                reason: item.rationale,
              })
              .select()
              .single();

            if (deliveryError) {
              throw deliveryError;
            }

            // 5. Enviar push notification via Expo
            const pushPayload = {
              to: user.push_token,
              sound: 'default',
              title: '💕 Nossa Maternidade',
              body: item.message_text,
              data: {
                type: item.type,
                plan_id: plan.id,
                delivery_id: delivery.id,
                cta: item.cta,
              },
            };

            const expoPushResponse = await fetch('https://exp.host/--/api/v2/push/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              body: JSON.stringify(pushPayload),
            });

            const expoPushResult = await expoPushResponse.json();

            if (expoPushResult.data?.status === 'ok') {
              // Atualizar status para 'sent'
              await supabase
                .from('message_deliveries')
                .update({
                  status: 'sent',
                  sent_at: new Date().toISOString(),
                })
                .eq('id', delivery.id);

              console.log(`Successfully sent push to user ${plan.user_id}`);
              results.dispatched++;
            } else {
              // Atualizar status para 'failed'
              await supabase
                .from('message_deliveries')
                .update({
                  status: 'failed',
                  feedback: expoPushResult.data?.message || 'Expo push failed',
                })
                .eq('id', delivery.id);

              console.error(`Failed to send push to user ${plan.user_id}:`, expoPushResult);
              results.failed++;
            }
          } catch (itemError: any) {
            console.error(`Error sending item for plan ${plan.id}:`, itemError);
            results.failed++;
          }
        }
      } catch (planError: any) {
        console.error(`Error processing plan ${plan.id}:`, planError);
        results.failed++;
      }
    }

    // 6. Retornar resumo
    return new Response(
      JSON.stringify({
        success: true,
        date: today,
        time: currentTime,
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in dispatch-plan function:', error);
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

