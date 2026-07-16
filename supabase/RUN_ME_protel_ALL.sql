-- ══════════════════════════════════════════════════════════════
-- PROTEL PITCH — TEK SEFERDE TÜM İÇERİK
-- Supabase SQL Editor'da bir kez çalıştırın.
-- ══════════════════════════════════════════════════════════════

-- Satır yoksa oluştur
insert into public.protel_pitch_settings (id)
values (1)
on conflict (id) do nothing;

-- Eksik kolonlar (varsa atlar)
alter table public.protel_pitch_settings
  add column if not exists proposal_price text not null default '',
  add column if not exists process_duration text not null default '2/3 HAFTA';

-- ── Sayfa ayarları (hero + bento videolar + teklif) ──────────
update public.protel_pitch_settings
set
  hero_eyebrow = 'Protel için örnek çalışmalar, üretim süreci ve teklif formu',
  hero_title = 'Ürününüzün Potansiyelini
Sahneye Çıkarın',
  hero_intro = 'Karmaşıklığı akıcı deneyimlere dönüştürüyoruz.

Ürününüzün en gelişmiş özelliklerini; anlaşılır, etkileyici ve akılda kalıcı animasyonlarla görünür kılıyor, kullanıcıların değeri ilk saniyede hissetmesini sağlıyoruz.',
  proposal_title = 'Demo',
  proposal_price = '0.000 ₺',
  process_duration = '2/3 HAFTA',
  sample_videos = '[
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

-- ── Pricing Coach (upsert) ───────────────────────────────────
insert into public.protel_brands (
  slug, name, sort_order,
  video_1_title, video_1_url, video_1_aspect,
  video_2_title, video_2_url, video_2_aspect,
  social_accounts
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

-- ── GG Pizza ───────────────────────────────────────────────────
update public.protel_brands
set
  sort_order = 1,
  video_1_title = 'GG Pizza',
  video_1_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=GG_6_rdirzm',
  video_1_aspect = '9:16',
  video_2_title = 'Food is Art',
  video_2_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Food_is_art_yx3vep',
  video_2_aspect = '9:16',
  social_accounts = '[
    {"platform": "Instagram", "handle": "@ggpizzaa", "url": "https://www.instagram.com/ggpizzaa/"}
  ]'::jsonb
where slug = 'ggpizza';

-- ── Jungleous ──────────────────────────────────────────────────
update public.protel_brands
set
  sort_order = 2,
  video_1_title = 'Jungleous Kampanya',
  video_1_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Jungleous_Kampanya_nb7nue',
  video_1_aspect = '9:16',
  video_2_title = 'Jungleous Bitki Bakımı',
  video_2_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Jungleous_Bitki_Bak%C4%B1m-_lc7c7h',
  video_2_aspect = '9:16',
  social_accounts = '[
    {"platform": "Instagram", "handle": "@jungleous", "url": "https://www.instagram.com/jungleous/"}
  ]'::jsonb
where slug = 'jungleous';

-- ── Bulung Lojistik ──────────────────────────────────────────────
update public.protel_brands
set
  sort_order = 3,
  video_1_title = 'Bulung Safety',
  video_1_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Bulung_Safety_ftvgc2',
  video_1_aspect = '9:16',
  video_2_title = 'İstanbul – Viyana',
  video_2_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=Istanbul-Viyana_qcmftc',
  video_2_aspect = '16:9',
  social_accounts = '[
    {"platform": "Instagram", "handle": "@bulunglogistics", "url": "https://www.instagram.com/bulunglogistics/"}
  ]'::jsonb
where slug = 'bulung-lojistik';

-- ── The Scholars School ────────────────────────────────────────
update public.protel_brands
set
  name = 'The Scholars School',
  sort_order = 4,
  video_1_title = 'The Scholars School',
  video_1_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=TSS-W1-THURSDAY_ryll1v',
  video_1_aspect = '9:16',
  video_2_title = 'The Scholars School',
  video_2_url = 'https://player.cloudinary.com/embed/?cloud_name=di0qbhh46&public_id=TSS-W2-THURSDAY_jg6m09',
  video_2_aspect = '9:16',
  social_accounts = '[
    {"platform": "Instagram", "handle": "@the.scholarsschool", "url": "https://www.instagram.com/the.scholarsschool/"}
  ]'::jsonb
where slug = 'the-scholar-school';
