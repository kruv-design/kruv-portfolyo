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
