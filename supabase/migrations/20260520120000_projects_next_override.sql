-- Editör: sonraki proje banner'ında manuel hedef (slug)
alter table public.projects
  add column if not exists next_project_override text default '';

comment on column public.projects.next_project_override is
  'Opsiyonel: proje detay sonu banner''ında gösterilecek sonraki projenin slug''ı';
