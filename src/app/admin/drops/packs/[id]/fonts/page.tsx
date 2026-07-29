import Link from "next/link";
import { notFound } from "next/navigation";
import { getDropPackAdminById } from "@/lib/drops-queries";

export default async function AdminDropFontsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pack = await getDropPackAdminById(id);
  if (!pack) notFound();

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="h2" style={{ color: "var(--ink)" }}>
            {pack.baslik} — fontlar
          </h1>
          <p className="b2" style={{ color: "var(--ink-faint)" }}>
            /drops/{pack.slug}
          </p>
        </div>
        <Link href={`/admin/drops/packs/${id}/fonts/new`} className="btn btn-primary">
          ＋ Yeni font
        </Link>
      </div>
      <ul className="flex flex-col gap-3">
        {pack.fonts.map((font) => (
          <li
            key={font.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3"
            style={{ borderColor: "var(--gray-80)" }}
          >
            <div>
              <p className="b1 font-medium" style={{ color: "var(--ink)" }}>
                {font.name}
              </p>
              <p className="b3" style={{ color: "var(--ink-faint)" }}>
                {font.slug}
                {!font.yayinda ? " · gizli" : ""}
              </p>
            </div>
            <Link href={`/admin/drops/packs/${id}/fonts/${font.id}`} className="btn btn-secondary">
              Düzenle
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/admin/drops" className="btn btn-secondary mt-8 inline-flex">
        ← Drops
      </Link>
    </>
  );
}
