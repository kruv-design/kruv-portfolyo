-- ═══════════════════════════════════════════════════════════
-- KRUV Portfolyo CMS — Supabase schema
-- Run once in Supabase SQL Editor (or: supabase db push).
-- ═══════════════════════════════════════════════════════════

-- Extensions
create extension if not exists "uuid-ossp";

-- ── Projects ───────────────────────────────────────────────
create table if not exists public.projects (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  baslik      text not null,
  kategori    text not null,
  aciklama    text default '',
  kapak       text default '',
  galeri_1    text default '',
  galeri_2    text default '',
  galeri_3    text default '',
  galeri_4    text default '',
  galeri_5    text default '',
  galeri_6    text default '',
  galeri_7    text default '',
  galeri_8    text default '',
  bolumler    jsonb not null default '[]'::jsonb,
  etiketler   jsonb not null default '[]'::jsonb,
  yil         text default '',
  musteri     text default '',
  sure        text default '',
  link        text default '',
  featured    boolean not null default false,
  renk        text default '#C8B8A8',
  sira        int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists projects_sira_idx     on public.projects (sira);
create index if not exists projects_kategori_idx on public.projects (kategori);
create index if not exists projects_featured_idx on public.projects (featured);

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_touch on public.projects;
create trigger projects_touch
  before update on public.projects
  for each row execute function public.touch_updated_at();

-- ── Settings (singleton row) ───────────────────────────────
create table if not exists public.site_settings (
  id          int primary key default 1,
  "siteAdi"   text not null default 'kruv.',
  tagline     text not null default 'Seçilmiş projeler & çalışmalar',
  "footerYazi" text not null default 'kruv. — portfolyo',
  "instagramUrl" text not null default '',
  "xUrl" text not null default '',
  "linkedinUrl" text not null default '',
  "behanceUrl" text not null default '',
  "dribbbleUrl" text not null default '',
  "youtubeUrl" text not null default '',
  "pinterestUrl" text not null default '',
  "githubUrl" text not null default '',
  updated_at  timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into public.site_settings (id) values (1)
  on conflict (id) do nothing;

-- Mevcut projeler: sosyal sütunları yoksa ekle (yeniden çalıştırılabilir)
alter table public.site_settings add column if not exists "instagramUrl" text not null default '';
alter table public.site_settings add column if not exists "xUrl" text not null default '';
alter table public.site_settings add column if not exists "linkedinUrl" text not null default '';
alter table public.site_settings add column if not exists "behanceUrl" text not null default '';
alter table public.site_settings add column if not exists "dribbbleUrl" text not null default '';
alter table public.site_settings add column if not exists "youtubeUrl" text not null default '';
alter table public.site_settings add column if not exists "pinterestUrl" text not null default '';
alter table public.site_settings add column if not exists "githubUrl" text not null default '';

drop trigger if exists settings_touch on public.site_settings;
create trigger settings_touch
  before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ═══════════════════════════════════════════════════════════
-- Row Level Security
-- ═══════════════════════════════════════════════════════════
alter table public.projects      enable row level security;
alter table public.site_settings enable row level security;

-- Public read
drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read"
  on public.projects for select
  using (true);

drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read"
  on public.site_settings for select
  using (true);

-- Authenticated write (any authed user is treated as admin — flip to
-- user metadata role check if you add non-admin users later)
drop policy if exists "projects_authed_write" on public.projects;
create policy "projects_authed_write"
  on public.projects for all
  to authenticated
  using (true) with check (true);

drop policy if exists "settings_authed_write" on public.site_settings;
create policy "settings_authed_write"
  on public.site_settings for all
  to authenticated
  using (true) with check (true);

-- ── Contact inquiries (taslak + tam gönderim; API service_role yazar) ──
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
