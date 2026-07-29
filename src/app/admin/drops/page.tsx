import Link from "next/link";
import { getDropPacksAdmin } from "@/lib/drops-queries";
import { DropPackAdminList } from "@/components/admin/DropPackAdminList";

export const dynamic = "force-dynamic";

export default async function AdminDropsPage() {
  const packs = await getDropPacksAdmin();

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="h2" style={{ color: "var(--ink)" }}>
          Drops
        </h1>
        <div className="flex gap-2">
          <Link href="/admin/drops/downloads" className="btn btn-secondary">
            İndirmeler
          </Link>
          <Link href="/admin/drops/packs/new" className="btn btn-primary">
            ＋ Yeni Paket
          </Link>
        </div>
      </div>
      <DropPackAdminList packs={packs} />
    </>
  );
}
