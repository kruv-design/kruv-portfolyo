"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/types";
import { FilterBar } from "./FilterBar";
import { PortfolioCard } from "./PortfolioCard";
import { SiteFooter } from "./SiteFooter";
import type { SiteSettings } from "@/types";
import {
  WORK_PAGE_FILTER_LABELS,
  projectMatchesWorkFilter,
  type WorkPageFilterLabel,
} from "@/lib/work-filters";

export function PortfolioGrid({
  projects,
  settings,
}: {
  projects: Project[];
  settings: SiteSettings;
}) {
  const [active, setActive] = useState<"Tümü" | WorkPageFilterLabel>("Tümü");

  const filtered = useMemo(() => {
    if (active === "Tümü") return projects;
    return projects.filter((p) => projectMatchesWorkFilter(p.kategori, active));
  }, [active, projects]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="works-shell-inner portfolio-works-page">
        <FilterBar
          categories={[...WORK_PAGE_FILTER_LABELS]}
          active={active}
          onChange={(cat) =>
            setActive(cat as "Tümü" | WorkPageFilterLabel)
          }
        />

        <main className="portfolio-grid pb-10 pt-2">
          {filtered.length === 0 ? (
            <div
              className="b1 col-span-full py-20 text-center italic"
              style={{ color: "var(--b1-color)" }}
            >
              Bu kategoride proje yok.
            </div>
          ) : (
            filtered.map((p, i) => <PortfolioCard key={p.id} project={p} index={i} />)
          )}
        </main>
      </div>

      <SiteFooter settings={settings} count={filtered.length} total={projects.length} />
    </div>
  );
}
