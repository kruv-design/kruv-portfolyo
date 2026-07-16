-- Protel süreç adımları — 03–05 alt cümle güncellemesi
update public.protel_pitch_settings
set process_steps = '[
  {
    "title": "Brief & ürünü anlama",
    "description": "İyi bir brief alma ve ürünü tam olarak anlama."
  },
  {
    "title": "Script + voice-over",
    "description": "Senaryo ve seslendirme metni yazımı."
  },
  {
    "title": "Storyboard",
    "description": "Her sahneyi, geçişi ve kullanıcı akışını önceden planlayarak üretim sürecini netleştiriyoruz."
  },
  {
    "title": "Animasyon sample",
    "description": "Animasyonun görsel dili, ritmi ve hareket prensiplerini yansıtan örnek sahneyi hazırlayıp onayınıza sunuyoruz."
  },
  {
    "title": "Teslim",
    "description": "Geri bildirimlerin ardından final animasyonu optimize edilmiş formatlarda teslim ediyoruz."
  }
]'::jsonb
where id = 1;
