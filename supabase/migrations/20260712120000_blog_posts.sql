-- ── Blog yazıları ───────────────────────────────────────────
-- Public liste: /blog · detay: /blog/[slug] · admin: /admin/blog
create table if not exists public.blog_posts (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  -- TR içerik
  baslik      text not null,
  aciklama    text default '',
  -- EN içerik (boşsa TR gösterilir)
  title       text default '',
  description text default '',
  -- Kapak görseli (liste kartı + og image)
  kapak       text default '',
  -- Bölümler: [{ baslik, metin, title, text, gorsel }]
  bolumler    jsonb not null default '[]'::jsonb,
  yayinda     boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists blog_posts_created_idx
  on public.blog_posts (created_at desc);

create index if not exists blog_posts_yayinda_idx
  on public.blog_posts (yayinda);

drop trigger if exists blog_posts_touch on public.blog_posts;
create trigger blog_posts_touch
  before update on public.blog_posts
  for each row execute function public.touch_updated_at();

alter table public.blog_posts enable row level security;

drop policy if exists "blog_posts_public_read" on public.blog_posts;
create policy "blog_posts_public_read"
  on public.blog_posts for select
  using (true);

drop policy if exists "blog_posts_authed_write" on public.blog_posts;
create policy "blog_posts_authed_write"
  on public.blog_posts for all
  to authenticated
  using (true) with check (true);
