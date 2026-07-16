-- Pricing Coach müşteri videoları
insert into public.protel_brands (
  slug,
  name,
  sort_order,
  video_1_title,
  video_1_url,
  video_1_aspect,
  video_2_title,
  video_2_url,
  video_2_aspect
)
values (
  'pricing-coach',
  'Pricing Coach',
  0,
  'Pricing Coach Reel',
  'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=09-03_pc_reel_dto7xl',
  '9:16',
  'İnsanların elinden işini mi alıyor?',
  'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=insanlar%C4%B1n_elinden_isini_mi_aliyor-_en_pt6cl9',
  '9:16'
)
on conflict (slug) do update set
  name = excluded.name,
  sort_order = excluded.sort_order,
  video_1_title = excluded.video_1_title,
  video_1_url = excluded.video_1_url,
  video_1_aspect = excluded.video_1_aspect,
  video_2_title = excluded.video_2_title,
  video_2_url = excluded.video_2_url,
  video_2_aspect = excluded.video_2_aspect;
