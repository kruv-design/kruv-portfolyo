"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/types";
import { FilterBar } from "./FilterBar";
import { PortfolioCard } from "./PortfolioCard";
import { SiteFooter } from "./SiteFooter";
import type { SiteSettings } from "@/types";

export function PortfolioGrid({
  projects,
  settings,
}: {
  projects: Project[];
  settings: SiteSettings;
}) {
  const [active, setActive] = useState("Tümü");

  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.kategori))),
    [projects],
  );

  const filtered = useMemo(
    () => (active === "Tümü" ? projects : projects.filter((p) => p.kategori === active)),
    [active, projects],
  );

  return (
    <>
      <FilterBar categories={categories} active={active} onChange={setActive} />

      <main className="portfolio-grid">
        {filtered.length === 0 ? (
          <div
            className="serif col-span-full py-20 text-center italic"
            style={{ color: "var(--ink-faint)", fontSize: "1.5rem" }}
          >
            Bu kategoride proje yok.
          </div>
        ) : (
          filtered.map((p, i) => <PortfolioCard key={p.id} project={p} index={i} />)
        )}
      </main>

      <SiteFooter settings={settings} count={filtered.length} total={projects.length} />
    </>
  );
}
