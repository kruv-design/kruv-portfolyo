-- Supabase Dashboard → SQL Editor → Run
--
-- Tabloyu sadeleştirir. Sonuç:
--   kapak
--   galeri_1 … galeri_15        (görsel)
--   galeri_1_video, galeri_5_video (yalnızca 2 video)
--
-- Uygulama zaten bu yapıyı kullanıyor; bu script eski _video sütunlarını siler.

alter table public.projects drop column if exists kapak_video;
alter table public.projects drop column if exists galeri_2_video;
alter table public.projects drop column if exists galeri_3_video;
alter table public.projects drop column if exists galeri_4_video;
alter table public.projects drop column if exists galeri_6_video;
alter table public.projects drop column if exists galeri_7_video;
alter table public.projects drop column if exists galeri_8_video;
alter table public.projects drop column if exists galeri_9_video;
alter table public.projects drop column if exists galeri_10_video;
alter table public.projects drop column if exists galeri_11_video;
alter table public.projects drop column if exists galeri_12_video;
alter table public.projects drop column if exists galeri_13_video;
alter table public.projects drop column if exists galeri_14_video;
alter table public.projects drop column if exists galeri_15_video;
