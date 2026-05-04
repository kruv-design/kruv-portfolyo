import type { SiteSettings } from "@/types";
import { SocialFooterLinks } from "./SocialFooterLinks";

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
      className="b2 mt-0.5 flex flex-wrap items-center justify-between gap-4 px-[4vw] py-7"
      style={{
        borderTop: "1px solid var(--border)",
        color: "var(--ink-faint)",
      }}
    >
      <span className="min-w-0 flex-shrink-0">
        {typeof count === "number" && typeof total === "number"
          ? `${count} / ${total} proje`
          : ""}
      </span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-4 sm:justify-between">
        <span className="min-w-0 text-center sm:flex-1 sm:text-center">
          {settings.footerYazi}
        </span>
        <SocialFooterLinks settings={settings} />
      </div>
    </footer>
  );
}
