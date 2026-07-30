-- Drops kart hero — photo-only Cloudinary public_id
-- Supabase SQL Editor'da bir kez çalıştırın.

update public.drop_fonts f
set
  hero_image = v.hero_image,
  updated_at = now()
from public.drop_packs p,
(values
  ('marzano', 'kruv-drops/photos/marzano/phone-bg'),
  ('local', 'kruv-drops/photos/local/hero'),
  ('cove', 'kruv-drops/photos/cove/hero-water')
) as v(slug, hero_image)
where f.pack_id = p.id
  and p.slug = 'summer-pack'
  and f.slug = v.slug;
