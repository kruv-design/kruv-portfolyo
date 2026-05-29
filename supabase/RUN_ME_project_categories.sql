-- ═══════════════════════════════════════════════════════════
-- İş kategorileri (Packaging dahil) — Supabase SQL Editor → RUN
-- projects.kategori için label değerlerini project_categories tablosundan kopyalayın.
-- ═══════════════════════════════════════════════════════════

create table if not exists public.project_categories (
  slug       text primary key,
  label      text not null unique,
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

insert into public.project_categories (slug, label, sort_order) values
  ('social-media', 'Social media', 10),
  ('branding',     'Branding',     20),
  ('editorial',    'Editorial',    30),
  ('web-design',   'Web design',   40),
  ('packaging',    'Packaging',    50),
  ('motion',       'Motion',       60)
on conflict (slug) do update
  set label = excluded.label,
      sort_order = excluded.sort_order;

comment on table public.project_categories is
  'Canonical iş kategorileri. projects.kategori için Table Editor’da label sütununu kopyalayın.';

comment on column public.projects.kategori is
  'İş kategorisi (ör. Packaging). Geçerli değerler: project_categories.label';

alter table public.project_categories enable row level security;

drop policy if exists "project_categories_public_read" on public.project_categories;
create policy "project_categories_public_read"
  on public.project_categories for select
  using (true);

drop policy if exists "project_categories_authed_write" on public.project_categories;
create policy "project_categories_authed_write"
  on public.project_categories for all
  to authenticated
  using (true) with check (true);
