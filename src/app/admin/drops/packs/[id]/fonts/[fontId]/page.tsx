import { notFound } from "next/navigation";
import { getDropPackAdminById } from "@/lib/drops-queries";
import { DropFontForm } from "@/components/admin/DropFontForm";

export default async function AdminEditDropFontPage({
  params,
}: {
  params: Promise<{ id: string; fontId: string }>;
}) {
  const { id, fontId } = await params;
  const pack = await getDropPackAdminById(id);
  if (!pack) notFound();
  const font = pack.fonts.find((f) => f.id === fontId);
  if (!font) notFound();

  return (
    <>
      <h1 className="h2 mb-8" style={{ color: "var(--ink)" }}>
        Font düzenle — {font.name}
      </h1>
      <DropFontForm
        mode="edit"
        packId={pack.id}
        font={font}
        backHref={`/admin/drops/packs/${id}/fonts`}
      />
    </>
  );
}
