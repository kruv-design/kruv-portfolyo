import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { projectSchema } from "@/lib/validators";
import { slugify } from "@/lib/slugify";
import { requireUser } from "@/lib/auth-guard";

export async function GET() {
  const sb = await supabaseServer();
  const { data, error } = await sb
    .from("projects")
    .select("*")
    .order("sira", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  try {
    await requireUser();
  } catch (res) {
    return res as Response;
  }

  const body = await req.json().catch(() => ({}));
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Geçersiz veri.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const slug = input.slug?.trim() || slugify(input.baslik);

  const sb = await supabaseServer();

  // find next sira
  const { data: maxRow } = await sb
    .from("projects")
    .select("sira")
    .order("sira", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSira = (maxRow?.sira ?? 0) + 10;

  const { data, error } = await sb
    .from("projects")
    .insert({ ...input, slug, sira: nextSira })
    .select("*")
    .single();

  if (error) {
    const message =
      error.code === "23505"
        ? "Bu slug zaten kullanılıyor."
        : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  revalidatePath("/");
  revalidatePath(`/projects/${slug}`);
  return NextResponse.json({ data }, { status: 201 });
}
