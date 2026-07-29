import { redirect, notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/path";
import { getDropPackBySlugPublic } from "@/lib/drops-queries";

export default async function DropPackRedirectPage({
  params,
}: {
  params: Promise<{ locale: Locale; packSlug: string }>;
}) {
  const { locale, packSlug } = await params;
  const pack = await getDropPackBySlugPublic(packSlug);
  if (!pack || pack.fonts.length === 0) notFound();
  redirect(withLocale(`/drops/${packSlug}/${pack.fonts[0]!.slug}`, locale));
}
