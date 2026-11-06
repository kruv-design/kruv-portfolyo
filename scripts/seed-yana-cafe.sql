-- Yana Cafe — güvenli seed (önce kolonlar, sonra upsert, sonda kontrol)
-- Supabase → SQL Editor → New query → Run
-- Başarı: alttaki SELECT 1 satır döner (slug = yana-cafe).

-- 1) Eksik kolonlar (yoksa ekle)
alter table public.projects add column if not exists yayinda boolean not null default true;
alter table public.projects add column if not exists title text default '';
alter table public.projects add column if not exists description text default '';
alter table public.projects add column if not exists category text default '';
alter table public.projects add column if not exists next_project_override text default '';
alter table public.projects add column if not exists renk text default '#C8B8A8';
alter table public.projects add column if not exists galeri_1_video text default '';
alter table public.projects add column if not exists galeri_5_video text default '';
alter table public.projects add column if not exists galeri_6 text default '';
alter table public.projects add column if not exists galeri_7 text default '';
alter table public.projects add column if not exists galeri_8 text default '';

-- 2) Upsert
insert into public.projects (
  slug, baslik, title, kategori, category, aciklama, description,
  kapak,
  galeri_1, galeri_2, galeri_3, galeri_4, galeri_5, galeri_6, galeri_7, galeri_8,
  galeri_1_video, galeri_5_video,
  bolumler, etiketler, featured, yayinda, next_project_override, renk, sira
) values (
  'yana-cafe',
  'Yana Cafe',
  'Yana Cafe',
  'Fotoğraf, sosyal medya, hospitality',
  'Photography, social media, hospitality',
  'Yana Cafe için kahve yapım ritüelini merkeze alan bir fotoğraf serisi: çekirdekten demlemeye, dökümden fincana. Sıcak ahşap, koyu tonlar ve el işçiliğiyle markanın specialty dilini sosyal medya ve içerik üretimi için netleştirdik.',
  'For Yana Cafe we built a photography series around the coffee ritual — from bean to brew to pour. Warm wood, deep tones, and handcrafted moments that give the specialty brand a clear language for social and content.',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793629314/kruv-portfolio/projects/yana-cafe/kapak.jpg',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793629075/kruv-portfolio/projects/yana-cafe/g01.jpg',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793629142/kruv-portfolio/projects/yana-cafe/g02.jpg',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793629162/kruv-portfolio/projects/yana-cafe/g03.jpg',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793629184/kruv-portfolio/projects/yana-cafe/g04.jpg',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793629210/kruv-portfolio/projects/yana-cafe/g05.jpg',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793629243/kruv-portfolio/projects/yana-cafe/g06.jpg',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793629302/kruv-portfolio/projects/yana-cafe/g07.jpg',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793629316/kruv-portfolio/projects/yana-cafe/g08.jpg',
  'https://res.cloudinary.com/di0qbhh46/video/upload/v1793629442/kruv-portfolio/projects/yana-cafe/v01.mp4',
  'https://res.cloudinary.com/di0qbhh46/video/upload/v1793629436/kruv-portfolio/projects/yana-cafe/v02.mp4',
  '[]'::jsonb,
  '["Fotoğraf","Sosyal medya","Hospitality"]'::jsonb,
  true,
  true,
  '',
  '#6B4F3A',
  2
)
on conflict (slug) do update set
  baslik = excluded.baslik,
  title = excluded.title,
  kategori = excluded.kategori,
  category = excluded.category,
  aciklama = excluded.aciklama,
  description = excluded.description,
  kapak = excluded.kapak,
  galeri_1 = excluded.galeri_1,
  galeri_2 = excluded.galeri_2,
  galeri_3 = excluded.galeri_3,
  galeri_4 = excluded.galeri_4,
  galeri_5 = excluded.galeri_5,
  galeri_6 = excluded.galeri_6,
  galeri_7 = excluded.galeri_7,
  galeri_8 = excluded.galeri_8,
  galeri_1_video = excluded.galeri_1_video,
  galeri_5_video = excluded.galeri_5_video,
  etiketler = excluded.etiketler,
  featured = excluded.featured,
  yayinda = true,
  renk = excluded.renk,
  sira = excluded.sira,
  updated_at = now();

-- 3) Kontrol — 1 satır görmelisin
select slug, baslik, yayinda, featured, sira, kapak is not null as has_kapak,
       galeri_1_video <> '' as has_v1, galeri_5_video <> '' as has_v2
from public.projects
where slug = 'yana-cafe';
