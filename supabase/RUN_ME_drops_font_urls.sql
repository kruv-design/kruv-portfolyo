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
    ('marzano', 'https://res.cloudinary.com/di0qbhh46/raw/upload/v1785337257/MARZANO-Regular_ogmtz8.ttf'),
    ('local', 'https://res.cloudinary.com/di0qbhh46/raw/upload/v1786107930/Local-Regular_ce75fi.ttf'),
    ('cove', 'https://res.cloudinary.com/di0qbhh46/raw/upload/v1785337238/Cove-Regular_a7jne9.ttf')
) as v(slug, url) on true
where f.pack_id = p.id
  and p.slug = 'summer-pack'
  and f.slug = v.slug;
