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
        className="h1 select-none"
        style={{ color: "var(--ink)" }}
      >
        {left}
        <em className="not-italic" style={{ color: "var(--accent)", fontStyle: "italic" }}>
          .{right}
        </em>
      </Link>
      <div className="flex items-center gap-3">
        <p className="b1 max-w-[280px]" style={{ color: "var(--b1-color)" }}>
          {settings.tagline}
        </p>
        <ThemeToggle />
        <Link
          href="/admin"
          title="Admin"
          aria-label="Admin"
          className="b3 rounded px-2 py-1 normal-case transition-colors hover:text-[color:var(--ink-soft)]"
          style={{ color: "var(--ink-faint)", letterSpacing: "var(--ls-2xs)" }}
        >
          ⚙
        </Link>
      </div>
    </header>
  );
}
