-- Anlık ziyaretçi (heartbeat /api/presence ile güncellenir)
create table if not exists public.site_presence (
  session_id    text primary key,
  page          text not null,
  last_seen_at  timestamptz not null default now()
);

create index if not exists site_presence_last_seen_idx
  on public.site_presence (last_seen_at desc);

create index if not exists site_presence_page_idx
  on public.site_presence (page);

alter table public.site_presence enable row level security;

drop policy if exists "site_presence_authed_read" on public.site_presence;
create policy "site_presence_authed_read"
  on public.site_presence for select
  to authenticated
  using (true);
