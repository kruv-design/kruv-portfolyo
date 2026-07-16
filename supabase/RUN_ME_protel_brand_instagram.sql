-- Marka Instagram hesapları
update public.protel_brands
set social_accounts = '[
  {"platform": "Instagram", "handle": "@pricing_coach", "url": "https://www.instagram.com/pricing_coach/"}
]'::jsonb
where slug = 'pricing-coach';

update public.protel_brands
set social_accounts = '[
  {"platform": "Instagram", "handle": "@ggpizzaa", "url": "https://www.instagram.com/ggpizzaa/"}
]'::jsonb
where slug = 'ggpizza';

update public.protel_brands
set social_accounts = '[
  {"platform": "Instagram", "handle": "@jungleous", "url": "https://www.instagram.com/jungleous/"}
]'::jsonb
where slug = 'jungleous';

update public.protel_brands
set social_accounts = '[
  {"platform": "Instagram", "handle": "@bulunglogistics", "url": "https://www.instagram.com/bulunglogistics/"}
]'::jsonb
where slug = 'bulung-lojistik';

update public.protel_brands
set
  name = 'The Scholars School',
  social_accounts = '[
    {"platform": "Instagram", "handle": "@the.scholarsschool", "url": "https://www.instagram.com/the.scholarsschool/"}
  ]'::jsonb
where slug = 'the-scholar-school';
