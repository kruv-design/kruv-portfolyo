import { notFound } from "next/navigation";
import { getDropPackAdminById } from "@/lib/drops-queries";
import { DropFontForm } from "@/components/admin/DropFontForm";

export default async function AdminNewDropFontPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pack = await getDropPackAdminById(id);
  if (!pack) notFound();

  return (
    <>
      <h1 className="h2 mb-8" style={{ color: "var(--ink)" }}>
        Yeni font — {pack.baslik}
      </h1>
      <DropFontForm
        mode="create"
        packId={pack.id}
        backHref={`/admin/drops/packs/${id}/fonts`}
      />
    </>
  );
}
