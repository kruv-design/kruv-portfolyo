import type { Locale } from "@/lib/i18n/config";

/** Hero tipografi HTML — imleç / CTA yok. */
export function MarketingHeroMount({
  innerHtml,
}: {
  innerHtml: string;
  locale: Locale;
}) {
  return (
    <div
      className="marketing-hero-mount"
      suppressHydrationWarning
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: innerHtml }}
    />
  );
}
