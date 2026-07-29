-- Font drops: packs, fonts, download leads
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
  created_at    timestamptz not null default now()
);

create index if not exists drop_packs_sort_idx on public.drop_packs (sort_order asc, created_at desc);
create index if not exists drop_packs_yayinda_idx on public.drop_packs (yayinda);
create index if not exists drop_fonts_pack_idx on public.drop_fonts (pack_id, sort_order asc);
create index if not exists drop_fonts_yayinda_idx on public.drop_fonts (yayinda);
create index if not exists drop_downloads_created_idx on public.drop_downloads (created_at desc);
create index if not exists drop_downloads_email_idx on public.drop_downloads (email);

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
create policy "drop_packs_public_read"
  on public.drop_packs for select using (true);

drop policy if exists "drop_packs_authed_write" on public.drop_packs;
create policy "drop_packs_authed_write"
  on public.drop_packs for all to authenticated using (true) with check (true);

drop policy if exists "drop_fonts_public_read" on public.drop_fonts;
create policy "drop_fonts_public_read"
  on public.drop_fonts for select using (true);

drop policy if exists "drop_fonts_authed_write" on public.drop_fonts;
create policy "drop_fonts_authed_write"
  on public.drop_fonts for all to authenticated using (true) with check (true);

drop policy if exists "drop_downloads_authed_read" on public.drop_downloads;
create policy "drop_downloads_authed_read"
  on public.drop_downloads for select to authenticated using (true);
