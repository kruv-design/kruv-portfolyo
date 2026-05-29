-- Proje metinleri: TR varsayılan sütunlar, EN isteğe bağlı `i18n.en` jsonb

alter table public.projects
  add column if not exists i18n jsonb not null default '{}'::jsonb;

comment on column public.projects.i18n is
  'Çeviriler: { "en": { "baslik", "aciklama", "kategori", "bolumler", "etiketler" } }. Boş EN → TR fallback.';
