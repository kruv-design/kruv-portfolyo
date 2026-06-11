import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { GlobalOrganizationJsonLd } from "@/components/seo/GlobalOrganizationJsonLd";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(locale)};`,
        }}
      />
      <GlobalOrganizationJsonLd locale={locale as Locale} />
      {children}
    </>
  );
}
