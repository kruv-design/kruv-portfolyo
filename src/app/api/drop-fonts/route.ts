import { NextResponse } from "next/server";
import { supabaseAdmin, supabasePublic } from "@/lib/supabase/server";
import { dropFontSchema, dropFontPayloadToDbRow } from "@/lib/validators";
import { slugify } from "@/lib/slugify";
import { requireUser, isAuthFailureResponse } from "@/lib/auth-guard";
import { mapDropFontRow } from "@/lib/map-drop-row";
import { revalidateDropsPaths } from "@/lib/revalidate-i18n";

export const dynamic = "force-dynamic";

const NO_STORE = {
  "Cache-Control": "private, no-store, max-age=0, must-revalidate",
};

export async function GET(req: Request) {
  const packId = new URL(req.url).searchParams.get("packId");
  const sb = supabasePublic();
  let q = sb.from("drop_fonts").select("*").order("sort_order", { ascending: true });
  if (packId) q = q.eq("pack_id", packId);
  const { data, error } = await q;
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: NO_STORE },
    );
  }
  return NextResponse.json(
    { data: (data ?? []).map((r) => mapDropFontRow(r as Record<string, unknown>)) },
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
    const parsed = dropFontSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri.", details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const input = parsed.data;
    const slug = input.slug?.trim() || slugify(input.name);
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("drop_fonts")
      .insert(dropFontPayloadToDbRow(input, slug))
      .select("*")
      .single();
    if (error) {
      const message =
        error.code === "23505" ? "Bu slug zaten kullanılıyor." : error.message;
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const row = mapDropFontRow(data as Record<string, unknown>);
    const { data: pack } = await sb
      .from("drop_packs")
      .select("slug")
      .eq("id", row.pack_id)
      .maybeSingle();
    revalidateDropsPaths(pack?.slug ?? undefined, row.slug);
    return NextResponse.json({ data: row }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[POST /api/drop-fonts]", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
