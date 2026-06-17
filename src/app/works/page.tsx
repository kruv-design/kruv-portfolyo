import { redirect } from "next/navigation";
import { withLocale } from "@/lib/i18n/path";

/** Legacy `/works` → locale'li canonical URL (`/tr/works`). */
export default function LegacyWorksPage() {
  redirect(withLocale("/works", "tr"));
}
