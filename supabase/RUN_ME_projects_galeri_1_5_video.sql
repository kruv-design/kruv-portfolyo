-- Görsel 1 ve Görsel 5 opsiyonel video sütunları (admin “Video ekle”)
alter table public.projects add column if not exists galeri_1_video text default '';
alter table public.projects add column if not exists galeri_5_video text default '';

comment on column public.projects.galeri_1_video is 'Görsel 1: opsiyonel video (görsel yerine de kullanılabilir)';
comment on column public.projects.galeri_5_video is 'Görsel 5: opsiyonel loop video (poster galeri_5)';

-- PostgREST şema önbelleği
notify pgrst, 'reload schema';
