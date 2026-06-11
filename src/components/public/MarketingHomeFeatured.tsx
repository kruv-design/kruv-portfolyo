import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { getProjects } from "@/lib/queries";
import { MarketingFeaturedWorks } from "./MarketingFeaturedWorks";

/** Anasayfa projeler — CMS, asimetrik grid (Figma “Projelerimiz”). */
export async function MarketingHomeFeatured({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const projects = await getProjects().catch(() => []);

  return (
    <MarketingFeaturedWorks
      projects={projects}
      locale={locale}
      messages={messages}
    />
  );
}
