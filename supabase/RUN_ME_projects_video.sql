-- Supabase SQL Editor → Run (video sütunları)
alter table public.projects add column if not exists kapak_video text default '';
alter table public.projects add column if not exists galeri_1_video text default '';
alter table public.projects add column if not exists galeri_2_video text default '';
alter table public.projects add column if not exists galeri_3_video text default '';
alter table public.projects add column if not exists galeri_4_video text default '';
alter table public.projects add column if not exists galeri_5_video text default '';
alter table public.projects add column if not exists galeri_6_video text default '';
alter table public.projects add column if not exists galeri_7_video text default '';
alter table public.projects add column if not exists galeri_8_video text default '';
