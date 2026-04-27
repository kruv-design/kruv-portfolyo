import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { projectSchema } from "@/lib/validators";
import { slugify } from "@/lib/slugify";
import { requireUser } from "@/lib/auth-guard";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    await requireUser();
  } catch (res) {
    return res as Response;
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz veri.", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const slug = input.slug?.trim() || slugify(input.baslik);

  const sb = await supabaseServer();
  const { data, error } = await sb
    .from("projects")
    .update({ ...input, slug })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    const message =
      error.code === "23505" ? "Bu slug zaten kullanılıyor." : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  revalidatePath("/");
  revalidatePath(`/projects/${slug}`);
  return NextResponse.json({ data });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    await requireUser();
  } catch (res) {
    return res as Response;
  }
  const { id } = await params;
  const sb = await supabaseServer();
  const { error } = await sb.from("projects").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/");
  return NextResponse.json({ data: { ok: true } });
}
