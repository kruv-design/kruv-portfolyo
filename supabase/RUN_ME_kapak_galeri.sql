-- ═══════════════════════════════════════════════════════════
-- Supabase → SQL Editor → yapıştır → RUN
-- Başarılı olunca Table Editor'da F5 ile yenile
-- Görseller: /admin/projects (Table Editor'da URL yapıştırma)
-- ═══════════════════════════════════════════════════════════

alter table public.projects add column if not exists kapak text default '';
alter table public.projects add column if not exists galeri_1 text default '';
alter table public.projects add column if not exists galeri_2 text default '';
alter table public.projects add column if not exists galeri_3 text default '';
alter table public.projects add column if not exists galeri_4 text default '';
alter table public.projects add column if not exists galeri_5 text default '';
alter table public.projects add column if not exists galeri_6 text default '';
alter table public.projects add column if not exists galeri_7 text default '';
alter table public.projects add column if not exists galeri_8 text default '';

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'projects' and column_name = 'gorseller'
  ) then
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'projects' and column_name = 'gorsel'
    ) then
      update public.projects set
        kapak = coalesce(nullif(trim(kapak), ''), nullif(trim(gorsel), ''), nullif(gorseller->>0, ''), ''),
        galeri_1 = coalesce(nullif(trim(galeri_1), ''), gorseller->>1, ''),
        galeri_2 = coalesce(nullif(trim(galeri_2), ''), gorseller->>2, ''),
        galeri_3 = coalesce(nullif(trim(galeri_3), ''), gorseller->>3, ''),
        galeri_4 = coalesce(nullif(trim(galeri_4), ''), gorseller->>4, ''),
        galeri_5 = coalesce(nullif(trim(galeri_5), ''), gorseller->>5, ''),
        galeri_6 = coalesce(nullif(trim(galeri_6), ''), gorseller->>6, ''),
        galeri_7 = coalesce(nullif(trim(galeri_7), ''), gorseller->>7, ''),
        galeri_8 = coalesce(nullif(trim(galeri_8), ''), gorseller->>8, '');
    else
      update public.projects set
        kapak = coalesce(nullif(trim(kapak), ''), nullif(gorseller->>0, ''), ''),
        galeri_1 = coalesce(nullif(trim(galeri_1), ''), gorseller->>1, ''),
        galeri_2 = coalesce(nullif(trim(galeri_2), ''), gorseller->>2, ''),
        galeri_3 = coalesce(nullif(trim(galeri_3), ''), gorseller->>3, ''),
        galeri_4 = coalesce(nullif(trim(galeri_4), ''), gorseller->>4, ''),
        galeri_5 = coalesce(nullif(trim(galeri_5), ''), gorseller->>5, ''),
        galeri_6 = coalesce(nullif(trim(galeri_6), ''), gorseller->>6, ''),
        galeri_7 = coalesce(nullif(trim(galeri_7), ''), gorseller->>7, ''),
        galeri_8 = coalesce(nullif(trim(galeri_8), ''), gorseller->>8, '');
    end if;
  end if;
end $$;

alter table public.projects drop column if exists gorsel;
alter table public.projects drop column if exists gorseller;

-- Kontrol: kapak + galeri_1…8 görünmeli, gorseller görünmemeli
select column_name
from information_schema.columns
where table_schema = 'public' and table_name = 'projects'
  and (column_name = 'kapak' or column_name like 'galeri_%' or column_name in ('gorsel', 'gorseller'))
order by column_name;
