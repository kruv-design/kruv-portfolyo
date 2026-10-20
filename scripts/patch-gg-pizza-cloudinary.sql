-- GG Pizza: kapak + galeri → Cloudinary (Supabase SQL Editor)
update projects set
  kapak = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1792473758/kruv-portfolio/projects/gg-pizza/kapak.png',
  galeri_1 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1792473757/kruv-portfolio/projects/gg-pizza/g01.png',
  galeri_2 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1792473767/kruv-portfolio/projects/gg-pizza/g02.png',
  galeri_3 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1792473756/kruv-portfolio/projects/gg-pizza/g03.png',
  galeri_4 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1792473756/kruv-portfolio/projects/gg-pizza/g04.png',
  galeri_5 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1792473768/kruv-portfolio/projects/gg-pizza/g05.png',
  galeri_6 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1792473768/kruv-portfolio/projects/gg-pizza/g06.png',
  galeri_7 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1792473768/kruv-portfolio/projects/gg-pizza/g07.png',
  galeri_8 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1792473769/kruv-portfolio/projects/gg-pizza/g08.png',
  galeri_9 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1792473769/kruv-portfolio/projects/gg-pizza/g09.png',
  galeri_10 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1792473773/kruv-portfolio/projects/gg-pizza/g10.png',
  galeri_11 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1792473774/kruv-portfolio/projects/gg-pizza/g11.png',
  galeri_12 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1792473773/kruv-portfolio/projects/gg-pizza/g12.png',
  galeri_13 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1792473774/kruv-portfolio/projects/gg-pizza/g13.png',
  galeri_14 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1792473774/kruv-portfolio/projects/gg-pizza/g14.png'
where slug = 'gg-pizza';
