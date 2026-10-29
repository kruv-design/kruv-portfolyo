-- GG Pizza: Figma sunum galerisi (GG48↓ sol + sağ kolon) → Cloudinary
-- Supabase SQL Editor'da tek seferde çalıştır.

alter table public.projects add column if not exists galeri_16 text default '';
alter table public.projects add column if not exists galeri_17 text default '';
alter table public.projects add column if not exists galeri_18 text default '';
alter table public.projects add column if not exists galeri_19 text default '';
alter table public.projects add column if not exists galeri_20 text default '';
alter table public.projects add column if not exists galeri_21 text default '';
alter table public.projects add column if not exists galeri_22 text default '';
alter table public.projects add column if not exists galeri_23 text default '';
alter table public.projects add column if not exists galeri_24 text default '';

update public.projects set
  kapak = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793313787/kruv-portfolio/projects/gg-pizza/kapak.png',
  galeri_1 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312700/kruv-portfolio/projects/gg-pizza/g02.png',
  galeri_2 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312702/kruv-portfolio/projects/gg-pizza/g03.png',
  galeri_3 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312701/kruv-portfolio/projects/gg-pizza/g04.png',
  galeri_4 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312703/kruv-portfolio/projects/gg-pizza/g05.png',
  galeri_5 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312703/kruv-portfolio/projects/gg-pizza/g06.png',
  galeri_6 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312737/kruv-portfolio/projects/gg-pizza/g07.png',
  galeri_7 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312737/kruv-portfolio/projects/gg-pizza/g08.png',
  galeri_8 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312738/kruv-portfolio/projects/gg-pizza/g09.png',
  galeri_9 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312740/kruv-portfolio/projects/gg-pizza/g10.png',
  galeri_10 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312740/kruv-portfolio/projects/gg-pizza/g11.png',
  galeri_11 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312740/kruv-portfolio/projects/gg-pizza/g12.png',
  galeri_12 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312767/kruv-portfolio/projects/gg-pizza/g13.png',
  galeri_13 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312768/kruv-portfolio/projects/gg-pizza/g14.png',
  galeri_14 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312768/kruv-portfolio/projects/gg-pizza/g15.png',
  galeri_15 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312769/kruv-portfolio/projects/gg-pizza/g16.png',
  galeri_16 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312769/kruv-portfolio/projects/gg-pizza/g17.png',
  galeri_17 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312770/kruv-portfolio/projects/gg-pizza/g18.png',
  galeri_18 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312805/kruv-portfolio/projects/gg-pizza/g19.png',
  galeri_19 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312805/kruv-portfolio/projects/gg-pizza/g20.png',
  galeri_20 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312806/kruv-portfolio/projects/gg-pizza/g21.png',
  galeri_21 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312806/kruv-portfolio/projects/gg-pizza/g22.png',
  galeri_22 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312807/kruv-portfolio/projects/gg-pizza/g23.png',
  galeri_23 = 'https://res.cloudinary.com/di0qbhh46/image/upload/v1793312809/kruv-portfolio/projects/gg-pizza/g24.png',
  galeri_24 = ''
where slug = 'gg-pizza';
