-- Supabase SQL Editor'da çalıştırın: Zincir (habit) sekmesi tablosu
create table if not exists public.dashboard_habits (
  id         int primary key default 1 check (id = 1),
  payload    jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.dashboard_habits enable row level security;

insert into public.dashboard_habits (id, payload)
values (1, '{}'::jsonb)
on conflict (id) do nothing;
