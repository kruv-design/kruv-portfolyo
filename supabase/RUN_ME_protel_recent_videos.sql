-- ══════════════════════════════════════════════════════════════
-- PROTEL — SON EKLENEN VİDEOLAR (tek seferde çalıştır)
-- Supabase SQL Editor → Run
-- ══════════════════════════════════════════════════════════════

-- Hero eyebrow kolonu (yoksa ekle)
alter table public.protel_pitch_settings
  add column if not exists hero_eyebrow text not null default 'Protel için örnek çalışmalar, üretim süreci ve teklif formu';

-- ── Hero bento örnek videoları (11 adet) ──────────────────────
update public.protel_pitch_settings
set sample_videos = '[
  {
    "title": "Rate Coach UI Ad",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Rate_Coach_-_UI_Ad_-_9x16_vlpmqt",
    "aspectRatio": "9:16"
  },
  {
    "title": "Fiyat Parite Uyuşmazlığı",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Fiyat_Parite_Uyus%CC%A7mazl%C4%B1g%CC%86%C4%B1_-_9x16_yaxbkt",
    "aspectRatio": "9:16"
  },
  {
    "title": "Karşında Olly",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=karsinda_olly_-_1_rl9a6h",
    "aspectRatio": "9:16"
  },
  {
    "title": "Otelinizin Gerçek Potansiyeli",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Otelinizin_Gerc%CC%A7ek_Potansiyeli_ukgccv",
    "aspectRatio": "9:16"
  },
  {
    "title": "Rate Shopper UI Ad",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Rate_Shopper_-_UI_Ad_-_9x16_mjlrfv",
    "aspectRatio": "9:16"
  },
  {
    "title": "UI animasyon örneği",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=tten-2_fnwkmj",
    "aspectRatio": "16:9"
  },
  {
    "title": "CHP Dijital Kampüs",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=CHP_-_Dijital_Kampu%CC%88s_1_1_f3nbhu",
    "aspectRatio": "16:9"
  },
  {
    "title": "UI animasyon örneği",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=tten_bj3iyd",
    "aspectRatio": "16:9"
  },
  {
    "title": "Trick Landing Page",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Trick_Landing_Page_v2_zutvtv",
    "aspectRatio": "16:9"
  },
  {
    "title": "UI animasyon örneği",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Otter_v4_annlwz",
    "aspectRatio": "16:9"
  },
  {
    "title": "BV Main",
    "videoUrl": "https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=BV_MAIN_onzybr",
    "aspectRatio": "16:9"
  }
]'::jsonb
where id = 1;

-- ── Jungleous müşteri videoları ───────────────────────────────
update public.protel_brands
set
  video_1_title = 'Jungleous Kampanya',
  video_1_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Jungleous_Kampanya_nb7nue',
  video_1_aspect = '9:16',
  video_2_title = 'Jungleous Bitki Bakımı',
  video_2_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Jungleous_Bitki_Bak%C4%B1m-_lc7c7h',
  video_2_aspect = '9:16'
where slug = 'jungleous';

-- ── Bulung Lojistik müşteri videoları ─────────────────────────
update public.protel_brands
set
  video_1_title = 'Bulung Safety',
  video_1_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Bulung_Safety_ftvgc2',
  video_1_aspect = '9:16',
  video_2_title = 'İstanbul – Viyana',
  video_2_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Istanbul-Viyana_qcmftc',
  video_2_aspect = '16:9'
where slug = 'bulung-lojistik';

-- ── The Scholars School müşteri videoları ────────────────────
update public.protel_brands
set
  name = 'The Scholars School',
  video_1_title = 'The Scholars School',
  video_1_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=TSS-W1-THURSDAY_ryll1v',
  video_1_aspect = '9:16',
  video_2_title = 'The Scholars School',
  video_2_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=TSS-W2-THURSDAY_jg6m09',
  video_2_aspect = '9:16'
where slug = 'the-scholar-school';

-- ── Pricing Coach — 1. video ───────────────────────────────────
update public.protel_brands
set
  video_1_title = 'Butik Oteller',
  video_1_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Butik_Oteller_hykrwc',
  video_1_aspect = '9:16'
where slug = 'pricing-coach';
