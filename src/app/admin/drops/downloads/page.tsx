import Link from "next/link";
import type { ReactNode } from "react";
import {
  getDropDownloadsAdmin,
  getDropFontEventsAdmin,
} from "@/lib/drops-queries";
import { inboundLabel } from "@/lib/drops-traffic";
import type { DropDownloadRow, DropFontEventRow } from "@/types";

export const dynamic = "force-dynamic";

type FontStat = {
  key: string;
  label: string;
  downloads: number;
  uniqueEmails: number;
  clicks: number;
  views: number;
};

function sourceLabel(source: string): string {
  if (source === "listing") return "liste";
  if (source === "detail") return "detay";
  return source || "—";
}

function formatWhen(iso: string): string {
  if (!iso) return "—";
  return iso.slice(0, 16).replace("T", " ");
}

function buildFontStats(
  downloads: DropDownloadRow[],
  events: DropFontEventRow[],
): FontStat[] {
  const map = new Map<string, FontStat & { emails: Set<string> }>();

  const ensure = (key: string, label: string) => {
    const existing = map.get(key);
    if (existing) return existing;
    const created = {
      key,
      label,
      downloads: 0,
      uniqueEmails: 0,
      clicks: 0,
      views: 0,
      emails: new Set<string>(),
    };
    map.set(key, created);
    return created;
  };

  for (const row of downloads) {
    const key = row.font_slug || row.pack_slug || row.download_type;
    const label =
      row.font_name ||
      row.font_slug ||
      (row.download_type === "pack"
        ? `${row.pack_name || row.pack_slug || "paket"} (paket)`
        : "font");
    const stat = ensure(key, label);
    stat.downloads += 1;
    if (row.email) stat.emails.add(row.email.toLowerCase());
  }

  for (const ev of events) {
    const key = ev.font || ev.pack || "—";
    const stat = ensure(key, ev.font || ev.pack || "—");
    if (ev.event_name === "drop_font_click") stat.clicks += 1;
    if (ev.event_name === "drop_font_view") stat.views += 1;
  }

  return [...map.values()]
    .map(({ emails, ...rest }) => ({
      ...rest,
      uniqueEmails: emails.size,
    }))
    .sort((a, b) => b.downloads - a.downloads || b.clicks - a.clicks);
}

