-- Supabase Dashboard → SQL Editor → Run (opsiyonel; migration yoksa elle çalıştır)
-- Detay galerisi: galeri_11 … galeri_15 (yalnızca görsel)

alter table public.projects add column if not exists galeri_11 text default '';
alter table public.projects add column if not exists galeri_12 text default '';
alter table public.projects add column if not exists galeri_13 text default '';
alter table public.projects add column if not exists galeri_14 text default '';
alter table public.projects add column if not exists galeri_15 text default '';
