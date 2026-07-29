import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { dropFontSchema, dropFontPayloadToDbRow } from "@/lib/validators";
import { slugify } from "@/lib/slugify";
import { requireUser, isAuthFailureResponse } from "@/lib/auth-guard";
import { mapDropFontRow } from "@/lib/map-drop-row";
import { revalidateDropsPaths } from "@/lib/revalidate-i18n";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    await requireUser();
  } catch (e) {
    if (isAuthFailureResponse(e)) return e;
    throw e;
  }

  const { id } = await ctx.params;
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
      .update(dropFontPayloadToDbRow(input, slug))
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const row = mapDropFontRow(data as Record<string, unknown>);
    const { data: pack } = await sb
      .from("drop_packs")
      .select("slug")
      .eq("id", row.pack_id)
      .maybeSingle();
    revalidateDropsPaths(pack?.slug ?? undefined, row.slug);
    return NextResponse.json({ data: row });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    await requireUser();
  } catch (e) {
    if (isAuthFailureResponse(e)) return e;
    throw e;
  }

  const { id } = await ctx.params;
  const sb = supabaseAdmin();
  const { data: font } = await sb
    .from("drop_fonts")
    .select("slug, pack_id")
    .eq("id", id)
    .maybeSingle();
  const { error } = await sb.from("drop_fonts").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (font?.pack_id) {
    const { data: pack } = await sb
      .from("drop_packs")
      .select("slug")
      .eq("id", font.pack_id)
      .maybeSingle();
    revalidateDropsPaths(pack?.slug ?? undefined, font.slug ?? undefined);
  } else {
    revalidateDropsPaths();
  }
  return NextResponse.json({ data: { ok: true } });
}
