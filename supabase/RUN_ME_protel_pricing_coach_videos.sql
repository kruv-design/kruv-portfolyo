-- Pricing Coach müşteri videoları + Instagram
insert into public.protel_brands (
  slug,
  name,
  sort_order,
  video_1_title,
  video_1_url,
  video_1_aspect,
  video_2_title,
  video_2_url,
  video_2_aspect,
  social_accounts
)
values (
  'pricing-coach',
  'Pricing Coach',
  0,
  'Butik Oteller',
  'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Butik_Oteller_hykrwc',
  '9:16',
  'İnsanların elinden işini mi alıyor?',
  'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=insanlar%C4%B1n_elinden_isini_mi_aliyor-_en_pt6cl9',
  '9:16',
  '[
    {"platform": "Instagram", "handle": "@pricing_coach", "url": "https://www.instagram.com/pricing_coach/"}
  ]'::jsonb
)
on conflict (slug) do update set
  name = excluded.name,
  sort_order = excluded.sort_order,
  video_1_title = excluded.video_1_title,
  video_1_url = excluded.video_1_url,
  video_1_aspect = excluded.video_1_aspect,
  video_2_title = excluded.video_2_title,
  video_2_url = excluded.video_2_url,
  video_2_aspect = excluded.video_2_aspect,
  social_accounts = excluded.social_accounts;
