"use client";

import Link from "next/link";
import type { DropPackWithFonts } from "@/types";

export function DropPackAdminList({ packs }: { packs: DropPackWithFonts[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {packs.map((pack) => (
        <li
          key={pack.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3"
          style={{ borderColor: "var(--gray-80)" }}
        >
          <div>
            <p className="b1 font-medium" style={{ color: "var(--ink)" }}>
              {pack.baslik}
            </p>
            <p className="b3" style={{ color: "var(--ink-faint)" }}>
              /drops/{pack.slug} · {pack.fonts.length} font
              {!pack.yayinda ? " · gizli" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/drops/packs/${pack.id}`} className="btn btn-secondary">
              Düzenle
            </Link>
            <Link href={`/admin/drops/packs/${pack.id}/fonts`} className="btn btn-primary">
              Fontlar
            </Link>
          </div>
        </li>
      ))}
      {packs.length === 0 ? (
        <p className="b2" style={{ color: "var(--ink-faint)" }}>
          Henüz paket yok.
        </p>
      ) : null}
    </ul>
  );
}
