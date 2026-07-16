-- Protel pitch — hero eyebrow (plus ikonlu üst satır)
alter table public.protel_pitch_settings
  add column if not exists hero_eyebrow text not null default 'Protel için örnek çalışmalar, üretim süreci ve teklif formu';

update public.protel_pitch_settings
set hero_eyebrow = 'Protel için örnek çalışmalar, üretim süreci ve teklif formu'
where id = 1
  and (
    hero_eyebrow = ''
    or hero_eyebrow ilike 'UI AN%'
    or hero_eyebrow ilike 'ui animasyon%'
  );
