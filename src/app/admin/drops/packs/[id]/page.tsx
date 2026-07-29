import { notFound } from "next/navigation";
import { getDropPackAdminById } from "@/lib/drops-queries";
import { DropPackForm } from "@/components/admin/DropPackForm";

export default async function AdminEditDropPackPage({
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
        Paket düzenle
      </h1>
      <DropPackForm mode="edit" pack={pack} />
    </>
  );
}
