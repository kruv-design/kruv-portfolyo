-- Jungleous müşteri videoları
update public.protel_brands
set
  video_1_title = 'Jungleous Kampanya',
  video_1_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Jungleous_Kampanya_nb7nue',
  video_1_aspect = '9:16',
  video_2_title = 'Jungleous Bitki Bakımı',
  video_2_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Jungleous_Bitki_Bak%C4%B1m-_lc7c7h',
  video_2_aspect = '9:16'
where slug = 'jungleous';
