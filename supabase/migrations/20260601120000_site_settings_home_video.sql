-- Anasayfa showreel — poster (LCP) + opsiyonel loop video
alter table public.site_settings
  add column if not exists "homeVideoPoster" text not null default '';

alter table public.site_settings
  add column if not exists "homeVideo" text not null default '';
