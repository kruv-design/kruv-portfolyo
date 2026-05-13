import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { getSettings } from "@/lib/queries";
import { settingsSchema } from "@/lib/validators";
import { requireUser, isAuthFailureResponse } from "@/lib/auth-guard";

/** Public footer / kruv.html: yalnızca sosyal URL’ler (auth yok). */
export async function GET() {
  try {
    const s = await getSettings();
    return NextResponse.json({
      data: {
        instagramUrl: s.instagramUrl,
        behanceUrl: s.behanceUrl,
        linkedinUrl: s.linkedinUrl,
        dribbbleUrl: s.dribbbleUrl,
        pinterestUrl: s.pinterestUrl,
        youtubeUrl: s.youtubeUrl,
        xUrl: s.xUrl,
        githubUrl: s.githubUrl,
      },
    });
  } catch {
    return NextResponse.json({ data: {} });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireUser();
  } catch (e) {
    if (isAuthFailureResponse(e)) return e;
    throw e;
  }

  const body = await req.json().catch(() => ({}));
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz veri.", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const sb = await supabaseServer();
  const { data, error } = await sb
    .from("site_settings")
    .update(parsed.data)
    .eq("id", 1)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  revalidatePath("/", "layout");
  return NextResponse.json({ data });
}
