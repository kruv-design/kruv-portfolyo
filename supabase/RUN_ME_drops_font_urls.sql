-- Summer Pack font URL'leri — Supabase SQL Editor'da çalıştırın.
-- (Tablolar zaten varsa yalnızca bu dosyayı çalıştırmanız yeterli.)

update public.drop_fonts f
set
  font_file_url = v.url,
  font_preview_url = v.url,
  updated_at = now()
from public.drop_packs p
join (
  values
    ('marzano', '/drops/fonts/MARZANO-Regular.ttf'),
    ('local', '/drops/fonts/Local-Regular.ttf'),
    ('cove', '/drops/fonts/Cove-Regular.ttf')
) as v(slug, url) on true
where f.pack_id = p.id
  and p.slug = 'summer-pack'
  and f.slug = v.slug;
