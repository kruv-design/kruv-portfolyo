import { redirect } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  await params;
  redirect("/");
}
