-- Teklif satırı: Demo + fiyat
update public.protel_pitch_settings
set
  proposal_title = 'Demo',
  proposal_price = '0.000 ₺'
where id = 1;
