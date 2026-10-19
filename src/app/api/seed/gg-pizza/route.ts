import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { revalidateProjectPaths } from "@/lib/revalidate-i18n";

export const dynamic = "force-dynamic";

const BASE = "https://kruv.com/projects/gg-pizza";

const PAYLOAD = {
  slug: "gg-pizza",
  baslik: "GG Pizza",
  title: "GG Pizza",
  kategori: "Marka kimliği, menü tasarımı, sosyal medya, performans",
  category: "Brand identity, menu design, social media, performance",
  aciklama:
    "GG Pizza için marka kimliği, menü ve stand tasarımı, etkinlik branding’i, sosyal medya yönetimi, çekim ve performans pazarlamasını tek bir görsel sistemde birleştirdik. Masadan feed’e, feed’den rezervasyona uzanan bir hikâye.",
  description:
    "For GG Pizza we built brand identity, menu and stand design, event branding, social media management, photography, and performance marketing as one visual system — from the table to the feed, and from the feed to bookings.",
  kapak: `${BASE}/kapak.png`,
  galeri_1: `${BASE}/g01.png`,
  galeri_2: `${BASE}/g02.png`,
  galeri_3: `${BASE}/g03.png`,
  galeri_4: `${BASE}/g04.png`,
  galeri_5: `${BASE}/g05.png`,
  galeri_6: `${BASE}/g06.png`,
  galeri_7: `${BASE}/g07.png`,
  galeri_8: `${BASE}/g08.png`,
  galeri_9: `${BASE}/g09.png`,
  galeri_10: `${BASE}/g10.png`,
  galeri_11: `${BASE}/g11.png`,
  galeri_12: `${BASE}/g12.png`,
  galeri_13: `${BASE}/g13.png`,
  galeri_14: `${BASE}/g14.png`,
  galeri_15: "",
  galeri_1_video: "",
  galeri_5_video: "",
  bolumler: [],
  etiketler: ["brand-identity", "packaging"],
  featured: true,
  yayinda: true,
  next_project_override: "",
  renk: "#E10600",
  sira: 0,
};

/** Tek seferlik seed — AUDIT_SUMMARY_TOKEN ile korunur; iş bitince silinecek. */
export async function POST(req: NextRequest) {
  const expected = String(process.env.AUDIT_SUMMARY_TOKEN ?? "").trim();
  const token =
    req.nextUrl.searchParams.get("token")?.trim() ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ||
    "";

  if (!expected || token !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const sb = supabaseAdmin();

  const { data: existing, error: listErr } = await sb
    .from("projects")
    .select("id, slug, sira")
    .order("sira", { ascending: true });

  if (listErr) {
    return NextResponse.json({ error: listErr.message }, { status: 500 });
  }

  const hasGg = (existing ?? []).some((p) => p.slug === "gg-pizza");
  if (!hasGg) {
    for (const p of existing ?? []) {
      const { error } = await sb
        .from("projects")
        .update({ sira: (Number(p.sira) || 0) + 10 })
        .eq("id", p.id);
      if (error) {
        return NextResponse.json(
          { error: `sira bump failed: ${error.message}` },
          { status: 500 },
        );
      }
    }
  }

  const { data, error } = await sb
    .from("projects")
    .upsert(PAYLOAD, { onConflict: "slug" })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateProjectPaths("gg-pizza");
  return NextResponse.json({ data: { slug: data.slug, sira: data.sira, id: data.id } });
}
