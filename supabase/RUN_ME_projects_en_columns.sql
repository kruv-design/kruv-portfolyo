-- ═══════════════════════════════════════════════════════════
-- Proje TR/EN — düz sütunlar (JSON yok)
-- Supabase → SQL Editor → RUN (bir kez)
-- ═══════════════════════════════════════════════════════════

alter table public.projects add column if not exists title text default '';
alter table public.projects add column if not exists description text default '';
alter table public.projects add column if not exists category text default '';

comment on column public.projects.baslik is 'TR başlık';
comment on column public.projects.title is 'EN başlık (boşsa baslik)';
comment on column public.projects.aciklama is 'TR kısa açıklama';
comment on column public.projects.description is 'EN kısa açıklama (boşsa aciklama)';
comment on column public.projects.kategori is 'TR kategori';
comment on column public.projects.category is 'EN kategori (boşsa kategori)';
