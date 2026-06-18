-- Detay galerisi: galeri_11 … galeri_15 (yalnızca görsel)
alter table public.projects add column if not exists galeri_11 text default '';
alter table public.projects add column if not exists galeri_12 text default '';
alter table public.projects add column if not exists galeri_13 text default '';
alter table public.projects add column if not exists galeri_14 text default '';
alter table public.projects add column if not exists galeri_15 text default '';

comment on column public.projects.galeri_11 is 'Detay galeri 11 — isteğe bağlı';
comment on column public.projects.galeri_12 is 'Detay galeri 12 — isteğe bağlı';
comment on column public.projects.galeri_13 is 'Detay galeri 13 — isteğe bağlı';
comment on column public.projects.galeri_14 is 'Detay galeri 14 — isteğe bağlı';
comment on column public.projects.galeri_15 is 'Detay galeri 15 — isteğe bağlı';
