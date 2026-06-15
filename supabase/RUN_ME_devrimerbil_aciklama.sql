-- ═══════════════════════════════════════════════════════════
-- Devrim Erbil — TR: aciklama | EN: description
-- Önce RUN_ME_projects_en_columns.sql çalıştırıldığını doğrulayın
-- Supabase → SQL Editor → RUN
-- ═══════════════════════════════════════════════════════════

update public.projects
set
  aciklama = $tr$
Devrim Erbil'in Atatürk Kültür Merkezi'nde, Beyoğlu Kültür Yolu Festivali kapsamında gerçekleşen Renkler ve Teknikler sergisi için grafik tasarım, yönlendirme sistemi, eser künyeleri ve sergi katalogu tasarımını üstlendik. Sergi deneyimini güçlendiren, sanat eserleriyle uyumlu ve ziyaretçi odaklı bir görsel dil oluşturduk.
$tr$,
  description = $en$
For Colors and Techniques, Devrim Erbil's exhibition at Atatürk Cultural Center as part of the Beyoğlu Culture Route Festival, we designed the graphic identity, wayfinding system, artwork labels, and exhibition catalog. We developed a visitor-focused visual language that complemented the artworks and enhanced the overall exhibition experience.
$en$
where baslik ilike '%Devrim Erbil%';
