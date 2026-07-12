import { redirect } from "next/navigation";
import { withLocale } from "@/lib/i18n/path";

/** Legacy `/blog` → locale'li canonical URL (`/tr/blog`). */
export default function LegacyBlogPage() {
  redirect(withLocale("/blog", "tr"));
}
