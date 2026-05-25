-- yil, musteri, sure, rol — artık kullanılmıyor
alter table public.projects drop column if exists yil;
alter table public.projects drop column if exists musteri;
alter table public.projects drop column if exists sure;
alter table public.projects drop column if exists rol;
