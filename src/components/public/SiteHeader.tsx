import Link from "next/link";
import type { SiteSettings } from "@/types";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { withLocale } from "@/lib/i18n/path";
import { t } from "@/lib/i18n/t";
import { normalizeBrandName } from "@/lib/brand";
import { ENABLE_THEME_TOGGLE } from "@/lib/theme/flags";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader({
  settings,
  locale = "tr",
  messages,
}: {
  settings: SiteSettings;
  locale?: Locale;
  messages?: Messages;
}) {
  const brandName = normalizeBrandName(settings.siteAdi);
  return (
    <header
      className="flex flex-wrap items-end justify-between gap-4 px-[4vw] pb-8 pt-10"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <Link
        href={withLocale("/works", locale)}
        title={messages ? t(messages, "nav.projects", "Projects") : "Ana sayfa"}
        aria-label={messages ? t(messages, "nav.projects", "Projects") : "Ana sayfa"}
        className="h1 select-none"
        style={{ color: "var(--ink)" }}
      >
        {brandName}
      </Link>
      <div className="flex items-center gap-3">
        <p className="b1 max-w-[280px]" style={{ color: "var(--b1-color)" }}>
          {settings.tagline}
        </p>
        {ENABLE_THEME_TOGGLE ? <ThemeToggle /> : null}
        <Link
          href="/admin"
          title="Admin"
          aria-label="Admin"
          className="b3 rounded px-2 py-1 lowercase transition-colors hover:text-[color:var(--ink-soft)]"
          style={{ color: "var(--ink-faint)", letterSpacing: "var(--ls-2xs)" }}
        >
          ⚙
        </Link>
      </div>
    </header>
  );
}
