import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** One-shot: remove after GG Pizza video2 swap. */
const TOKEN = "ggpizza-v2-20261023-b4e9";
const VIDEO2_URL =
  "https://res.cloudinary.com/di0qbhh46/video/upload/v1792754148/Bal%C4%B1k_editv6_a2zcrh.mp4";

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("token") !== TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("protel_brands")
    .update({
      video_2_url: VIDEO2_URL,
      video_2_title: "Food is Art",
      video_2_aspect: "9:16",
    })
    .eq("slug", "ggpizza")
    .select("slug,video_2_title,video_2_url")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/", "layout");
  revalidatePath("/tr");
  revalidatePath("/en");
  revalidatePath("/protel");

  return NextResponse.json({
    ok: true,
    url: data?.video_2_url,
    hasNew: String(data?.video_2_url || "").includes("a2zcrh"),
  });
}
