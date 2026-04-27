"use client";

import { useMemo } from "react";

export function FilterBar({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}) {
  const list = useMemo(() => ["Tümü", ...categories], [categories]);
  return (
    <nav
      className="flex flex-wrap items-center gap-[7px] px-[4vw] py-5"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <span
        className="mr-1.5 text-[10px] font-medium uppercase tracking-[0.1em]"
        style={{ color: "var(--ink-faint)" }}
      >
        Filtre
      </span>
      {list.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className="rounded-full px-[15px] py-1.5 text-[13px] transition-all duration-200"
            style={{
              border: "1px solid var(--border)",
              borderColor: isActive ? "var(--ink)" : "var(--border)",
              background: isActive ? "var(--ink)" : "transparent",
              color: isActive ? "var(--surface)" : "var(--ink-soft)",
            }}
          >
            {cat}
          </button>
        );
      })}
    </nav>
  );
}
