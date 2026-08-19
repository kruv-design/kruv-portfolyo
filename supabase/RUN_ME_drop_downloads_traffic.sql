-- Mevcut drops kurulumuna trafik kolonlarını ekler.
-- Supabase → SQL Editor → Run
-- Ham IP saklanmaz; ülke Vercel başlığından gelir (TR, US, …).

alter table public.drop_downloads
  add column if not exists referrer text default '',
  add column if not exists page text default '',
  add column if not exists source text default '',
  add column if not exists country text default '',
  add column if not exists session_id text default '';

create index if not exists drop_downloads_font_idx on public.drop_downloads (font_id);
create index if not exists drop_downloads_pack_idx on public.drop_downloads (pack_id);
create index if not exists drop_downloads_session_idx on public.drop_downloads (session_id);
