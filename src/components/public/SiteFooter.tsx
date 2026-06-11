import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { withLocale } from "@/lib/i18n/path";
import type { SiteSettings } from "@/types";
import { ENABLE_PUBLIC_CONTACT } from "@/lib/marketing-flags";
import { SocialFooterLinks } from "./SocialFooterLinks";

function footerWorksHref(locale: Locale, filter?: string): string {
  const base = withLocale("/works", locale);
  return filter ? `${base}?filter=${filter}` : base;
}

export function SiteFooter({
  settings,
  locale,
  messages,
  count,
  total,
}: {
  settings: SiteSettings;
  locale: Locale;
  messages: Messages;
  count?: number;
  total?: number;
}) {
  const copy = messages.footer;
  const showCount =
    typeof count === "number" && typeof total === "number";

  return (
    <footer className="site-footer" id="contact" lang={locale}>
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-col">
            <h3 className="site-footer-heading">{copy.services}</h3>
            <ul className="site-footer-list site-footer-services">
              {copy.serviceLinks.map(({ label, filter }) => (
                <li key={`${filter}-${label}`}>
                  <Link
                    href={footerWorksHref(locale, filter)}
                    className="site-footer-service-link"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <nav className="site-footer-col" aria-label={copy.sitemapAria}>
            <h3 className="site-footer-heading">{copy.sitemap}</h3>
            <ul className="site-footer-list site-footer-links">
              <li>
                <Link href={`${withLocale("/", locale)}#hero`}>{copy.home}</Link>
              </li>
              <li>
                <Link href={footerWorksHref(locale)}>{copy.projects}</Link>
              </li>
              {ENABLE_PUBLIC_CONTACT ? (
                <li>
                  <Link href={withLocale("/contact", locale)}>{copy.contact}</Link>
                </li>
              ) : null}
            </ul>
          </nav>

          <div className="site-footer-col site-footer-col--follow">
            <h3 className="site-footer-heading">{copy.follow}</h3>
            <SocialFooterLinks settings={settings} messages={messages} />
          </div>
        </div>

        <div
          className={`site-footer-bar${
            showCount ? " site-footer-bar--split" : ""
          }`}
        >
          {showCount ? (
            <p className="b2 site-footer-count">
              {copy.projectCount
                .replace("{count}", String(count))
                .replace("{total}", String(total))}
            </p>
          ) : null}
          <p className="b2 site-footer-legal">{settings.footerYazi}</p>
        </div>
      </div>
    </footer>
  );
}
