import { DEFAULT_SITE_SETTINGS, getProjects, getSettings } from "@/lib/queries";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { PortfolioGrid } from "@/components/public/PortfolioGrid";

export const revalidate = 60;

/** CMS “Works” — proje ızgarası (anasayfa `kruv.html` değil). */
export default async function WorksPage() {
  const [projects, settings] = await Promise.all([
    getProjects().catch(() => []),
    getSettings().catch(() => DEFAULT_SITE_SETTINGS),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingSiteNav settings={settings} />
      <PortfolioGrid projects={projects} settings={settings} />
    </div>
  );
}
