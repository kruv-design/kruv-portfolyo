import { BRAND_NAME } from "@/lib/brand";
import { getResendClient } from "@/lib/olly/resend";
import { inboundLabel } from "@/lib/drops-traffic";

const DEFAULT_NOTIFY_EMAIL = "hello@kruv.com";
const SITE_URL = "https://www.kruv.com";
const ADMIN_DOWNLOADS = `${SITE_URL}/admin/drops/downloads`;

/** E-posta HTML — istemciler CSS değişkenini desteklemez; iletişim maili ile aynı palet. */
const INK = "#111111";
const INK_SOFT = "#525252";
const INK_FAINT = "#858585";
const SURFACE = "#ffffff";
const PANEL = "#f7f7f7";
const BORDER = "#eeeeee";
const ACCENT = "#6366f1";
const FONT_STACK =
  "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export type DropDownloadNotifyInput = {
  name: string;
  email: string;
  packTitle: string;
  fontName: string;
  downloadType: "font" | "pack";
  source: string;
  page: string;
  referrer: string;
  country: string;
  locale: string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sourceLabel(source: string): string {
  if (source === "listing") return "liste";
  if (source === "detail") return "detay sayfası";
  return source || "—";
}

function row(label: string, value: string): string {
  return `
      <tr>
        <td style="padding:10px 16px 10px 0;color:${INK_FAINT};vertical-align:top;font-size:13px;white-space:nowrap;">${escapeHtml(label)}</td>
        <td style="padding:10px 0;color:${INK};font-size:15px;line-height:1.45;">${escapeHtml(value || "—")}</td>
      </tr>`;
}

export async function sendDropDownloadNotify(
  input: DropDownloadNotifyInput,
): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("[drops-email] RESEND_API_KEY yok — bildirim atlanıyor.");
    return false;
  }

  const to = process.env.CONTACT_NOTIFY_EMAIL?.trim() || DEFAULT_NOTIFY_EMAIL;
  const from = process.env.RESEND_FROM?.trim() ?? "kruv <onboarding@resend.dev>";
  const item =
    input.downloadType === "pack"
      ? `${input.packTitle || "paket"} (paket)`
      : input.fontName || input.packTitle || "font";
  const inbound = inboundLabel(input.page, input.referrer);
  const subject = `${BRAND_NAME} Drops: ${item} indirildi — ${input.name.trim()}`;

  const html = `<!DOCTYPE html>
<html lang="tr">
<body style="margin:0;padding:24px;font-family:${FONT_STACK};background:${PANEL};color:${INK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:${SURFACE};border:1px solid ${BORDER};border-radius:16px;">
    <tr>
      <td style="padding:28px 32px;">
        <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${ACCENT};">Yeni indirme</p>
        <h1 style="margin:0 0 20px;font-size:22px;line-height:1.25;color:${INK};">${escapeHtml(input.name.trim())} · ${escapeHtml(item)}</h1>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row("İsim", input.name.trim())}
          ${row("E-posta", input.email.trim())}
          ${row("Ne", item)}
          ${row("Nereden indirdi", sourceLabel(input.source))}
          ${row("Nereden geldi", inbound)}
          ${row("Ülke", input.country)}
          ${row("Dil", input.locale)}
        </table>
        <p style="margin:24px 0 0;font-size:14px;">
          <a href="${ADMIN_DOWNLOADS}" style="color:${ACCENT};">${escapeHtml(BRAND_NAME)} admin — tüm indirmeler →</a>
        </p>
        <p style="margin:12px 0 0;font-size:12px;color:${INK_SOFT};">Yanıtla dersen doğrudan bu kişiye gider.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: input.email.trim(),
      subject,
      html,
    });
    if (error) {
      console.error("[drops-email] notify", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[drops-email] notify", e);
    return false;
  }
}
