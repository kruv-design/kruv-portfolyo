import { revalidatePath } from "next/cache";
import { LOCALES } from "@/lib/i18n/config";

/** Proje güncellemesi sonrası TR/EN sayfalarını yenile. */
export function revalidateProjectPaths(slug: string) {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/admin");

  for (const locale of LOCALES) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/works`);
    revalidatePath(`/${locale}/projects/${slug}`);
  }

  revalidatePath(`/projects/${slug}`);
}

/** Blog güncellemesi sonrası TR/EN sayfalarını yenile. */
export function revalidateBlogPaths(slug?: string) {
  revalidatePath("/admin/blog");

  for (const locale of LOCALES) {
    revalidatePath(`/${locale}/blog`);
    if (slug) revalidatePath(`/${locale}/blog/${slug}`);
  }

  if (slug) revalidatePath(`/blog/${slug}`);
}

/** Drops güncellemesi sonrası TR/EN sayfalarını yenile. */
export function revalidateDropsPaths(packSlug?: string, fontSlug?: string) {
  revalidatePath("/admin/drops");
  revalidatePath("/admin/drops/downloads");

  for (const locale of LOCALES) {
    revalidatePath(`/${locale}/drops`);
    if (packSlug) {
      revalidatePath(`/${locale}/drops/${packSlug}`);
      if (fontSlug) revalidatePath(`/${locale}/drops/${packSlug}/${fontSlug}`);
    }
  }
}
