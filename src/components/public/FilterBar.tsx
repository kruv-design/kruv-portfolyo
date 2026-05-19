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
      className="flex flex-wrap items-center gap-[7px] border-b py-5"
      style={{ borderColor: "var(--border)" }}
      lang="tr"
      aria-label="Proje filtreleri"
    >
      {list.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className="b2 rounded-full border border-solid px-[15px] py-1.5 transition-colors duration-200 lowercase"
            style={{
              borderColor: isActive ? "var(--ink)" : "var(--border)",
              background: isActive ? "var(--ink)" : "transparent",
              color: isActive ? "var(--bg)" : "var(--ink-soft)",
            }}
          >
            {cat}
          </button>
        );
      })}
    </nav>
  );
}
