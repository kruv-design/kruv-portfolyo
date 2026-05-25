-- ═══════════════════════════════════════════════════════════
-- Marker (sira 1) → Roots Adventure Travel (sira 2)
-- Site kuralı: sira sırasıyla ilerler; son proje (sira en büyük) → tekrar sira 1
-- Supabase → SQL Editor → yapıştır → RUN
-- ═══════════════════════════════════════════════════════════

alter table public.projects
  add column if not exists next_project_override text default '';

-- 1) Marker — slug + sıra + sonraki proje
update public.projects
set
  slug = 'marker',
  sira = 1,
  next_project_override = 'rootsadventure-travel'
where slug in ('12', 'marker')
   or lower(trim(baslik)) like '%marker%';

-- 2) Roots Adventure Travel
update public.projects
set
  slug = 'rootsadventure-travel',
  sira = 2,
  next_project_override = ''
where lower(trim(baslik)) like '%roots%adventure%'
   or lower(trim(baslik)) like '%roots adventure%'
   or slug in ('rootsadventure-travel', 'roots-adventure-travel', 'roots-travel');

-- Kontrol (2 satır görmelisin: marker sira 1, roots sira 2)
select slug, sira, baslik, next_project_override
from public.projects
where slug in ('marker', 'rootsadventure-travel')
   or sira in (1, 2)
order by sira;
