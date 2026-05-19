-- Backfill null / invalid JSON on projects (safe to re-run)
update public.projects
set
  gorseller = coalesce(gorseller, '[]'::jsonb),
  bolumler  = coalesce(bolumler, '[]'::jsonb),
  etiketler = coalesce(etiketler, '[]'::jsonb)
where gorseller is null or bolumler is null or etiketler is null;

-- Ensure NOT NULL + defaults (no-op if already applied)
alter table public.projects
  alter column gorseller set default '[]'::jsonb,
  alter column bolumler set default '[]'::jsonb,
  alter column etiketler set default '[]'::jsonb;

alter table public.projects
  alter column gorseller set not null,
  alter column bolumler set not null,
  alter column etiketler set not null;

comment on column public.projects.gorseller is 'Detay galerisi — URL dizisi. Boş: []';
comment on column public.projects.bolumler is 'Detay metin bölümleri — [{baslik, metin}]. Boş: []';
comment on column public.projects.etiketler is 'Detay etiket chip''leri — metin dizisi. Boş: []';
comment on column public.projects.featured is 'Ana sayfa öne çıkan grid';
comment on column public.projects.sira is 'Sıralama (admin sürükle-bırak)';
