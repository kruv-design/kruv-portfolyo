"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { workFilterDisplayLabel } from "@/lib/category-labels";
import { resolveProjectForLocale } from "@/lib/project-locale";
import { t } from "@/lib/i18n/t";
import type { Project } from "@/types";
import { FilterBar } from "./FilterBar";
import { PortfolioCard } from "./PortfolioCard";
import { SiteFooter } from "./SiteFooter";
import type { SiteSettings } from "@/types";
import {
  WORK_PAGE_FILTER_LABELS,
  parseWorksFilterParam,
  projectMatchesWorkFilter,
  type WorkPageFilterLabel,
} from "@/lib/work-filters";

export function PortfolioGrid({
  projects,
  settings,
  locale,
  messages,
}: {
  projects: Project[];
  settings: SiteSettings;
  locale: Locale;
  messages: Messages;
}) {
  const searchParams = useSearchParams();
  const [active, setActive] = useState<"Tümü" | WorkPageFilterLabel>("Tümü");

  useEffect(() => {
    const fromUrl = parseWorksFilterParam(searchParams.get("filter"));
    if (fromUrl) setActive(fromUrl);
  }, [searchParams]);

  const filtered = useMemo(() => {
    const base =
      active === "Tümü"
        ? projects
        : projects.filter((p) => projectMatchesWorkFilter(p.kategori, active));
    return base.map((p) => resolveProjectForLocale(p, locale));
  }, [active, projects, locale]);

  const filterLabels = useMemo(
    () =>
      WORK_PAGE_FILTER_LABELS.map((filter) => ({
        key: filter,
        label: workFilterDisplayLabel(filter, locale),
      })),
    [locale],
  );

  const allLabel = t(messages, "works.all", locale === "en" ? "All" : "Tümü");
  const emptyLabel = t(
    messages,
    "works.empty",
    locale === "en" ? "No projects in this category." : "Bu kategoride proje yok.",
  );

  return (
    <div id="works" className="flex min-h-0 flex-1 flex-col overflow-x-clip">
      <div className="works-shell-inner portfolio-works-page marketing-works-grid">
        <FilterBar
          allLabel={allLabel}
          categories={filterLabels}
          active={active}
          onChange={(cat) =>
            setActive(cat as "Tümü" | WorkPageFilterLabel)
          }
          lang={locale}
          ariaLabel={t(messages, "works.filterAria", "Project filters")}
        />

        <main className="portfolio-grid">
          {filtered.length === 0 ? (
            <div
              className="b1 col-span-full py-20 text-center font-semibold"
              style={{ color: "var(--b1-color)" }}
            >
              {emptyLabel}
            </div>
          ) : (
            filtered.map((p, i) => (
              <PortfolioCard key={p.id} project={p} index={i} locale={locale} />
            ))
          )}
        </main>
      </div>

      <SiteFooter
        settings={settings}
        locale={locale}
        messages={messages}
      />
    </div>
  );
}
