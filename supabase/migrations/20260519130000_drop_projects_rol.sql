-- projects.rol artık kullanılmıyor
alter table public.projects drop column if exists rol;
