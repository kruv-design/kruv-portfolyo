-- Drops hero görselleri — Cloudinary kruv-drops/heroes public_id
-- Supabase SQL Editor'da bir kez çalıştırın.

update public.drop_fonts f
set
  hero_image = v.hero_image,
  updated_at = now()
from public.drop_packs p,
(values
  ('marzano', 'kruv-drops/heroes/marzano'),
  ('local', 'kruv-drops/heroes/local'),
  ('cove', 'kruv-drops/heroes/cove')
) as v(slug, hero_image)
where f.pack_id = p.id
  and p.slug = 'summer-pack'
  and f.slug = v.slug;
