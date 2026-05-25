-- Detay galerisi: galeri_9, galeri_10 (+ opsiyonel video)
alter table public.projects add column if not exists galeri_9 text default '';
alter table public.projects add column if not exists galeri_9_video text default '';
alter table public.projects add column if not exists galeri_10 text default '';
alter table public.projects add column if not exists galeri_10_video text default '';

comment on column public.projects.galeri_9 is 'Detay galeri 9 — isteğe bağlı';
comment on column public.projects.galeri_10 is 'Detay galeri 10 — isteğe bağlı';
