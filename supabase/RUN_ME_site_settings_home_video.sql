-- ═══════════════════════════════════════════════════════════
-- Anasayfa showreel — site_settings (tek satır, id = 1)
-- Supabase → SQL Editor → RUN (bir kez)
-- ═══════════════════════════════════════════════════════════

alter table public.site_settings
  add column if not exists "homeVideoPoster" text not null default '';

alter table public.site_settings
  add column if not exists "homeVideo" text not null default '';

-- Örnek (Cloudinary public_id — kendi id’lerinle değiştir):
-- update public.site_settings
-- set
--   "homeVideoPoster" = 'kruv-portfolio/home-showreel-poster',
--   "homeVideo" = 'kruv-portfolio/home-showreel'
-- where id = 1;
