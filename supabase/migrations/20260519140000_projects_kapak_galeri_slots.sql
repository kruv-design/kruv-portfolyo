-- Kapak + galeri_1 … galeri_8 (hepsi isteğe bağlı text URL)
alter table public.projects add column if not exists kapak text default '';
alter table public.projects add column if not exists galeri_1 text default '';
alter table public.projects add column if not exists galeri_2 text default '';
alter table public.projects add column if not exists galeri_3 text default '';
alter table public.projects add column if not exists galeri_4 text default '';
alter table public.projects add column if not exists galeri_5 text default '';
alter table public.projects add column if not exists galeri_6 text default '';
alter table public.projects add column if not exists galeri_7 text default '';
alter table public.projects add column if not exists galeri_8 text default '';

-- Eski gorsel / gorseller → yeni sütunlar
-- Tek URL gorseller[0] içindeyse → kapak; galeri_1..8 sıradaki dizin öğeleri
update public.projects
set
  kapak = coalesce(
    nullif(trim(kapak), ''),
    nullif(trim(gorsel), ''),
    nullif(gorseller->>0, ''),
    ''
  ),
  galeri_1 = coalesce(nullif(trim(galeri_1), ''), gorseller->>1, ''),
  galeri_2 = coalesce(nullif(trim(galeri_2), ''), gorseller->>2, ''),
  galeri_3 = coalesce(nullif(trim(galeri_3), ''), gorseller->>3, ''),
  galeri_4 = coalesce(nullif(trim(galeri_4), ''), gorseller->>4, ''),
  galeri_5 = coalesce(nullif(trim(galeri_5), ''), gorseller->>5, ''),
  galeri_6 = coalesce(nullif(trim(galeri_6), ''), gorseller->>6, ''),
  galeri_7 = coalesce(nullif(trim(galeri_7), ''), gorseller->>7, ''),
  galeri_8 = coalesce(nullif(trim(galeri_8), ''), gorseller->>8, '');

alter table public.projects drop column if exists gorsel;
alter table public.projects drop column if exists gorseller;

comment on column public.projects.kapak is 'Kapak görseli URL — isteğe bağlı';
comment on column public.projects.galeri_1 is 'Detay galeri 1 — isteğe bağlı';
comment on column public.projects.galeri_2 is 'Detay galeri 2 — isteğe bağlı';
comment on column public.projects.galeri_3 is 'Detay galeri 3 — isteğe bağlı';
