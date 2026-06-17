import type { Locale } from "@/lib/i18n/config";
import { BRAND_NAME } from "@/lib/brand";
import { getResendClient } from "@/lib/olly/resend";
import type { ContactPayloadInput } from "@/lib/validators";

const DEFAULT_NOTIFY_EMAIL = "hello@kruv.com";
const WHATSAPP_URL = "https://wa.me/905323673866";
const SITE_URL = "https://www.kruv.com";

const ACCENT = "#6366f1";
const ACCENT_DARK = "#4f46e5";
const INK = "#111111";
const INK_SOFT = "#525252";
const INK_FAINT = "#858585";
const SURFACE = "#ffffff";
const PANEL = "#f7f7f7";
const BORDER = "#eeeeee";
const FONT_STACK =
  "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Çok satırlı metni güvenli HTML <br/> sırasına çevirir. */
function nl2br(s: string): string {
  return escapeHtml(s).replace(/\n/g, "<br/>");
}

/** Tüm mailler için tek dış kabuk — kruv başlığı, gövde, footer. */
function shell(opts: {
  title: string;
  preheader: string;
  contentHtml: string;
  footerHtml: string;
}): string {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:${PANEL};font-family:${FONT_STACK};color:${INK};-webkit-font-smoothing:antialiased;">
  <span style="display:none!important;visibility:hidden;mso-hide:all;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${escapeHtml(opts.preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PANEL};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${SURFACE};border-radius:16px;overflow:hidden;border:1px solid ${BORDER};">
          <tr>
            <td style="padding:32px 32px 16px;">
              <a href="${SITE_URL}" style="text-decoration:none;color:${INK};">
                <span style="display:inline-block;font-family:${FONT_STACK};font-size:24px;font-weight:600;letter-spacing:-0.01em;color:${INK};">${BRAND_NAME}</span>
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;">
              ${opts.contentHtml}
            </td>
          </tr>
          <tr>
            <td style="background:${PANEL};padding:20px 32px;border-top:1px solid ${BORDER};font-size:12px;line-height:1.6;color:${INK_FAINT};">
              ${opts.footerHtml}
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:${INK_FAINT};">© ${new Date().getFullYear()} ${BRAND_NAME} · Rasimpaşa Mah. Macit Erbudak Sok. İstanbul</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildNotifyHtml(payload: ContactPayloadInput): string {
  const rows: [string, string][] = [
    ["Ad", payload.name.trim()],
    ["E-posta", payload.email.trim()],
    ["Mesaj", payload.message.trim()],
  ];

  const tableRows = rows
    .map(([label, value]) => {
      const isMessage = label === "Mesaj";
      return `
      <tr>
        <td style="padding:14px 16px 14px 0;color:${INK_FAINT};vertical-align:top;font-size:13px;letter-spacing:0.02em;text-transform:uppercase;white-space:nowrap;width:96px;">${escapeHtml(label)}</td>
        <td style="padding:14px 0;color:${INK};font-size:15px;line-height:1.5;${isMessage ? "white-space:pre-wrap;" : ""}">${isMessage ? nl2br(value) : escapeHtml(value)}</td>
      </tr>`;
    })
    .join("");

  const replyBtn = `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
    <tr>
      <td bgcolor="${ACCENT}" style="border-radius:999px;">
        <a href="mailto:${escapeHtml(payload.email.trim())}" style="display:inline-block;padding:12px 24px;font-family:${FONT_STACK};font-size:14px;font-weight:500;color:#fff;text-decoration:none;border-radius:999px;">Yanıtla</a>
      </td>
    </tr>
  </table>`;

  const content = `
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${ACCENT};font-weight:500;">Yeni mesaj</p>
    <h1 style="margin:0 0 24px;font-family:${FONT_STACK};font-size:24px;line-height:1.25;color:${INK};font-weight:600;">${escapeHtml(payload.name.trim())} ile iletişim formu</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-top:1px solid ${BORDER};">
      ${tableRows}
    </table>
    ${replyBtn}`;

  const footer = `
    Bu mesaj <strong>kruv.com</strong> iletişim formundan gönderildi.<br/>
    Yanıtla butonu doğrudan <strong>${escapeHtml(payload.email.trim())}</strong> adresine cevap atar.`;

  return shell({
    title: `Yeni iletişim: ${payload.name.trim()}`,
    preheader: `${payload.name.trim()} formu doldurdu — ${payload.message.trim().slice(0, 80)}`,
    contentHtml: content,
    footerHtml: footer,
  });
}

