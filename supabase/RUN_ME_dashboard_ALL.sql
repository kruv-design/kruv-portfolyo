-- Dashboard paneli — Supabase SQL Editor'da bir kez çalıştırın.
-- İkisi de gerekli: Mali Tablolar + Project Pompei

create table if not exists public.dashboard_finance (
  id         int primary key default 1 check (id = 1),
  payload    jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.dashboard_finance enable row level security;

insert into public.dashboard_finance (id, payload)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

create table if not exists public.dashboard_pompei (
  id         int primary key default 1 check (id = 1),
  payload    jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.dashboard_pompei enable row level security;

insert into public.dashboard_pompei (id, payload)
values (1, '{}'::jsonb)
on conflict (id) do nothing;
