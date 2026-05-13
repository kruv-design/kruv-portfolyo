import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { mapProjectRow } from "@/lib/map-project-row";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  noStore();
  const { id } = await params;
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) notFound();

  const project = mapProjectRow(data as Record<string, unknown>);

  return <ProjectForm key={project.id} mode="edit" project={project} />;
}
