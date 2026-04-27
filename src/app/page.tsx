import { getProjects, getSettings } from "@/lib/queries";
import { SiteHeader } from "@/components/public/SiteHeader";
import { PortfolioGrid } from "@/components/public/PortfolioGrid";
import type { SiteSettings } from "@/types";

export const revalidate = 60;

const FALLBACK_SETTINGS: SiteSettings = {
  siteAdi: "kruv.",
  tagline: "Seçilmiş projeler & çalışmalar",
  footerYazi: "kruv. — portfolyo",
};

export default async function HomePage() {
  // Graceful degradation: if DB is unreachable (e.g. during a first build
  // before env is wired) we still render a valid shell.
  const [projects, settings] = await Promise.all([
    getProjects().catch(() => []),
    getSettings().catch(() => FALLBACK_SETTINGS),
  ]);

  return (
    <>
      <SiteHeader settings={settings} />
      <PortfolioGrid projects={projects} settings={settings} />
    </>
  );
}
