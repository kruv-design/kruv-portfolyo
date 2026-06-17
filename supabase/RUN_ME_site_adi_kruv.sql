-- site_settings.siteAdi: eski "kruv." varsayılanını "kruv" yap
update public.site_settings
set "siteAdi" = 'kruv'
where trim(trailing '.' from "siteAdi") = 'kruv'
   or "siteAdi" in ('kruv.', 'Kruv', 'Kruv.', 'kruv. ');
