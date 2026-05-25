-- Opsiyonel video URL'leri (boş = yalnızca poster görseli)
alter table public.projects add column if not exists kapak_video text default '';
alter table public.projects add column if not exists galeri_1_video text default '';
alter table public.projects add column if not exists galeri_2_video text default '';
alter table public.projects add column if not exists galeri_3_video text default '';
alter table public.projects add column if not exists galeri_4_video text default '';
alter table public.projects add column if not exists galeri_5_video text default '';
alter table public.projects add column if not exists galeri_6_video text default '';
alter table public.projects add column if not exists galeri_7_video text default '';
alter table public.projects add column if not exists galeri_8_video text default '';

comment on column public.projects.kapak_video is 'Kapak loop videosu URL — boş: yalnızca kapak poster';
comment on column public.projects.galeri_1_video is 'Galeri 1 loop videosu — boş: yalnızca galeri_1 poster';
