-- ═══════════════════════════════════════════════════════════
-- Levantenler — TR açıklama + EN (i18n.en.aciklama)
-- Supabase SQL Editor → RUN
-- ═══════════════════════════════════════════════════════════

update public.projects
set
  aciklama = $tr$
Levantenler, Doğu Akdeniz'e yerleşen, çoğunlukla İtalyan ve Fransız kökenli topluluklardır. İstanbul ve İzmir başta olmak üzere Osmanlı ve Türk kültürüne, ekonomisine derin izler bıraktılar.

İki kültür arasında doğan yeni bir kültür. Doğu ile Batı'nın kesişimi.

Beyoğlu Kültür Yolu Festivali kapsamında düzenlenen Levantenler Konferansı, bu mirası yaşatmak ve şehirle Levantenler arasında köprü kurmak için hayata geçti.

Konferansın kimlik ve yönlendirme tasarımını biz üstlendik.
$tr$,
  i18n = jsonb_set(
    coalesce(i18n, '{}'::jsonb),
    '{en}',
    coalesce(i18n->'en', '{}'::jsonb) || jsonb_build_object(
      'aciklama',
      $en$
Levantines are people of mostly Italian and French origin who settled in the eastern Mediterranean; primarily Istanbul and Izmir, and shaped Ottoman and Turkish culture and economy for generations.

A culture born between two cultures. The intersection of East and West.

The Levantines Conference, held as part of the Beyoğlu Kültür Yolu Festival, was organized to keep this legacy alive and bridge the Levantines with the city's citizens.

We designed the identity and conference wayfinding.
$en$
    )
  )
where slug = 'levantenler';
