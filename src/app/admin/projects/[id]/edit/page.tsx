import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/ProjectForm";
import type { Project, ProjectSection } from "@/types";

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const sb = await supabaseServer();
  const { data, error } = await sb
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) notFound();

  const project: Project = {
    id: String(data.id),
    slug: String(data.slug),
    baslik: String(data.baslik ?? ""),
    kategori: String(data.kategori ?? ""),
    aciklama: String(data.aciklama ?? ""),
    gorsel: (data.gorsel as string) || null,
    gorseller: Array.isArray(data.gorseller) ? (data.gorseller as string[]) : [],
    bolumler: Array.isArray(data.bolumler)
      ? (data.bolumler as ProjectSection[])
      : [],
    etiketler: Array.isArray(data.etiketler) ? (data.etiketler as string[]) : [],
    yil: String(data.yil ?? ""),
    musteri: String(data.musteri ?? ""),
    rol: String(data.rol ?? ""),
    sure: String(data.sure ?? ""),
    link: String(data.link ?? ""),
    featured: Boolean(data.featured),
    renk: String(data.renk ?? "#C8B8A8"),
    sira: Number(data.sira ?? 0),
    created_at: String(data.created_at ?? ""),
    updated_at: String(data.updated_at ?? ""),
  };

  return <ProjectForm mode="edit" project={project} />;
}
