/**
 * Ingest Event - Edge Function
 * Recebe eventos do app e grava em events
 * Rate limit: 100/min por usuário
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IngestEventRequest {
  userId: string;
  kind: string;
  payload: Record<string, any>;
}

const VALID_EVENT_KINDS = [
  'onboarding_submitted',
  'mood_update',
  'habit_check',
  'chat_turn',
  'content_viewed',
  'content_saved',
  'notification_opened',
  'notification_dismissed',
  'plan_requested',
  'feedback_given',
];

const MAX_PAYLOAD_SIZE = 5 * 1024; // 5KB

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
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      throw new Error('Supabase env vars não configuradas');
    }

    // Cliente para validar token com RLS
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

    const { userId: requestedUserId, kind, payload }: IngestEventRequest = await req.json();

    if (requestedUserId && requestedUserId !== user.id) {
      return new Response(JSON.stringify({ error: 'userId mismatch' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = user.id;

    // Validação: userId obrigatório
    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validação: kind deve ser válido
    if (!kind || !VALID_EVENT_KINDS.includes(kind)) {
      return new Response(
        JSON.stringify({
          error: `Invalid kind. Must be one of: ${VALID_EVENT_KINDS.join(', ')}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validação: payload não pode ser vazio e não pode exceder 5KB
    if (!payload || typeof payload !== 'object') {
      return new Response(JSON.stringify({ error: 'payload must be a valid object' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payloadString = JSON.stringify(payload);
    if (payloadString.length > MAX_PAYLOAD_SIZE) {
      return new Response(
        JSON.stringify({
          error: `payload exceeds maximum size of ${MAX_PAYLOAD_SIZE} bytes`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Verificar rate limit (máx 100 eventos por minuto por usuário)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { count: recentEventsCount } = await supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', oneMinuteAgo);

    if (recentEventsCount && recentEventsCount >= 100) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. Max 100 events per minute.',
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Inserir evento
    const { data: event, error: insertError } = await supabase
      .from('events')
      .insert({
        user_id: userId,
        kind,
        payload,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting event:', insertError);
      throw insertError;
    }

    // Retornar sucesso
    return new Response(
      JSON.stringify({
        success: true,
        event: {
          id: event.id,
          created_at: event.created_at,
        },
      }),
      {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in ingest-event function:', error);
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
