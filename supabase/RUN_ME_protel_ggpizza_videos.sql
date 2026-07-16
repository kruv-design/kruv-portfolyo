-- GG Pizza müşteri videoları
update public.protel_brands
set
  video_1_title = 'GG Pizza',
  video_1_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=GG_6_rdirzm',
  video_1_aspect = '9:16',
  video_2_title = 'Food is Art',
  video_2_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Food_is_art_yx3vep',
  video_2_aspect = '9:16'
where slug = 'ggpizza';
