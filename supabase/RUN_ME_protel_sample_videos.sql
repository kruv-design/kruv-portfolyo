-- Protel örnek videoları — hero bento grid
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
  },
  {
    "title": "Rate Coach UI Ad",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Rate_Coach_-_UI_Ad_-_9x16_vlpmqt",
    "aspectRatio": "9:16"
  },
  {
    "title": "Rate Shopper UI Ad",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Rate_Shopper_-_UI_Ad_-_9x16_mjlrfv",
    "aspectRatio": "9:16"
  },
  {
    "title": "BV Main",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=BV_MAIN_onzybr",
    "aspectRatio": "16:9"
  },
  {
    "title": "Trick Landing Page",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Trick_Landing_Page_v2_zutvtv",
    "aspectRatio": "16:9"
  }
]'::jsonb
where id = 1;
