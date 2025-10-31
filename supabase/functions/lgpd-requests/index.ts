// LGPD Requests - Edge Function
// Direitos do titular: exportar, deletar, revogar consentimento

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    const { userId, action } = await req.json();

    if (!userId || !action) {
      return new Response(
        JSON.stringify({ error: 'userId and action are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (action === 'export') {
      // Exportar todos dados do usuário
      const [profile, messages, plans, memory, alerts] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('id', userId).single(),
        supabase.from('chat_messages').select('*').eq('user_id', userId),
        supabase.from('daily_plans').select('*').eq('user_id', userId),
        supabase.from('conversation_memory').select('*').eq('user_id', userId),
        supabase.from('risk_alerts').select('*').eq('user_id', userId),
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        userProfile: profile.data,
        chatMessages: messages.data,
        dailyPlans: plans.data,
        conversationMemory: memory.data,
        riskAlerts: alerts.data,
      };

      return new Response(
        JSON.stringify(exportData),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    if (action === 'delete') {
      // Deletar todos dados (Right to be Forgotten)
      // Primeiro anonimizar dados sensíveis
      await supabase
        .from('user_profiles')
        .update({
          name: 'Usuário Deletado',
          email: null,
        })
        .eq('id', userId);

      // Deletar mensagens (cascade já faz isso)
      await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', userId);

      // Deletar planos
      await supabase
        .from('daily_plans')
        .delete()
        .eq('user_id', userId);

      // Deletar memória
      await supabase
        .from('conversation_memory')
        .delete()
        .eq('user_id', userId);

      // Deletar alertas
      await supabase
        .from('risk_alerts')
        .delete()
        .eq('user_id', userId);

      return new Response(
        JSON.stringify({ success: true, message: 'Dados deletados com sucesso' }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
