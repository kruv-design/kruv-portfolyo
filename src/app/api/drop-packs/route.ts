import { NextResponse } from "next/server";
import { supabaseAdmin, supabasePublic } from "@/lib/supabase/server";
import { dropPackSchema, dropPackPayloadToDbRow } from "@/lib/validators";
import { slugify } from "@/lib/slugify";
import { requireUser, isAuthFailureResponse } from "@/lib/auth-guard";
import { mapDropPackRow } from "@/lib/map-drop-row";
import { revalidateDropsPaths } from "@/lib/revalidate-i18n";

export const dynamic = "force-dynamic";

const NO_STORE = {
  "Cache-Control": "private, no-store, max-age=0, must-revalidate",
};

export async function GET() {
  const sb = supabasePublic();
  const { data, error } = await sb
    .from("drop_packs")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: NO_STORE },
    );
  }
  return NextResponse.json(
    { data: (data ?? []).map((r) => mapDropPackRow(r as Record<string, unknown>)) },
    { headers: NO_STORE },
  );
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
    const parsed = dropPackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri.", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const input = parsed.data;
    const slug = input.slug?.trim() || slugify(input.baslik);
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("drop_packs")
      .insert(dropPackPayloadToDbRow(input, slug))
      .select("*")
      .single();
    if (error) {
      const message =
        error.code === "23505" ? "Bu slug zaten kullanılıyor." : error.message;
      return NextResponse.json({ error: message }, { status: 400 });
    }
    revalidateDropsPaths(slug);
    return NextResponse.json(
      { data: mapDropPackRow(data as Record<string, unknown>) },
      { status: 201 },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[POST /api/drop-packs]", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
