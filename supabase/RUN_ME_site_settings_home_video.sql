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
--
-- Kontrol: homeVideo = video public_id veya res.cloudinary.com/.../video/upload/... MP4 URL.
-- player.cloudinary.com/embed/... linki HTML5 video ile çalışmaz (kod embed’i MP4’e çevirir).
-- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (.env / Vercel) tanımlı olmalı.
