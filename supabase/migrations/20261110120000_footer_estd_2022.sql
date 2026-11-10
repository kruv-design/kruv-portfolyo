-- Footer alt satır: Estd 2025 → Estd 2022
update public.site_settings
set "footerYazi" = 'Estd 2022'
where trim("footerYazi") in (
  'Estd 2025',
  'estd 2025',
  'kruv. — portfolyo',
  'kruv.-portfolyo',
  'kruv. - portfolyo'
);

alter table public.site_settings
  alter column "footerYazi" set default 'Estd 2022';
