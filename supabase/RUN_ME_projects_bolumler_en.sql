-- ═══════════════════════════════════════════════════════════
-- Proje metin bölümleri (bolumler) — TR + EN
-- Table Editor → projects → bolumler (jsonb) hücresine yapıştır
-- veya bu örnekteki gibi update ile güncelle
-- ═══════════════════════════════════════════════════════════
--
-- Her bölüm:
--   baslik / metin  → Türkçe
--   title / text    → İngilizce
--
-- Üst kısa özet (ayrı sütunlar):
--   aciklama (TR) | description (EN)
--   baslik (TR)   | title (EN)

-- Örnek: levantenler — bolumler EN eklemek için kendi metinlerinle düzenle
/*
update public.projects
set bolumler = '[
  {
    "baslik": "Bağlam",
    "metin": "Türkçe paragraf…",
    "title": "Context",
    "text": "English paragraph…"
  }
]'::jsonb
where slug = 'levantenler';
*/
