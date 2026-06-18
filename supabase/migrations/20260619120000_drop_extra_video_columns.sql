-- Eski per-slot video sütunlarını kaldır.
-- Kalacaklar: kapak, galeri_1…15, galeri_1_video, galeri_5_video

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

comment on column public.projects.galeri_1_video is 'Görsel 1: opsiyonel video (görsel yerine de kullanılabilir)';
comment on column public.projects.galeri_5_video is 'Görsel 5: opsiyonel loop video (poster galeri_5)';
