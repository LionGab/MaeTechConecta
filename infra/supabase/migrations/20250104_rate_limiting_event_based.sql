-- Rate Limiting Event-Based (Sliding Window)
-- Um registro por request para rate limiting preciso

create table if not exists public.rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_rl_user_ep_time
  on public.rate_limit_events (user_id, endpoint, created_at desc);

-- RLS: Users só podem ver seus próprios eventos
alter table public.rate_limit_events enable row level security;

create policy "user_read_own_rate_events"
  on public.rate_limit_events for select
  to authenticated
  using (auth.uid() = user_id);

create policy "user_insert_own_rate_events"
  on public.rate_limit_events for insert
  to authenticated
  with check (auth.uid() = user_id);

