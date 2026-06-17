-- Birinci taraf site analitiği (consent sonrası /api/track ile yazılır)
create table if not exists public.site_events (
  id          bigint generated always as identity primary key,
  session_id  text not null,
  event_name  text not null,
  page        text,
  props       jsonb,
  referrer    text,
  ua          text,
  ip_hash     text,
  created_at  timestamptz not null default now()
);

create index if not exists site_events_created_idx
  on public.site_events (created_at desc);

create index if not exists site_events_event_name_idx
  on public.site_events (event_name);

create index if not exists site_events_session_idx
  on public.site_events (session_id);

alter table public.site_events enable row level security;

-- Yazma yalnızca service_role (/api/track); anon/authenticated insert yok
drop policy if exists "site_events_authed_read" on public.site_events;
create policy "site_events_authed_read"
  on public.site_events for select
  to authenticated
  using (true);
