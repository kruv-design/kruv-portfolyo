import Link from "next/link";
import type { SiteSettings } from "@/types";
import { SocialFooterLinks } from "./SocialFooterLinks";

const SERVICES = [
  "Brand identity",
  "Packaging",
  "Editorial",
  "UI/UX",
  "Illustration",
] as const;

const footerLinkClass =
  "b2 block lowercase transition-colors duration-150 hover:text-[color:var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]";

export function SiteFooter({
  settings,
  count,
  total,
}: {
  settings: SiteSettings;
  count?: number;
  total?: number;
}) {
  return (
    <footer
      id="contact"
      lang="en"
      className="mt-auto border-t px-[4vw] pb-10 pt-14"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg)",
        color: "var(--ink-soft)",
      }}
    >
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-14">
        <div>
          <h2
            className="b3 mb-4"
            style={{ color: "var(--ink-faint)", letterSpacing: "var(--ls-2xl)" }}
          >
            Services
          </h2>
          <ul className="flex flex-col gap-2.5">
            {SERVICES.map((label) => (
              <li key={label}>
                <span className="b2 lowercase" style={{ color: "var(--ink-soft)" }}>
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Sitemap">
          <h2
            className="b3 mb-4"
            style={{ color: "var(--ink-faint)", letterSpacing: "var(--ls-2xl)" }}
          >
            Sitemap
          </h2>
          <ul className="flex flex-col gap-2.5">
            <li>
              <Link href="/" className={footerLinkClass} style={{ color: "var(--ink-soft)" }}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/works#about"
                className={footerLinkClass}
                style={{ color: "var(--ink-soft)" }}
              >
                About us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={footerLinkClass}
                style={{ color: "var(--ink-soft)" }}
              >
                Contact us
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sm:col-span-2 lg:col-span-1">
          <h2
            className="b3 mb-4"
            style={{ color: "var(--ink-faint)", letterSpacing: "var(--ls-2xl)" }}
          >
            Follow
          </h2>
          <SocialFooterLinks settings={settings} />
        </div>
      </div>

      <div
        className={`mx-auto mt-12 flex max-w-6xl flex-wrap items-center gap-4 border-t pt-8 ${
          typeof count === "number" && typeof total === "number"
            ? "justify-between"
            : "justify-end"
        }`}
        style={{ borderColor: "var(--border)" }}
      >
        <span className="b2 min-w-0 flex-shrink-0 lowercase" style={{ color: "var(--ink-faint)" }}>
          {typeof count === "number" && typeof total === "number"
            ? `${count} / ${total} projects`
            : ""}
        </span>
        <p className="b2 min-w-0 flex-1 text-right lowercase" style={{ color: "var(--ink-faint)" }}>
          {settings.footerYazi}
        </p>
      </div>
    </footer>
  );
}
