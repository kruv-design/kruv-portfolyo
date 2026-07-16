-- Bulung Lojistik müşteri videoları
update public.protel_brands
set
  video_1_title = 'Bulung Safety',
  video_1_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Bulung_Safety_ftvgc2',
  video_1_aspect = '9:16',
  video_2_title = 'İstanbul – Viyana',
  video_2_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Istanbul-Viyana_qcmftc',
  video_2_aspect = '16:9'
where slug = 'bulung-lojistik';
