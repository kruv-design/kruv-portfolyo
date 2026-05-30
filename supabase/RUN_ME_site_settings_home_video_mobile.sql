-- ═══════════════════════════════════════════════════════════
-- Anasayfa showreel — MOBİL (web alanları ayrı kalır)
-- Supabase → SQL Editor → RUN (bir kez)
-- ═══════════════════════════════════════════════════════════

alter table public.site_settings
  add column if not exists "homeVideoPosterMobile" text not null default '';

alter table public.site_settings
  add column if not exists "homeVideoMobile" text not null default '';

-- Table Editor → site_settings → id = 1
--   homeVideoPoster / homeVideo        → masaüstü (web)
--   homeVideoPosterMobile / homeVideoMobile → telefon
