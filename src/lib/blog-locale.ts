import type { Locale } from "@/lib/i18n/config";
import type { BlogPost, BlogSection } from "@/types";

function pickEn(primary: string, en: string | undefined): string {
  if (en?.trim()) return en.trim();
  return primary;
}

/** Locale'e göre yazı başlığı. */
export function blogTitleForLocale(post: BlogPost, locale: Locale): string {
  if (locale === "en") {
    return pickEn(post.baslik, post.title);
  }
  return post.baslik?.trim() || "";
}

/** Locale'e göre giriş metni (meta description için de kullanılır). */
export function blogIntroForLocale(post: BlogPost, locale: Locale): string {
  if (locale === "en") {
    const en = post.description?.trim();
    if (en) return en;
  }
  return post.aciklama?.trim() || "";
}

function resolveSections(sections: BlogSection[], locale: Locale): BlogSection[] {
  return sections.map((s) => {
    if (locale === "en") {
      return {
        ...s,
        baslik: pickEn(s.baslik, s.title),
        metin: pickEn(s.metin, s.text),
      };
    }
    return {
      ...s,
      baslik: s.baslik?.trim() || "",
      metin: s.metin?.trim() || "",
    };
  });
}

/**
 * Blog metinleri — Supabase düz sütunlar + bolumler JSON:
 * TR: baslik, aciklama, bolumler.baslik/metin
 * EN: title, description, bolumler.title/text (boşsa TR)
 */
export function resolveBlogPostForLocale(post: BlogPost, locale: Locale): BlogPost {
  return {
    ...post,
    baslik: blogTitleForLocale(post, locale),
    aciklama: blogIntroForLocale(post, locale),
    bolumler: resolveSections(post.bolumler ?? [], locale),
  };
}