function autoReplyHtml(locale: Locale, firstName: string): { subject: string; html: string } {
  if (locale === "en") {
    const content = `
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${ACCENT};font-weight:500;">Message received</p>
      <h1 style="margin:0 0 16px;font-family:${FONT_STACK};font-size:28px;line-height:1.2;color:${INK};font-weight:600;">Hi ${escapeHtml(firstName)},</h1>
      <p style="margin:0 0 16px;color:${INK_SOFT};font-size:16px;line-height:1.55;">Thanks for reaching out. Your message landed safely in our inbox and one of us will get back to you within <strong>1 working day</strong>.</p>
      <p style="margin:0 0 24px;color:${INK_SOFT};font-size:16px;line-height:1.55;">If it's urgent, the fastest way to reach us is WhatsApp:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td bgcolor="${ACCENT}" style="border-radius:999px;">
            <a href="${WHATSAPP_URL}" style="display:inline-block;padding:12px 28px;font-family:${FONT_STACK};font-size:14px;font-weight:500;color:#fff;text-decoration:none;border-radius:999px;">Open WhatsApp →</a>
          </td>
        </tr>
      </table>
      <p style="margin:32px 0 0;color:${INK_FAINT};font-size:13px;line-height:1.5;">${BRAND_NAME} team</p>`;
    const footer = `
      You're receiving this because you submitted the contact form on <a href="${SITE_URL}" style="color:${ACCENT_DARK};text-decoration:none;">kruv.com</a>.<br/>
      No action is required.`;
    return {
      subject: `We got your message, ${BRAND_NAME}`,
      html: shell({
        title: `Message received, ${BRAND_NAME}`,
        preheader: `Thanks ${firstName} — we'll reply within 1 working day.`,
        contentHtml: content,
        footerHtml: footer,
      }),
    };
  }
  const content = `
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${ACCENT};font-weight:500;">Mesajınız alındı</p>
    <h1 style="margin:0 0 16px;font-family:${FONT_STACK};font-size:28px;line-height:1.2;color:${INK};font-weight:600;">Merhaba ${escapeHtml(firstName)},</h1>
    <p style="margin:0 0 16px;color:${INK_SOFT};font-size:16px;line-height:1.55;">Mesajınızı aldık, ekibimiz size <strong>1 iş günü</strong> içinde dönecek. Bu süre içinde proje notlarınızı hazırlamak iyi olabilir.</p>
    <p style="margin:0 0 24px;color:${INK_SOFT};font-size:16px;line-height:1.55;">Acil bir durum varsa en hızlı yol WhatsApp:</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td bgcolor="${ACCENT}" style="border-radius:999px;">
          <a href="${WHATSAPP_URL}" style="display:inline-block;padding:12px 28px;font-family:${FONT_STACK};font-size:14px;font-weight:500;color:#fff;text-decoration:none;border-radius:999px;">WhatsApp'tan yaz →</a>
        </td>
      </tr>
    </table>
    <p style="margin:32px 0 0;color:${INK_FAINT};font-size:13px;line-height:1.5;">${BRAND_NAME} ekibi</p>`;
  const footer = `
    Bu maili <a href="${SITE_URL}" style="color:${ACCENT_DARK};text-decoration:none;">kruv.com</a> iletişim formunu doldurduğunuz için alıyorsunuz.<br/>
    Bir aksiyon yapmanız gerekmiyor.`;
  return {
    subject: `Mesajınız alındı, ${BRAND_NAME}`,
    html: shell({
      title: `Mesajınız alındı, ${BRAND_NAME}`,
      preheader: `Merhaba ${firstName} — 1 iş günü içinde döneceğiz.`,
      contentHtml: content,
      footerHtml: footer,
    }),
  };
}

export type ContactEmailResult = {
  notifySent: boolean;
  autoReplySent: boolean;
  configured: boolean;
};

/**
 * Resend ile ekip bildirimi (hello@kruv.com) + ziyaretçiye otomatik onay.
 * Supabase yalnızca kayıt tutar; e-posta için RESEND_API_KEY zorunludur.
 */
export async function sendContactEmails(
  payload: ContactPayloadInput,
  locale: Locale = "tr",
): Promise<ContactEmailResult> {
  const resend = getResendClient();
  const notifyTo =
    process.env.CONTACT_NOTIFY_EMAIL?.trim() || DEFAULT_NOTIFY_EMAIL;
  const from = process.env.RESEND_FROM?.trim() ?? "kruv <onboarding@resend.dev>";
  const result: ContactEmailResult = {
    notifySent: false,
    autoReplySent: false,
    configured: Boolean(resend),
  };

  if (!resend) {
    console.warn(
      "[contact-email] RESEND_API_KEY tanımlı değil — e-posta atlanıyor (Supabase kaydı yeterli).",
    );
    return result;
  }

  const visitorEmail = payload.email.trim();

  try {
    const { error } = await resend.emails.send({
      from,
      to: notifyTo,
      replyTo: visitorEmail,
      subject: `${BRAND_NAME} İletişim: ${payload.name.trim()}`,
      html: buildNotifyHtml(payload),
    });
    if (error) {
      console.error("[contact-email] notify", error);
    } else {
      result.notifySent = true;
    }
  } catch (e) {
    console.error("[contact-email] notify", e);
  }

  try {
    const firstName = payload.name.trim().split(/\s+/)[0] || (locale === "en" ? "there" : "Merhaba");
    const copy = autoReplyHtml(locale, firstName);
    const { error } = await resend.emails.send({
      from,
      to: visitorEmail,
      subject: copy.subject,
      html: copy.html,
    });
    if (error) {
      console.error("[contact-email] auto-reply", error);
      const msg = typeof error.message === "string" ? error.message : "";
      if (msg.includes("verify a domain")) {
        console.warn(
          "[contact-email] Ziyaretçi onay maili için resend.com/domains üzerinden kruv.com doğrulayın ve RESEND_FROM=kruv <hello@kruv.com> kullanın.",
        );
      }
    } else {
      result.autoReplySent = true;
    }
  } catch (e) {
    console.error("[contact-email] auto-reply", e);
  }

  return result;
}
