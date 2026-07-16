-- Protel pitch — Supabase SQL Editor'da bir kez çalıştırın.
-- (supabase/migrations/20260716120000_protel_pitch.sql ile aynı içerik)

-- ── Protel gizli teklif sayfası (/protel) ───────────────────
create table if not exists public.protel_pitch_settings (
  id                    int primary key default 1 check (id = 1),
  hero_title            text not null default 'Protel için',
  hero_intro            text not null default '',
  proposal_title        text not null default 'Ürün UI animasyon video',
  proposal_video_url    text not null default '',
  proposal_video_aspect text not null default '16:9',
  sample_videos         jsonb not null default '[]'::jsonb,
  process_steps         jsonb not null default '[]'::jsonb,
  updated_at            timestamptz not null default now()
);

insert into public.protel_pitch_settings (id, hero_intro, process_steps)
values (
  1,
  'Ürününüzü anlatan, kullanıcıyı yönlendiren UI animasyon videoları üretiyoruz.',
  '[
    {"title": "Brief & ürünü anlama", "description": "İyi bir brief alma ve ürünü tam olarak anlama."},
    {"title": "Script + voice-over", "description": "Senaryo ve seslendirme metni yazımı."},
    {"title": "Storyboard", "description": "Storyboard oluşturulması."},
    {"title": "Animasyon sample", "description": "Örnek animasyon üretimi ve onay."},
    {"title": "Teslim", "description": "Final animasyon teslimi."}
  ]'::jsonb
)
on conflict (id) do nothing;

drop trigger if exists protel_pitch_settings_touch on public.protel_pitch_settings;
create trigger protel_pitch_settings_touch
  before update on public.protel_pitch_settings
  for each row execute function public.touch_updated_at();

create table if not exists public.protel_brands (
  id              uuid primary key default uuid_generate_v4(),
  slug            text unique not null,
  name            text not null,
  sort_order      int not null default 0,
  metrics         jsonb not null default '[]'::jsonb,
  social_accounts jsonb not null default '[]'::jsonb,
  video_1_title   text not null default '',
  video_1_url     text not null default '',
  video_1_aspect  text not null default '16:9',
  video_2_title   text not null default '',
  video_2_url     text not null default '',
  video_2_aspect  text not null default '16:9',
  updated_at      timestamptz not null default now()
);

create index if not exists protel_brands_sort_idx on public.protel_brands (sort_order);

insert into public.protel_brands (slug, name, sort_order) values
  ('ggpizza',            'GG Pizza',             1),
  ('jungleous',          'Jungleous',            2),
  ('bulung-lojistik',    'Bulung Lojistik',      3),
  ('the-scholar-school', 'The Scholar School',   4)
on conflict (slug) do nothing;

drop trigger if exists protel_brands_touch on public.protel_brands;
create trigger protel_brands_touch
  before update on public.protel_brands
  for each row execute function public.touch_updated_at();

alter table public.protel_pitch_settings enable row level security;
alter table public.protel_brands enable row level security;

drop policy if exists "protel_pitch_settings_public_read" on public.protel_pitch_settings;
create policy "protel_pitch_settings_public_read"
  on public.protel_pitch_settings for select
  using (true);

drop policy if exists "protel_pitch_settings_authed_write" on public.protel_pitch_settings;
create policy "protel_pitch_settings_authed_write"
  on public.protel_pitch_settings for all
  to authenticated
  using (true) with check (true);

drop policy if exists "protel_brands_public_read" on public.protel_brands;
create policy "protel_brands_public_read"
  on public.protel_brands for select
  using (true);

drop policy if exists "protel_brands_authed_write" on public.protel_brands;
create policy "protel_brands_authed_write"
  on public.protel_brands for all
  to authenticated
  using (true) with check (true);
