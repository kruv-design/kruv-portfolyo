-- Anasayfa showreel — mobil (web: homeVideoPoster / homeVideo)
alter table public.site_settings
  add column if not exists "homeVideoPosterMobile" text not null default '';

alter table public.site_settings
  add column if not exists "homeVideoMobile" text not null default '';
