import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { settingsSchema } from "@/lib/validators";
import { requireUser } from "@/lib/auth-guard";

export async function PATCH(req: Request) {
  try {
    await requireUser();
  } catch (res) {
    return res as Response;
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
