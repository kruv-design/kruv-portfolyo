-- Marka Instagram hesapları
update public.protel_brands
set social_accounts = '[
  {"platform": "Instagram", "handle": "@ggpizzaa", "url": "https://www.instagram.com/ggpizzaa?igsh=Z2VnOXJqdjJnZ3Zl"}
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
set social_accounts = '[
  {"platform": "Instagram", "handle": "@thescholarschool_official", "url": "https://www.instagram.com/thescholarschool_official/"}
]'::jsonb
where slug = 'the-scholar-school';
