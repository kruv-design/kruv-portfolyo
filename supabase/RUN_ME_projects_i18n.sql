-- ═══════════════════════════════════════════════════════════
-- Proje TR/EN metinleri — Supabase SQL Editor → RUN
-- ═══════════════════════════════════════════════════════════

alter table public.projects
  add column if not exists i18n jsonb not null default '{}'::jsonb;

comment on column public.projects.i18n is
  'Çeviriler: { "en": { "baslik", "aciklama", "kategori", "bolumler", "etiketler" } }. Boş EN → TR fallback.';

-- Örnek (slug’ı kendi projenizle değiştirin):
-- update public.projects
-- set i18n = jsonb_build_object(
--   'en', jsonb_build_object(
--     'baslik', 'Marker',
--     'aciklama', 'Brand identity for a specialty coffee roaster.',
--     'kategori', 'Branding'
--   )
-- )
-- where slug = 'marker';
