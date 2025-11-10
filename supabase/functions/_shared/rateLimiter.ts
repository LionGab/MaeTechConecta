/**
 * Rate Limiter - Event-Based
 *
 * Modelo event-based: um registro por request
 * Usa janela deslizante (sliding window) para rate limiting preciso
 *
 * IMPORTANTE: Usa ANON_KEY (não SERVICE_ROLE) para respeitar RLS
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// =====================================================
// CONFIGURAÇÕES DE LIMITES
// =====================================================

interface RateLimitConfig {
  max: number;
  windowMs: number;
}

const LIMITS: Record<string, RateLimitConfig> = {
  chat: { max: 10, windowMs: 60_000 }, // 10 req/min
  'nat-ai-chat': { max: 10, windowMs: 60_000 }, // 10 req/min
  'nathia-chat': { max: 10, windowMs: 60_000 }, // 10 req/min
  dailyPlan: { max: 5, windowMs: 60 * 60 * 1000 }, // 5 req/hora
};

// =====================================================
// TIPOS
// =====================================================

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

// =====================================================
// FUNÇÃO PRINCIPAL: CHECK RATE LIMIT
// =====================================================

/**
 * Verifica rate limit para um usuário e endpoint
 *
 * @param userId - ID do usuário
 * @param endpoint - Nome do endpoint (chave em LIMITS)
 * @param authHeader - Authorization header do request (para usar ANON_KEY com RLS)
 * @returns Resultado do rate limit check
 */
export async function checkRateLimit(
  userId: string,
  endpoint: keyof typeof LIMITS,
  authHeader: string | null
): Promise<RateLimitResult> {
  const config = LIMITS[endpoint];

  if (!config) {
    // Se endpoint não configurado, permite (log para debug)
    console.warn(`Rate limit não configurado para endpoint: ${endpoint}`);
    return {
      allowed: true,
      remaining: Infinity,
      resetAt: new Date(Date.now() + config.windowMs),
    };
  }

  const { max, windowMs } = config;
  const now = Date.now();
  const windowStart = new Date(now - windowMs);

  // Criar cliente Supabase com ANON_KEY + Authorization header
  // Isso respeita RLS e não bypassa segurança
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('SUPABASE_URL ou SUPABASE_ANON_KEY não configurados');
    // Em caso de erro de config, permite (fail open para não quebrar)
    return {
      allowed: true,
      remaining: max,
      resetAt: new Date(now + windowMs),
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
  });

  // Contar eventos no período da janela
  const { count, error } = await supabase
    .from('rate_limit_events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .gte('created_at', windowStart.toISOString());

  if (error) {
    console.error('Erro ao verificar rate limit:', error);
    // Fail open: permite em caso de erro
    return {
      allowed: true,
      remaining: max,
      resetAt: new Date(now + windowMs),
    };
  }

  const currentCount = count ?? 0;
  const allowed = currentCount < max;

  // Se permitido, registrar o evento ANTES de retornar
  if (allowed) {
    const { error: insertError } = await supabase.from('rate_limit_events').insert({
      user_id: userId,
      endpoint,
    });

    if (insertError) {
      console.error('Erro ao registrar evento de rate limit:', insertError);
      // Não falha a requisição por erro de registro
    }
  }

  return {
    allowed,
    remaining: Math.max(0, max - currentCount - (allowed ? 1 : 0)),
    resetAt: new Date(now + windowMs),
  };
}
