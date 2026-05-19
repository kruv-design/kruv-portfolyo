import { getProjects, getSettings } from "@/lib/queries";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { PortfolioGrid } from "@/components/public/PortfolioGrid";
import type { SiteSettings } from "@/types";

export const revalidate = 60;

const FALLBACK_SETTINGS: SiteSettings = {
  siteAdi: "kruv.",
  tagline: "Seçilmiş projeler & çalışmalar",
  footerYazi: "kruv. — portfolyo",
  instagramUrl: "",
  xUrl: "",
  linkedinUrl: "",
  behanceUrl: "",
  dribbbleUrl: "",
  youtubeUrl: "",
  pinterestUrl: "",
  githubUrl: "",
};

/** CMS “Works” — proje ızgarası (anasayfa `kruv.html` değil). */
export default async function WorksPage() {
  const [projects, settings] = await Promise.all([
    getProjects().catch(() => []),
    getSettings().catch(() => FALLBACK_SETTINGS),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingSiteNav settings={settings} />
      <PortfolioGrid projects={projects} settings={settings} />
    </div>
  );
}
