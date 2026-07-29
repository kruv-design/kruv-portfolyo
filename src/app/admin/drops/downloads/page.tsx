import Link from "next/link";
import { getDropDownloadsAdmin } from "@/lib/drops-queries";

export const dynamic = "force-dynamic";

export default async function AdminDropDownloadsPage() {
  const rows = await getDropDownloadsAdmin();

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="h2" style={{ color: "var(--ink)" }}>
          Drop indirmeleri
        </h1>
        <Link href="/admin/drops" className="btn btn-secondary">
          ← Drops
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full b2" style={{ color: "var(--ink)" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--gray-80)" }}>
              <th className="py-2 text-left">Tarih</th>
              <th className="py-2 text-left">İsim</th>
              <th className="py-2 text-left">E-posta</th>
              <th className="py-2 text-left">Tür</th>
              <th className="py-2 text-left">Locale</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid var(--gray-70)" }}>
                <td className="py-2 pr-4 whitespace-nowrap">{row.created_at.slice(0, 16).replace("T", " ")}</td>
                <td className="py-2 pr-4">{row.name}</td>
                <td className="py-2 pr-4">{row.email}</td>
                <td className="py-2 pr-4">{row.download_type}</td>
                <td className="py-2">{row.locale}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="b2 mt-4" style={{ color: "var(--ink-faint)" }}>
            Henüz indirme kaydı yok.
          </p>
        ) : null}
      </div>
    </>
  );
}
