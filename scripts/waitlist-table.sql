-- Olly bekleme listesi — Supabase SQL Editor veya migration olarak çalıştırın.
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  ip_hash text not null,
  constraint waitlist_email_key unique (email)
);

create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);
create index if not exists waitlist_ip_hash_idx on public.waitlist (ip_hash);

alter table public.waitlist enable row level security;
