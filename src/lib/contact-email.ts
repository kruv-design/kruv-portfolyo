import type { Locale } from "@/lib/i18n/config";
import { getResendClient } from "@/lib/olly/resend";
import type { ContactPayloadInput } from "@/lib/validators";

const DEFAULT_NOTIFY_EMAIL = "hello@kruv.com";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildNotifyHtml(payload: ContactPayloadInput): string {
  const rows = [
    ["Ad", payload.name.trim()],
    ["E-posta", payload.email.trim()],
    ["Mesaj", payload.message.trim()],
  ];
  if (payload.phone.trim()) rows.push(["Telefon", payload.phone.trim()]);
  if (payload.budget.trim()) rows.push(["Bütçe", payload.budget.trim()]);
  if (payload.timeline.trim()) rows.push(["Zaman", payload.timeline.trim()]);

  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px 8px 0;color:#666;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111">
<p style="margin:0 0 16px">Yeni iletişim formu gönderimi:</p>
<table style="border-collapse:collapse">${body}</table>
</body></html>`;
}

function autoReplyCopy(locale: Locale, firstName: string): { subject: string; html: string } {
  if (locale === "en") {
    return {
      subject: "We received your message — kruv",
      html: `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.6;color:#111">
<p>Hi ${escapeHtml(firstName)},</p>
<p>Your message has been received. We will get back to you shortly.</p>
<p style="color:#666;margin-top:24px">— kruv</p>
</body></html>`,
    };
  }
  return {
    subject: "Mesajınız alındı — kruv",
    html: `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.6;color:#111">
<p>Merhaba ${escapeHtml(firstName)},</p>
<p>Mesajınız iletildi. Size en kısa zamanda ulaşacağız.</p>
<p style="color:#666;margin-top:24px">— kruv</p>
</body></html>`,
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
      subject: `[kruv] İletişim: ${payload.name.trim()}`,
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
    const copy = autoReplyCopy(locale, firstName);
    const { error } = await resend.emails.send({
      from,
      to: visitorEmail,
      subject: copy.subject,
      html: copy.html,
    });
    if (error) {
      console.error("[contact-email] auto-reply", error);
    } else {
      result.autoReplySent = true;
    }
  } catch (e) {
    console.error("[contact-email] auto-reply", e);
  }

  return result;
}
