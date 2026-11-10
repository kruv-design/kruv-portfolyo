-- Protel / ana sayfa sosyal medya paneli: marka başına 4 video slot
alter table public.protel_brands
  add column if not exists video_3_title text not null default '',
  add column if not exists video_3_url text not null default '',
  add column if not exists video_3_aspect text not null default '9:16',
  add column if not exists video_4_title text not null default '',
  add column if not exists video_4_url text not null default '',
  add column if not exists video_4_aspect text not null default '9:16';
