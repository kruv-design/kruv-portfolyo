import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { blogPostSchema, blogPayloadToDbRow } from "@/lib/validators";
import { slugify } from "@/lib/slugify";
import { requireUser, isAuthFailureResponse } from "@/lib/auth-guard";
import { mapBlogRow } from "@/lib/map-blog-row";
import { revalidateBlogPaths } from "@/lib/revalidate-i18n";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    await requireUser();
  } catch (e) {
    if (isAuthFailureResponse(e)) return e;
    throw e;
  }

  try {
    const { id: rawId } = await params;
    const id = rawId.trim();
    const body = await req.json().catch(() => ({}));
    const parsed = blogPostSchema.safeParse(body);
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
      .from("blog_posts")
      .update(blogPayloadToDbRow(input, slug))
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      const message =
        error.code === "23505" ? "Bu slug zaten kullanılıyor." : error.message;
      return NextResponse.json({ error: message }, { status: 400 });
    }
    if (!data) {
      return NextResponse.json(
        { error: "Yazı bulunamadı veya güncellenemedi (id eşleşmedi)." },
        { status: 404 },
      );
    }

    revalidateBlogPaths(slug);
    return NextResponse.json({
      data: mapBlogRow(data as Record<string, unknown>),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[PATCH /api/blog-posts/[id]]", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    await requireUser();
  } catch (e) {
    if (isAuthFailureResponse(e)) return e;
    throw e;
  }
  const { id: rawId } = await params;
  const id = rawId.trim();
  const sb = supabaseAdmin();
  const { error } = await sb.from("blog_posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidateBlogPaths();
  return NextResponse.json({ data: { ok: true } });
}
