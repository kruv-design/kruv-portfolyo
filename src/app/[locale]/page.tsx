import { redirect } from "next/navigation";
import { withLocale } from "@/lib/i18n/path";
import type { Locale } from "@/lib/i18n/config";

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  redirect(withLocale("/works", locale));
}
