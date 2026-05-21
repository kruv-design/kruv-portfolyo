-- Footer alt satır: kruv. — portfolyo → estd 2025
update public.site_settings
set "footerYazi" = 'estd 2025'
where trim("footerYazi") in (
  'kruv. — portfolyo',
  'kruv.-portfolyo',
  'kruv. - portfolyo'
);

alter table public.site_settings
  alter column "footerYazi" set default 'estd 2025';
