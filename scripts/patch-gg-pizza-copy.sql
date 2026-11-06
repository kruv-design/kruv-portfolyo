-- GG Pizza — açıklama / kategori / etiketler (sosyal medya önde)
update public.projects
set
  kategori = 'Sosyal medya, video, fotoğraf, marka kimliği',
  category = 'Social media, video, photography, brand identity',
  aciklama = 'GG Pizza’nın sosyal medya, video ve fotoğraf iletişimini merkeze alıyoruz; içerik üretimi ve günlük feed yönetimi asıl işimiz. Marka kimliği, ambalaj ve etkinlik çalışmaları bu hikâyeyi destekleyen ikinci planda.',
  description = 'For GG Pizza we put social media, video, and photography communication first — content production and day-to-day feed management are the core. Brand identity, packaging, and event work sit in a supporting role.',
  etiketler = '["Sosyal medya","Marka kimliği","Ambalaj"]'::jsonb
where slug = 'gg-pizza';
