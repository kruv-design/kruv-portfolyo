-- Drops — Supabase SQL Editor'da bir kez çalıştırın.
-- (supabase/migrations/20260801120000_drops.sql ile aynı şema + Summer Pack seed)

create table if not exists public.drop_packs (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  baslik      text not null,
  title       text default '',
  aciklama    text default '',
  description text default '',
  kapak       text default '',
  pack_zip_url text default '',
  sort_order  int not null default 0,
  yayinda     boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.drop_fonts (
  id                  uuid primary key default uuid_generate_v4(),
  pack_id             uuid not null references public.drop_packs(id) on delete cascade,
  slug                text not null,
  name                text not null,
  aciklama            text default '',
  description         text default '',
  preview_text        text default '',
  tester_default_text text default '',
  tester_placeholder  text default '',
  hero_image          text default '',
  font_file_url       text default '',
  font_preview_url    text default '',
  specimen_blocks     jsonb not null default '[]'::jsonb,
  sort_order          int not null default 0,
  yayinda             boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (pack_id, slug)
);

create table if not exists public.drop_downloads (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  email         text not null,
  pack_id       uuid references public.drop_packs(id) on delete set null,
  font_id       uuid references public.drop_fonts(id) on delete set null,
  download_type text not null check (download_type in ('font', 'pack')),
  ip_hash       text default '',
  user_agent    text default '',
  locale        text default 'tr',
  referrer      text default '',
  page          text default '',
  source        text default '',
  country       text default '',
  session_id    text default '',
  created_at    timestamptz not null default now()
);

create index if not exists drop_packs_sort_idx on public.drop_packs (sort_order asc, created_at desc);
create index if not exists drop_fonts_pack_idx on public.drop_fonts (pack_id, sort_order asc);
create index if not exists drop_downloads_created_idx on public.drop_downloads (created_at desc);

drop trigger if exists drop_packs_touch on public.drop_packs;
create trigger drop_packs_touch
  before update on public.drop_packs
  for each row execute function public.touch_updated_at();

drop trigger if exists drop_fonts_touch on public.drop_fonts;
create trigger drop_fonts_touch
  before update on public.drop_fonts
  for each row execute function public.touch_updated_at();

alter table public.drop_packs enable row level security;
alter table public.drop_fonts enable row level security;
alter table public.drop_downloads enable row level security;

drop policy if exists "drop_packs_public_read" on public.drop_packs;
create policy "drop_packs_public_read" on public.drop_packs for select using (true);
drop policy if exists "drop_packs_authed_write" on public.drop_packs;
create policy "drop_packs_authed_write" on public.drop_packs for all to authenticated using (true) with check (true);

drop policy if exists "drop_fonts_public_read" on public.drop_fonts;
create policy "drop_fonts_public_read" on public.drop_fonts for select using (true);
drop policy if exists "drop_fonts_authed_write" on public.drop_fonts;
create policy "drop_fonts_authed_write" on public.drop_fonts for all to authenticated using (true) with check (true);

drop policy if exists "drop_downloads_authed_read" on public.drop_downloads;
create policy "drop_downloads_authed_read" on public.drop_downloads for select to authenticated using (true);

insert into public.drop_packs (slug, baslik, title, aciklama, description, sort_order, yayinda)
values (
  'summer-pack', 'Summer Pack', 'Summer Pack',
  'Seçilmiş font ve tasarım kaynaklarına erişin.',
  'Access our curated collection of fonts and design resources.',
  0, true
) on conflict (slug) do nothing;

insert into public.drop_fonts (
  pack_id, slug, name, aciklama, description,
  preview_text, tester_default_text, hero_image,
  font_file_url, font_preview_url,
  sort_order, yayinda
)
select p.id, v.slug, v.name, v.aciklama, v.description, v.preview_text, v.tester_default_text, v.hero_image,
  v.font_url, v.font_url, v.sort_order, true
from public.drop_packs p
cross join (values
  ('marzano', 'Marzano',
   'Akıcı formlar ve ikonik domates dokunuşlarıyla tasarlanan Marzano fontu, markalara lüks, cesur ve oyuncu bir karakter kazandırır.',
   'Designed with fluid forms and iconic tomato touches, our Marzano font offers a timeless typographic experience.',
   E'Designed,\nbaked,\nand served.', 'Designed, baked, and served.',
   'kruv-drops/photos/marzano/card-bg',
   'https://res.cloudinary.com/di0qbhh46/raw/upload/v1785337257/MARZANO-Regular_ogmtz8.ttf', 0),
  ('local', 'Local',
   'tasarımcının el yazısından oluşan yapmacıksız ve bireysel.',
   'Local keeps the rhythm of handwriting — personal, warm, and unforced.',
   'the story of roots', 'cool without effort',
   'kruv-drops/photos/local/card-bg',
   'https://res.cloudinary.com/di0qbhh46/raw/upload/v1785337240/Local-Regular_ce75fi.ttf', 1),
  ('cove', 'Cove',
   'Doğanın en yumuşak formlarından ilham alan Cove, sade ve cool bir display karakter sunar.',
   'Born from pebbles, simple and cool — Cove brings the softest forms of nature.',
   E'The softest form\nof nature', 'Born from pebbles, simple and cool.',
   'kruv-drops/photos/cove/card-bg',
   'https://res.cloudinary.com/di0qbhh46/raw/upload/v1785337238/Cove-Regular_a7jne9.ttf', 2)
) as v(slug, name, aciklama, description, preview_text, tester_default_text, hero_image, font_url, sort_order)
where p.slug = 'summer-pack'
on conflict (pack_id, slug) do nothing;

alter table public.drop_downloads
  add column if not exists referrer text default '',
  add column if not exists page text default '',
  add column if not exists source text default '',
  add column if not exists country text default '',
  add column if not exists session_id text default '';

create index if not exists drop_downloads_font_idx on public.drop_downloads (font_id);
create index if not exists drop_downloads_pack_idx on public.drop_downloads (pack_id);
create index if not exists drop_downloads_session_idx on public.drop_downloads (session_id);
