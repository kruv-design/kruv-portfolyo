import type { SiteSettings } from "@/types";

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
      className="mt-0.5 flex flex-wrap items-center justify-between gap-4 px-[4vw] py-7 text-[12px]"
      style={{
        borderTop: "1px solid var(--border)",
        color: "var(--ink-faint)",
      }}
    >
      <span>
        {typeof count === "number" && typeof total === "number"
          ? `${count} / ${total} proje`
          : ""}
      </span>
      <span>{settings.footerYazi}</span>
    </footer>
  );
}
