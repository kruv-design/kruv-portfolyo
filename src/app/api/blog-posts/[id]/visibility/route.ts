import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";
import { requireUser, isAuthFailureResponse } from "@/lib/auth-guard";
import { revalidateBlogPaths } from "@/lib/revalidate-i18n";
import { mapBlogRow } from "@/lib/map-blog-row";

type Ctx = { params: Promise<{ id: string }> };

const bodySchema = z.object({ yayinda: z.boolean() });

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    await requireUser();
  } catch (e) {
    if (isAuthFailureResponse(e)) return e;
    throw e;
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "yayinda alanı boolean olmalı." },
      { status: 400 },
    );
  }

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("blog_posts")
    .update({ yayinda: parsed.data.yayinda })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 });

  const post = mapBlogRow(data as Record<string, unknown>);
  revalidateBlogPaths(post.slug);

  return NextResponse.json({ data: post });
}
