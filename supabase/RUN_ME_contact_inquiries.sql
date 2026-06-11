-- ═══════════════════════════════════════════════════════════
-- İletişim formu — Supabase SQL Editor → RUN
-- API (service_role) yazar; admin panelden okunur.
-- E-posta gönderimi için Resend env değişkenleri gerekir (ayrı).
-- ═══════════════════════════════════════════════════════════

create table if not exists public.contact_inquiries (
  id uuid primary key default uuid_generate_v4(),
  session_id text not null unique,
  status text not null default 'partial'
    check (status in ('partial', 'submitted')),
  payload jsonb not null default '{}'::jsonb,
  email text,
  hubspot_synced boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_inquiries_status_idx
  on public.contact_inquiries (status);
create index if not exists contact_inquiries_updated_idx
  on public.contact_inquiries (updated_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contact_inquiries_touch on public.contact_inquiries;
create trigger contact_inquiries_touch
  before update on public.contact_inquiries
  for each row execute function public.touch_updated_at();

alter table public.contact_inquiries enable row level security;

drop policy if exists "contact_inquiries_authed_read" on public.contact_inquiries;
create policy "contact_inquiries_authed_read"
  on public.contact_inquiries for select
  to authenticated
  using (true);
