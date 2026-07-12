"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/login/actions";
import { BRAND_NAME } from "@/lib/brand";

const NAV = [
  { href: "/admin", label: "Projeler", icon: "▦" },
  { href: "/admin/projects/new", label: "Yeni Proje", icon: "＋" },
  { href: "/admin/blog", label: "Blog", icon: "✎" },
  { href: "/admin/blog/new", label: "Yeni Yazı", icon: "＋" },
  { href: "/admin/contact-inquiries", label: "İletişim", icon: "✉" },
  { href: "/admin/settings", label: "Ayarlar", icon: "⚙" },
  { href: "/", label: "Siteye Git", icon: "◉", external: true },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <nav
      className="sticky top-0 flex h-screen w-[220px] flex-shrink-0 flex-col overflow-y-auto py-6"
      style={{ background: "var(--adm-sidebar)" }}
    >
      <div
        className="px-6 pb-6"
        style={{ borderBottom: "1px solid var(--gray-80)" }}
      >
        <Link
          href="/admin"
          className="h3 leading-none"
          style={{ color: "var(--gray-1000)", letterSpacing: "0.04em" }}
        >
          {BRAND_NAME}
        </Link>
        <div
          className="b3 mt-2 lowercase"
          style={{ color: "var(--gray-400)", letterSpacing: "0.18em" }}
        >
          Admin
        </div>
      </div>

      <div className="flex-1 py-4">
        {NAV.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : item.href === "/admin/blog"
                ? pathname === "/admin/blog" ||
                  (pathname.startsWith("/admin/blog/") &&
                    !pathname.startsWith("/admin/blog/new"))
                : pathname.startsWith(item.href) && item.href !== "/";
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-6 py-2.5 b2 lowercase transition-colors"
              style={{
                color: isActive ? "var(--gray-1000)" : "var(--adm-sidebar-text)",
                borderLeft: "2px solid transparent",
                borderLeftColor: isActive ? "var(--accent)" : "transparent",
                background: isActive ? "var(--gray-70)" : "transparent",
              }}
            >
              <span className="h4 w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>

      <form
        action={logoutAction}
        className="px-6 pt-4"
        style={{ borderTop: "1px solid var(--gray-80)" }}
      >
        <button
          type="submit"
          className="b2 w-full px-0 py-2 text-left lowercase transition-colors"
          style={{ color: "var(--gray-400)" }}
        >
          ← Çıkış
        </button>
      </form>
    </nav>
  );
}
