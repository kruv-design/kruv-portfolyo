import { DEFAULT_SITE_SETTINGS, getProjects, getSettings } from "@/lib/queries";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingHero } from "@/components/public/MarketingHero";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { PortfolioGrid } from "@/components/public/PortfolioGrid";

export const revalidate = 60;

/** CMS Works — anasayfa ile aynı hero-v2 + proje ızgarası. */
export default async function WorksPage() {
  const [projects, settings] = await Promise.all([
    getProjects().catch(() => []),
    getSettings().catch(() => DEFAULT_SITE_SETTINGS),
  ]);

  return (
    <MarketingPageShell className="flex min-h-screen flex-col">
      <MarketingSiteNav settings={settings} />
      <MarketingHero ctaHref="#works" />
      <PortfolioGrid projects={projects} settings={settings} />
    </MarketingPageShell>
  );
}
