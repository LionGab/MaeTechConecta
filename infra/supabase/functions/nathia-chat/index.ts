/**
 * NathIA Chat - Edge Function
 * 
 * Chat com IA especializada em maternidade
 * Usa rate limiting e RLS (não SERVICE_ROLE)
 */

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { checkRate } from "../_shared/rate-limit.ts";
import { withSentry, captureException } from "../_shared/sentry.ts";

interface ChatRequest {
  userId: string;
  message: string;
  context?: {
    type?: string;
    pregnancy_week?: number;
  };
}

async function handleChat(req: Request): Promise<Response> {
  try {
    // Obter Authorization header
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", message: "Missing Authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Criar cliente Supabase com ANON_KEY (não SERVICE_ROLE)
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      captureException(new Error("Supabase config missing"), {
        component: "nathia-chat",
      });
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Parse request body
    const body: ChatRequest = await req.json();
    const { userId, message, context } = body;

    if (!userId || !message) {
      return new Response(
        JSON.stringify({ error: "Bad request", message: "userId and message required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verificar rate limit
    const rateCheck = await checkRate(supabase, userId, "nathia-chat");
    
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: "rate_limited",
          message: "Too many requests",
          resetAt: rateCheck.resetAt.toISOString(),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil((rateCheck.resetAt.getTime() - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Salvar mensagem do usuário (via RLS)
    const { error: insertError } = await supabase
      .from("chat_messages")
      .insert({
        user_id: userId,
        message,
        role: "user",
        context: context || {},
      });

    if (insertError) {
      captureException(insertError, {
        component: "nathia-chat",
        action: "insert_message",
      });
      return new Response(
        JSON.stringify({ error: "Failed to save message" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // TODO: Processar com Gemini AI
    // Por enquanto, retornar resposta mockada
    const response = {
      response: "Olá! Como posso ajudar você hoje?",
      rateLimit: {
        remaining: 9, // Aproximado
        resetAt: rateCheck.resetAt.toISOString(),
      },
    };

    // Salvar resposta da IA
    await supabase.from("chat_messages").insert({
      user_id: userId,
      message: response.response,
      role: "assistant",
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    captureException(error as Error, {
      component: "nathia-chat",
      action: "handle_chat",
    });
    
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Executar com Sentry wrapper
serve(withSentry(handleChat, {
  dsn: Deno.env.get("SENTRY_DSN"),
  environment: Deno.env.get("ENVIRONMENT") || "production",
  release: Deno.env.get("RELEASE") || "unknown",
}));

