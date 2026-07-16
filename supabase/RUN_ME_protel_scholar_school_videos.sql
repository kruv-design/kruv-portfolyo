-- The Scholar School müşteri videoları
update public.protel_brands
set
  video_1_title = 'İnsanların elinden işini mi alıyor?',
  video_1_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=insanlar%C4%B1n_elinden_isini_mi_aliyor-_en_pt6cl9',
  video_1_aspect = '9:16',
  video_2_title = 'The Scholar School',
  video_2_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=TSS-W2-THURSDAY_jg6m09',
  video_2_aspect = '9:16'
where slug = 'the-scholar-school';
