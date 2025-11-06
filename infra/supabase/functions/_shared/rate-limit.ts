/**
 * Rate Limiter - Event-Based (Sliding Window)
 *
 * IMPORTANTE: Usa ANON_KEY (não SERVICE_ROLE) para respeitar RLS
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const LIMITS = {
  chat: { max: 10, windowMs: 60_000 },
  'nat-ai-chat': { max: 10, windowMs: 60_000 },
  'nathia-chat': { max: 10, windowMs: 60_000 },
  dailyPlan: { max: 5, windowMs: 60 * 60 * 1000 },
} as const;

export async function checkRate(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  endpoint: keyof typeof LIMITS
) {
  const { max, windowMs } = LIMITS[endpoint];
  const from = new Date(Date.now() - windowMs).toISOString();

  const { count } = await supabase
    .from('rate_limit_events')
    .select('*', { head: true, count: 'exact' })
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .gte('created_at', from);

  if ((count ?? 0) >= max) {
    return {
      allowed: false,
      resetAt: new Date(Date.now() + windowMs),
    };
  }

  await supabase.from('rate_limit_events').insert({
    user_id: userId,
    endpoint,
  });

  return {
    allowed: true,
    resetAt: new Date(Date.now() + windowMs),
  };
}
