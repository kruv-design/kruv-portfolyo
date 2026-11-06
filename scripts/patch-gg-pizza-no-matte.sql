-- GG Pizza: Figma HQ re-export (paspartu kaldırıldı), Cloudinary overwrite v17939544xx
-- Kapak + galeri 1–14 = g01–g15; g16–g24 / kapak-source Cloudinary'den silindi.

-- kapak = g01; galeri = g02…g15 (cover ile tekrar yok)
UPDATE projects SET
  kapak = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793954506/kruv-portfolio/projects/gg-pizza/kapak.png',
  galeri_1 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793954462/kruv-portfolio/projects/gg-pizza/g02.png',
  galeri_2 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793954464/kruv-portfolio/projects/gg-pizza/g03.png',
  galeri_3 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793954465/kruv-portfolio/projects/gg-pizza/g04.png',
  galeri_4 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793954467/kruv-portfolio/projects/gg-pizza/g05.png',
  galeri_5 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793954468/kruv-portfolio/projects/gg-pizza/g06.png',
  galeri_6 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793954468/kruv-portfolio/projects/gg-pizza/g07.png',
  galeri_7 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793954469/kruv-portfolio/projects/gg-pizza/g08.png',
  galeri_8 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793954471/kruv-portfolio/projects/gg-pizza/g09.png',
  galeri_9 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793954471/kruv-portfolio/projects/gg-pizza/g10.png',
  galeri_10 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793954472/kruv-portfolio/projects/gg-pizza/g11.png',
  galeri_11 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793954474/kruv-portfolio/projects/gg-pizza/g12.png',
  galeri_12 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793954474/kruv-portfolio/projects/gg-pizza/g13.png',
  galeri_13 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793954475/kruv-portfolio/projects/gg-pizza/g14.png',
  galeri_14 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793954478/kruv-portfolio/projects/gg-pizza/g15.png',
  galeri_15 = NULL,
  galeri_16 = NULL,
  galeri_17 = NULL,
  galeri_18 = NULL,
  galeri_19 = NULL,
  galeri_20 = NULL,
  galeri_21 = NULL,
  galeri_22 = NULL,
  galeri_23 = NULL,
  galeri_24 = NULL
WHERE slug = 'gg-pizza';

SELECT slug, kapak, galeri_1, galeri_14, galeri_15
FROM projects
WHERE slug = 'gg-pizza';
