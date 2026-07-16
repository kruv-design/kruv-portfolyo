-- Protel pitch — yeni alanlar (mevcut tabloya ek)
alter table public.protel_pitch_settings
  add column if not exists proposal_price text not null default '',
  add column if not exists process_duration text not null default '2/3 HAFTA';
