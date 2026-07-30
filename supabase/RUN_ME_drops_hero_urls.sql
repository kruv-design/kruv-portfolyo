-- Drops hero görselleri + preview metinleri — Supabase SQL Editor'da bir kez çalıştırın.
-- (Figma tasarımından export; dosyalar public/drops/heroes/ altında)

update public.drop_fonts f
set
  hero_image = v.hero_image,
  preview_text = v.preview_text,
  updated_at = now()
from public.drop_packs p,
(values
  ('marzano', '/drops/heroes/marzano.jpg', E'Designed,\nbaked,\nand served.'),
  ('local', '/drops/heroes/local.jpg', 'the story of roots'),
  ('cove', '/drops/heroes/cove.jpg', E'The softest form\nof nature')
) as v(slug, hero_image, preview_text)
where f.pack_id = p.id
  and p.slug = 'summer-pack'
  and f.slug = v.slug;
