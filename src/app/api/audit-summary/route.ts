import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Salt okunur, token korumalı özet endpoint'i.
 *
 * Amaç: Cowork'teki haftalık site-audit görevi bulut sandbox'ından Supabase'e
 * doğrudan bağlanamıyor (özel header/apikey ile REST çağrısı yapamıyor,
 * yalnızca genel web_fetch ile GET isteği atabiliyor). Bu route, agregasyonu
 * sunucu tarafında (service-role ile) yapıp yalnızca ÖZET, KİŞİSEL VERİ
 * İÇERMEYEN sayıları döner — ham event/props/session_id/ip_hash/ua asla
 * dışarı verilmez (özellikle contact_form_submit event'lerinin props'unda
 * isim/e-posta olabileceği için).
 *
 * Koruma: ?token=... query param'ı AUDIT_SUMMARY_TOKEN env değişkenine eşit
 * olmalı. (Bu tool zinciri custom header gönderemediği için token URL'de.)
 */

type EventRow = {
  session_id: string | null;
  event_name: string | null;
  page: string | null;
  props: Record<string, unknown> | null;
  created_at: string | null;
};

type PresenceRow = {
  page: string | null;
  last_seen_at: string | null;
};

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  const expectedToken = process.env.AUDIT_SUMMARY_TOKEN;
  if (!expectedToken) {
    return NextResponse.json(
      { error: "AUDIT_SUMMARY_TOKEN sunucuda tanımlı değil" },
      { status: 500 },
    );
  }

  const token = req.nextUrl.searchParams.get("token");
  if (!token || token !== expectedToken) {
    return unauthorized();
  }

  const daysParam = Number(req.nextUrl.searchParams.get("days") ?? "30");
  const days = Number.isFinite(daysParam) && daysParam > 0 ? Math.min(daysParam, 90) : 30;
  const presenceWindowSeconds = Math.min(
    Math.max(Number(req.nextUrl.searchParams.get("active_within_seconds") ?? "15") || 15, 5),
    300,
  );

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const presenceSince = new Date(Date.now() - presenceWindowSeconds * 1000).toISOString();

  const sb = supabaseAdmin();

  const [eventsRes, presenceRes] = await Promise.all([
    sb
      .from("site_events")
      .select("session_id,event_name,page,props,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000),
    sb
      .from("site_presence")
      .select("page,last_seen_at")
      .gte("last_seen_at", presenceSince)
      .order("last_seen_at", { ascending: false })
      .limit(500),
  ]);

  const eventsError = eventsRes.error;
  const presenceError = presenceRes.error;

  if (eventsError && (eventsError.code === "42P01" || /site_events/.test(eventsError.message))) {
    return NextResponse.json(
      { error: "site_events tablosu yok — Supabase SQL migration çalıştırın" },
      { status: 500 },
    );
  }
  if (eventsError) {
    return NextResponse.json({ error: `Supabase hatası: ${eventsError.message}` }, { status: 500 });
  }

  const events = (eventsRes.data ?? []) as EventRow[];
  const presenceRows = (presenceRes.data ?? []) as PresenceRow[];

  const sessions = new Set<string>();
  let pageViews = 0;
  let projectClicks = 0;
  let formSubmits = 0;
  const byDay = new Map<string, number>();
  const byEvent = new Map<string, number>();
  const pages = new Map<string, number>();
  const slugs = new Map<string, number>();

  for (const row of events) {
    if (row.session_id) sessions.add(row.session_id);
    const name = row.event_name ?? "";
    byEvent.set(name, (byEvent.get(name) ?? 0) + 1);
    if (name === "page_view") pageViews += 1;
    else if (name === "project_click") projectClicks += 1;
    else if (name === "contact_form_submit") formSubmits += 1;

    const created = row.created_at ?? "";
    if (created.length >= 10) {
      const day = created.slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + 1);
    }

    if (row.page) pages.set(row.page, (pages.get(row.page) ?? 0) + 1);

    if (name === "project_click" && row.props && typeof row.props === "object") {
      const slug = (row.props as Record<string, unknown>).slug;
      if (typeof slug === "string" && slug) {
        slugs.set(slug, (slugs.get(slug) ?? 0) + 1);
      }
    }
  }

  const dayLabels = Array.from(byDay.keys()).sort();
  const sortedEntries = (m: Map<string, number>, limit?: number) =>
    Array.from(m.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit ?? m.size)
      .map(([key, count]) => ({ key, count }));

  const presenceByPage = new Map<string, number>();
  for (const row of presenceRows) {
    if (row.page) presenceByPage.set(row.page, (presenceByPage.get(row.page) ?? 0) + 1);
  }

  return NextResponse.json({
    generated_at: new Date().toISOString(),
    range_days: days,
    error: null,
    presence_error: presenceError ? presenceError.message : null,
    summary: {
      total_events: events.length,
      page_views: pageViews,
      unique_sessions: sessions.size,
      project_clicks: projectClicks,
      form_submits: formSubmits,
      by_day: dayLabels.map((d) => ({ date: d, count: byDay.get(d) ?? 0 })),
      by_event: sortedEntries(byEvent).map((e) => ({ name: e.key, count: e.count })),
      top_pages: sortedEntries(pages, 10).map((e) => ({ page: e.key, count: e.count })),
      top_projects: sortedEntries(slugs, 10).map((e) => ({ slug: e.key, count: e.count })),
    },
    presence: {
      active_count: presenceRows.length,
      window_seconds: presenceWindowSeconds,
      by_page: sortedEntries(presenceByPage).map((e) => ({ page: e.key, count: e.count })),
    },
  });
}
