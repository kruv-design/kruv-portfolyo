import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin, supabasePublic } from "@/lib/supabase/server";
import { projectSchema, projectPayloadToDbRow } from "@/lib/validators";
import { slugify } from "@/lib/slugify";
import { requireUser, isAuthFailureResponse } from "@/lib/auth-guard";
import { mapProjectRow } from "@/lib/map-project-row";

export const dynamic = "force-dynamic";

const NO_STORE = {
  "Cache-Control": "private, no-store, max-age=0, must-revalidate",
};

export async function GET() {
  /** Oturum çerezi gerekmez; anon + RLS public read — kruv.html ile aynı yol */
  const sb = supabasePublic();
  const { data, error } = await sb
    .from("projects")
    .select("*")
    .order("sira", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: NO_STORE },
    );
  }
  const rows = (data ?? []).map((row) =>
    mapProjectRow(row as Record<string, unknown>),
  );
  return NextResponse.json({ data: rows }, { headers: NO_STORE });
}

export async function POST(req: Request) {
  try {
    await requireUser();
  } catch (e) {
    if (isAuthFailureResponse(e)) return e;
    throw e;
  }

  try {
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

    const sb = supabaseAdmin();

    // find next sira
    const { data: maxRow } = await sb
      .from("projects")
      .select("sira")
      .order("sira", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextSira = (maxRow?.sira ?? 0) + 10;

    const row = { ...projectPayloadToDbRow(input, slug), sira: nextSira };
    const { data, error } = await sb
      .from("projects")
      .insert(row)
      .select("*")
      .single();

    if (error) {
      const message =
        error.code === "23505"
          ? "Bu slug zaten kullanılıyor."
          : error.message;
      return NextResponse.json({ error: message }, { status: 400 });
    }

    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/works");
    revalidatePath("/admin");
    revalidatePath(`/projects/${slug}`);
    return NextResponse.json(
      { data: mapProjectRow(data as Record<string, unknown>) },
      { status: 201 },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[POST /api/projects]", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
