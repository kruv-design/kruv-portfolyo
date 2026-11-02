-- Yana Cafe — 2 video yan yana (galeri_1_video + galeri_5_video)
UPDATE projects SET
  galeri_1_video = 'https://res.cloudinary.com/di0qbhh46/video/upload/v1793629442/kruv-portfolio/projects/yana-cafe/v01.mp4',
  galeri_5_video = 'https://res.cloudinary.com/di0qbhh46/video/upload/v1793629436/kruv-portfolio/projects/yana-cafe/v02.mp4',
  kategori = 'Fotoğraf, sosyal medya, hospitality',
  etiketler = '["Fotoğraf","Sosyal medya","Hospitality"]'::jsonb
WHERE slug = 'yana-cafe';
