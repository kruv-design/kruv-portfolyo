-- Pricing Coach — Figma 5881:1598 (PC 1–12)
-- Kapak: PC 6 (folder + Instagram mockup — ekteki görselin HQ hali)
-- Supabase → SQL Editor → Run
-- Başarı: alttaki SELECT 1 satır döner.

alter table public.projects add column if not exists yayinda boolean not null default true;
alter table public.projects add column if not exists title text default '';
alter table public.projects add column if not exists description text default '';
alter table public.projects add column if not exists category text default '';
alter table public.projects add column if not exists renk text default '#C8B8A8';
alter table public.projects add column if not exists galeri_9 text default '';
alter table public.projects add column if not exists galeri_10 text default '';
alter table public.projects add column if not exists galeri_11 text default '';
alter table public.projects add column if not exists galeri_12 text default '';

insert into public.projects (
  slug, baslik, title, kategori, category, aciklama, description,
  kapak,
  galeri_1, galeri_2, galeri_3, galeri_4, galeri_5,
  galeri_6, galeri_7, galeri_8, galeri_9, galeri_10,
  galeri_11, galeri_12,
  bolumler, etiketler, featured, yayinda, renk, sira
) values (
  'pricing-coach',
  'Pricing Coach',
  'Pricing Coach',
  'Sosyal medya, marka kimliği, hospitality',
  'Social media, brand identity, hospitality',
  'Pricing Coach için otel gelir yönetimi odaklı bir sosyal medya ve marka dili kurduk: mor–siyah palet, LinkedIn/Instagram içerik sistemi ve ürün hikâyesini taşıyan mockup’lar.',
  'For Pricing Coach we built a social and brand language around hotel revenue management — a purple–black system, LinkedIn/Instagram content, and product storytelling through mockups.',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793955720/kruv-portfolio/projects/pricing-coach/kapak.png',
  -- Galeri: PC1–5, PC7–12 (PC6 = kapak, tekrar yok)
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793955719/kruv-portfolio/projects/pricing-coach/g01.png',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793955721/kruv-portfolio/projects/pricing-coach/g02.png',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793955722/kruv-portfolio/projects/pricing-coach/g03.png',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793955723/kruv-portfolio/projects/pricing-coach/g04.png',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793955723/kruv-portfolio/projects/pricing-coach/g05.png',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793955725/kruv-portfolio/projects/pricing-coach/g07.png',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793955725/kruv-portfolio/projects/pricing-coach/g08.png',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793955725/kruv-portfolio/projects/pricing-coach/g09.png',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793955727/kruv-portfolio/projects/pricing-coach/g10.png',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793955727/kruv-portfolio/projects/pricing-coach/g11.png',
  'https://res.cloudinary.com/di0qbhh46/image/upload/v1793955728/kruv-portfolio/projects/pricing-coach/g12.png',
  '',
  '[]'::jsonb,
  '["Sosyal medya","Marka kimliği","Hospitality"]'::jsonb,
  true,
  true,
  '#6B21A8',
  1
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
  galeri_9 = excluded.galeri_9,
  galeri_10 = excluded.galeri_10,
  galeri_11 = excluded.galeri_11,
  galeri_12 = excluded.galeri_12,
  etiketler = excluded.etiketler,
  featured = excluded.featured,
  yayinda = true,
  renk = excluded.renk,
  sira = excluded.sira,
  updated_at = now();

select slug, baslik, yayinda, featured, sira, kapak
from public.projects
where slug = 'pricing-coach';
