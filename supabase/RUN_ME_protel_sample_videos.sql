-- Protel örnek videoları — dikey sol, yatay sağ
update public.protel_pitch_settings
set sample_videos = '[
  {
    "title": "Otelinizin Gerçek Potansiyeli",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Otelinizin_Gerc%CC%A7ek_Potansiyeli_ukgccv",
    "aspectRatio": "9:16"
  },
  {
    "title": "Fiyat Parite Uyuşmazlığı",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Fiyat_Parite_Uyus%CC%A7mazl%C4%B1g%CC%86%C4%B1_-_9x16_yaxbkt",
    "aspectRatio": "9:16"
  },
  {
    "title": "UI animasyon örneği",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=tten-2_fnwkmj",
    "aspectRatio": "16:9"
  },
  {
    "title": "UI animasyon örneği",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=tten_bj3iyd",
    "aspectRatio": "16:9"
  },
  {
    "title": "UI animasyon örneği",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Otter_v4_annlwz",
    "aspectRatio": "16:9"
  }
]'::jsonb
where id = 1;
