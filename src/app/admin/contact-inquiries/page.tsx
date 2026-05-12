import { supabaseServer } from "@/lib/supabase/server";
import type { ContactInquiryRow } from "@/types";

export const dynamic = "force-dynamic";

export default async function ContactInquiriesAdminPage() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("contact_inquiries")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(200);

  const rows = (data ?? []) as ContactInquiryRow[];

  return (
    <>
      <h1 className="h2 mb-2" style={{ color: "var(--ink)" }}>
        İletişim talepleri
      </h1>
      <p className="b1 mb-8" style={{ color: "var(--b1-color)" }}>
        Taslak satırları yarım bırakılan formları; &quot;Gönderildi&quot; satırları tamamlanan başvuruları gösterir.
        HubSpot eşlemesi için <code className="b2">HUBSPOT_PORTAL_ID</code> ve{" "}
        <code className="b2">HUBSPOT_FORM_GUID</code> ortam değişkenlerini ayarlayın.
      </p>

      {error ? (
        <p className="b1" style={{ color: "var(--danger)" }}>
          Tablo okunamadı. Supabase SQL editöründe <code className="b2">contact_inquiries</code> tablosunu
          oluşturduğunuzdan emin olun (bkz. <code className="b2">supabase/schema.sql</code>).
        </p>
      ) : rows.length === 0 ? (
        <p className="b1" style={{ color: "var(--b1-color)" }}>
          Henüz kayıt yok.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid var(--adm-border)" }}>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr style={{ background: "var(--adm-surface)", color: "var(--gray-1000)" }}>
                <th className="b3 px-3 py-2 uppercase" style={{ letterSpacing: "var(--ls-2xl)" }}>
                  Durum
                </th>
                <th className="b3 px-3 py-2 uppercase" style={{ letterSpacing: "var(--ls-2xl)" }}>
                  İsim
                </th>
                <th className="b3 px-3 py-2 uppercase" style={{ letterSpacing: "var(--ls-2xl)" }}>
                  E-posta
                </th>
                <th className="b3 px-3 py-2 uppercase" style={{ letterSpacing: "var(--ls-2xl)" }}>
                  HubSpot
                </th>
                <th className="b3 px-3 py-2 uppercase" style={{ letterSpacing: "var(--ls-2xl)" }}>
                  Güncellendi
                </th>
                <th className="b3 px-3 py-2 uppercase" style={{ letterSpacing: "var(--ls-2xl)" }}>
                  Oturum
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t b2"
                  style={{ borderColor: "var(--adm-border)", color: "var(--gray-600)" }}
                >
                  <td className="px-3 py-2 align-top">
                    <span
                      className="inline-block rounded px-2 py-0.5 b3 lowercase"
                      style={{
                        background:
                          row.status === "submitted"
                            ? "color-mix(in srgb, var(--success) 20%, transparent)"
                            : "var(--gray-70)",
                        color: "var(--gray-1000)",
                      }}
                    >
                      {row.status === "submitted" ? "gönderildi" : "taslak"}
                    </span>
                  </td>
                  <td className="px-3 py-2 align-top" style={{ color: "var(--gray-1000)" }}>
                    {typeof row.payload === "object" &&
                    row.payload !== null &&
                    "name" in row.payload &&
                    typeof (row.payload as Record<string, unknown>).name === "string"
                      ? String((row.payload as Record<string, unknown>).name) || "—"
                      : "—"}
                  </td>
                  <td className="px-3 py-2 align-top" style={{ color: "var(--gray-1000)" }}>
                    {row.email ?? "—"}
                  </td>
                  <td className="px-3 py-2 align-top">{row.hubspot_synced ? "evet" : "hayır"}</td>
                  <td className="px-3 py-2 align-top whitespace-nowrap">
                    {new Date(row.updated_at).toLocaleString("tr-TR")}
                  </td>
                  <td className="px-3 py-2 align-top font-mono text-xs" style={{ color: "var(--gray-400)" }}>
                    {row.session_id.slice(0, 8)}…
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!error && rows.length > 0 ? (
        <details className="mt-10">
          <summary className="b2 cursor-pointer" style={{ color: "var(--accent)" }}>
            Ham JSON (ilk kayıt)
          </summary>
          <pre
            className="mt-3 max-h-80 overflow-auto rounded p-4 b2"
            style={{
              background: "var(--adm-surface)",
              border: "1px solid var(--adm-border)",
              color: "var(--gray-600)",
            }}
          >
            {JSON.stringify(rows[0]?.payload ?? {}, null, 2)}
          </pre>
        </details>
      ) : null}
    </>
  );
}
