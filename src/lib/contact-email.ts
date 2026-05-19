import { getResendClient } from "@/lib/olly/resend";
import { contactFocusLabel } from "@/lib/contact-form-config";
import type { ContactPayloadInput } from "@/lib/validators";

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
    ["Marka / şirket", payload.company.trim()],
    ["Öncelik", contactFocusLabel(payload.projectType)],
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

export type ContactEmailResult = {
  notifySent: boolean;
  autoReplySent: boolean;
};

/**
 * Resend ile ekip bildirimi + ziyaretçiye otomatik onay.
 * RESEND_API_KEY ve CONTACT_NOTIFY_EMAIL yoksa sessizce atlanır (Supabase kaydı yeterli).
 */
export async function sendContactEmails(
  payload: ContactPayloadInput,
): Promise<ContactEmailResult> {
  const resend = getResendClient();
  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL?.trim();
  const from = process.env.RESEND_FROM?.trim() ?? "kruv <onboarding@resend.dev>";
  const result: ContactEmailResult = { notifySent: false, autoReplySent: false };

  if (!resend) {
    console.warn("[contact-email] RESEND_API_KEY tanımlı değil — e-posta atlanıyor.");
    return result;
  }

  const visitorEmail = payload.email.trim();

  if (notifyTo) {
    try {
      const { error } = await resend.emails.send({
        from,
        to: notifyTo,
        replyTo: visitorEmail,
        subject: `[kruv] İletişim: ${payload.company.trim() || payload.name.trim()}`,
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
  } else {
    console.warn("[contact-email] CONTACT_NOTIFY_EMAIL tanımlı değil — ekip bildirimi atlanıyor.");
  }

  try {
    const firstName = payload.name.trim().split(/\s+/)[0] || "Merhaba";
    const { error } = await resend.emails.send({
      from,
      to: visitorEmail,
      subject: "Mesajınız alındı — kruv",
      html: `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.6;color:#111">
<p>Merhaba ${escapeHtml(firstName)},</p>
<p>Mesajınız iletildi. Size en kısa zamanda ulaşacağız.</p>
<p style="color:#666;margin-top:24px">— kruv</p>
</body></html>`,
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
