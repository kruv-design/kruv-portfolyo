"use client";

import { useMemo } from "react";
import type { WorkPageFilterLabel } from "@/lib/work-filters";

export function FilterBar({
  allLabel,
  categories,
  active,
  onChange,
  lang,
  ariaLabel,
}: {
  allLabel: string;
  categories: { key: WorkPageFilterLabel; label: string }[];
  active: string;
  onChange: (cat: string) => void;
  lang: string;
  ariaLabel: string;
}) {
  const list = useMemo(
    () => [{ key: "Tümü" as const, label: allLabel }, ...categories],
    [allLabel, categories],
  );

  return (
    <nav
      className="flex flex-wrap items-center gap-[7px] border-b py-5"
      style={{ borderColor: "var(--border)" }}
      lang={lang}
      aria-label={ariaLabel}
    >
      {list.map(({ key, label }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className="b2 rounded-full border border-solid px-[15px] py-1.5 transition-colors duration-200"
            style={{
              borderColor: isActive ? "var(--ink)" : "var(--border)",
              background: isActive ? "var(--ink)" : "transparent",
              color: isActive ? "var(--bg)" : "var(--ink-soft)",
            }}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
