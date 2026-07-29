import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { dropPackSchema, dropPackPayloadToDbRow } from "@/lib/validators";
import { slugify } from "@/lib/slugify";
import { requireUser, isAuthFailureResponse } from "@/lib/auth-guard";
import { mapDropPackRow } from "@/lib/map-drop-row";
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
      .update(dropPackPayloadToDbRow(input, slug))
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    revalidateDropsPaths(slug);
    return NextResponse.json({
      data: mapDropPackRow(data as Record<string, unknown>),
    });
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
  const { error } = await sb.from("drop_packs").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  revalidateDropsPaths();
  return NextResponse.json({ data: { ok: true } });
}
