import { redirect } from "next/navigation";
import { withLocale } from "@/lib/i18n/path";

/** Legacy `/drops` → `/tr/drops`. */
export default function LegacyDropsPage() {
  redirect(withLocale("/drops", "tr"));
}
