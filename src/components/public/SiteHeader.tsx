import Link from "next/link";
import type { SiteSettings } from "@/types";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const [left, right = ""] = settings.siteAdi.split(".");
  return (
    <header
      className="flex flex-wrap items-end justify-between gap-4 px-[4vw] pb-8 pt-10"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <Link
        href="/"
        title="Ana sayfa"
        aria-label="Ana sayfa"
        className="serif select-none leading-none tracking-tight"
        style={{
          fontSize: "clamp(2rem, 5vw, 3.2rem)",
          color: "var(--ink)",
        }}
      >
        {left}
        <em className="not-italic" style={{ color: "var(--accent)", fontStyle: "italic" }}>
          .{right}
        </em>
      </Link>
      <div className="flex items-center gap-3">
        <p
          className="max-w-[280px] text-[13px] leading-relaxed"
          style={{ color: "var(--ink-soft)" }}
        >
          {settings.tagline}
        </p>
        <ThemeToggle />
        <Link
          href="/admin"
          title="Admin"
          aria-label="Admin"
          className="rounded px-2 py-1 text-[11px] transition-colors hover:text-[color:var(--ink-soft)]"
          style={{ color: "var(--ink-faint)" }}
        >
          ⚙
        </Link>
      </div>
    </header>
  );
}
