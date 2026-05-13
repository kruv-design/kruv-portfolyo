import Link from "next/link";
import { getProjectsAdmin } from "@/lib/queries";
import { ProjectList } from "@/components/admin/ProjectList";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const projects = await getProjectsAdmin();

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="h2" style={{ color: "var(--ink)" }}>
          Projeler
        </h1>
        <Link href="/admin/projects/new" className="btn btn-primary">
          ＋ Yeni Proje
        </Link>
      </div>
      <ProjectList initial={projects} />
    </>
  );
}
