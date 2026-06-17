import { redirect } from "next/navigation";
import { ENABLE_PUBLIC_CONTACT } from "@/lib/marketing-flags";
import { withLocale } from "@/lib/i18n/path";

/** Legacy `/contact` → locale'li canonical URL (`/tr/contact`). */
export default function LegacyContactPage() {
  if (!ENABLE_PUBLIC_CONTACT) {
    redirect(withLocale("/works", "tr"));
  }
  redirect(withLocale("/contact", "tr"));
}
