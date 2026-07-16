-- Protel pitch — Supabase SQL Editor'da bir kez çalıştırın.
-- (supabase/migrations/20260716120000_protel_pitch.sql ile aynı içerik)

-- ── Protel gizli teklif sayfası (/protel) ───────────────────
create table if not exists public.protel_pitch_settings (
  id                    int primary key default 1 check (id = 1),
  hero_title            text not null default 'Protel için',
  hero_intro            text not null default '',
  proposal_title        text not null default 'Ürün UI animasyon video',
  proposal_price        text not null default '',
  proposal_video_url    text not null default '',
  proposal_video_aspect text not null default '16:9',
  process_duration      text not null default '2/3 HAFTA',
  sample_videos         jsonb not null default '[]'::jsonb,
  process_steps         jsonb not null default '[]'::jsonb,
  updated_at            timestamptz not null default now()
);

insert into public.protel_pitch_settings (id, hero_intro, process_steps, sample_videos)
values (
  1,
  'Karmaşık özellikleri etkileyici bir deneyime dönüştürüyoruz.

Ürününüzün nasıl çalıştığını, neden vazgeçilmez olduğunu ve yarattığı farkı görsel bir şölene dönüştürmeye hazır mısınız?',
  '[
    {"title": "Tanışma & Analiz", "description": "Toplantı ile markanızı ve ürününüzü detaylıca öğrenip analiz ediyoruz."},
    {"title": "Üretim", "description": "Videonun temellerini atıyoruz. Görsel kurguyu, ekrandaki yazıları ve seslendirme metinlerini hazırlayıp onayınıza sunuyoruz."},
    {"title": "Prodüksiyon & Seslendirme", "description": "Onayınızın ardından animasyonları hazırlayıp profesyonel seslendirme (voice-over) ile birleştiriyoruz."},
    {"title": "Teslim", "description": "Final kontrollerin ardından videonuzu yayına hazır şekilde teslim ediyoruz."}
  ]'::jsonb,
  '[
    {"title": "UI animasyon örneği", "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=tten-2_fnwkmj", "aspectRatio": "9:16"},
    {"title": "UI animasyon örneği", "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=tten_bj3iyd", "aspectRatio": "16:9"},
    {"title": "UI animasyon örneği", "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Otter_v4_annlwz", "aspectRatio": "16:9"},
    {"title": "Otelinizin Gerçek Potansiyeli", "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Otelinizin_Gerc%CC%A7ek_Potansiyeli_ukgccv", "aspectRatio": "16:9"}
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