export default async function AdminDropDownloadsPage() {
  const [rows, events] = await Promise.all([
    getDropDownloadsAdmin(),
    getDropFontEventsAdmin(),
  ]);
  const stats = buildFontStats(rows, events);
  const uniqueEmails = new Set(rows.map((r) => r.email.toLowerCase())).size;
  const clickCount = events.filter((e) => e.event_name === "drop_font_click").length;
  const viewCount = events.filter((e) => e.event_name === "drop_font_view").length;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="h2" style={{ color: "var(--ink)" }}>
            Drop indirmeleri
          </h1>
          <p className="b2 mt-2" style={{ color: "var(--ink-faint)" }}>
            İsim ve e-posta yalnızca indirme formunu dolduranlarda görünür. Tıklama
            ve sayfa görüntüleme çerez onayı veren ziyaretçilerden gelir.
          </p>
        </div>
        <Link href="/admin/drops" className="btn btn-secondary">
          ← Drops
        </Link>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-4">
        <StatCard label="İndirme" value={rows.length} />
        <StatCard label="Kişi (e-posta)" value={uniqueEmails} />
        <StatCard label="Font tıklama" value={clickCount} />
        <StatCard label="Detay görüntüleme" value={viewCount} />
      </div>

      <h2 className="h3 mb-3" style={{ color: "var(--ink)" }}>
        Font başına
      </h2>
      <div
        className="mb-10 overflow-x-auto rounded-lg"
        style={{ border: "1px solid var(--adm-border)" }}
      >
        <table className="w-full border-collapse text-left">
          <thead>
            <tr style={{ background: "var(--adm-surface)", color: "var(--gray-1000)" }}>
              <Th>Font</Th>
              <Th>İndirme</Th>
              <Th>Kişi</Th>
              <Th>Tıklama</Th>
              <Th>Görüntüleme</Th>
            </tr>
          </thead>
          <tbody>
            {stats.length === 0 ? (
              <tr>
                <td className="b2 px-3 py-4" colSpan={5} style={{ color: "var(--ink-faint)" }}>
                  Henüz kayıt yok.
                </td>
              </tr>
            ) : (
              stats.map((stat) => (
                <tr
                  key={stat.key}
                  className="border-t b2"
                  style={{ borderColor: "var(--adm-border)", color: "var(--gray-600)" }}
                >
                  <td className="px-3 py-2">{stat.label}</td>
                  <td className="px-3 py-2">{stat.downloads}</td>
                  <td className="px-3 py-2">{stat.uniqueEmails}</td>
                  <td className="px-3 py-2">{stat.clicks}</td>
                  <td className="px-3 py-2">{stat.views}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="h3 mb-3" style={{ color: "var(--ink)" }}>
        Kim indirdi
      </h2>
      <div
        className="mb-10 overflow-x-auto rounded-lg"
        style={{ border: "1px solid var(--adm-border)" }}
      >
        <table className="w-full border-collapse text-left">
          <thead>
            <tr style={{ background: "var(--adm-surface)", color: "var(--gray-1000)" }}>
              <Th>Tarih</Th>
              <Th>İsim</Th>
              <Th>E-posta</Th>
              <Th>Font</Th>
              <Th>Tür</Th>
              <Th>Nereden indirdi</Th>
              <Th>Nereden geldi</Th>
              <Th>Ülke</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="b2 px-3 py-4" colSpan={8} style={{ color: "var(--ink-faint)" }}>
                  Henüz indirme kaydı yok. Supabase SQL Editor’de{" "}
                  <code className="b2">RUN_ME_drop_downloads_traffic.sql</code> çalıştırın;
                  ardından siteden bir font indirin.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t b2"
                  style={{ borderColor: "var(--adm-border)", color: "var(--gray-600)" }}
                >
                  <td className="px-3 py-2 whitespace-nowrap">{formatWhen(row.created_at)}</td>
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2">{row.email}</td>
                  <td className="px-3 py-2">
                    {row.font_name || row.font_slug || (row.download_type === "pack" ? "paket" : "—")}
                  </td>
                  <td className="px-3 py-2">{row.download_type}</td>
                  <td className="px-3 py-2">{sourceLabel(row.source)}</td>
                  <td className="px-3 py-2">{inboundLabel(row.page, row.referrer)}</td>
                  <td className="px-3 py-2">{row.country || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="h3 mb-3" style={{ color: "var(--ink)" }}>
        Tıklama ve görüntüleme
      </h2>
      <p className="b2 mb-3" style={{ color: "var(--ink-faint)" }}>
        Bu listede kişi adı yoktur — ziyaretçi form doldurmadan tanınmaz.
      </p>
      <div
        className="overflow-x-auto rounded-lg"
        style={{ border: "1px solid var(--adm-border)" }}
      >
        <table className="w-full border-collapse text-left">
          <thead>
            <tr style={{ background: "var(--adm-surface)", color: "var(--gray-1000)" }}>
              <Th>Tarih</Th>
              <Th>Olay</Th>
              <Th>Font</Th>
              <Th>Sayfa</Th>
              <Th>Nereden geldi</Th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td className="b2 px-3 py-4" colSpan={5} style={{ color: "var(--ink-faint)" }}>
                  Tıklama kaydı yok. Ziyaretçi çerez bannerında birinci taraf analitiği
                  kabul etmiş olmalı.
                </td>
              </tr>
            ) : (
              events.slice(0, 200).map((ev) => (
                <tr
                  key={ev.id}
                  className="border-t b2"
                  style={{ borderColor: "var(--adm-border)", color: "var(--gray-600)" }}
                >
                  <td className="px-3 py-2 whitespace-nowrap">{formatWhen(ev.created_at)}</td>
                  <td className="px-3 py-2">{eventLabel(ev.event_name)}</td>
                  <td className="px-3 py-2">{ev.font || "—"}</td>
                  <td className="px-3 py-2">{ev.page || "—"}</td>
                  <td className="px-3 py-2">{inboundLabel(ev.page, ev.referrer)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function eventLabel(name: string): string {
  if (name === "drop_font_click") return "tıklama";
  if (name === "drop_font_view") return "görüntüleme";
  if (name === "drop_download_open") return "indirme formu";
  if (name === "drop_download") return "indirme";
  return name;
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th className="b3 px-3 py-2 uppercase" style={{ letterSpacing: "var(--ls-2xl)" }}>
      {children}
    </th>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="rounded-lg px-4 py-3"
      style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)" }}
    >
      <p className="b3" style={{ color: "var(--ink-faint)" }}>
        {label}
      </p>
      <p className="h2 mt-1" style={{ color: "var(--ink)" }}>
        {value}
      </p>
    </div>
  );
}
