import type { ContactPayloadInput } from "@/lib/validators";

function splitName(full: string): { firstname: string; lastname: string } {
  const t = full.trim();
  if (!t) return { firstname: "-", lastname: "-" };
  const i = t.indexOf(" ");
  if (i === -1) return { firstname: t.slice(0, 80), lastname: "-" };
  const first = t.slice(0, i).trim() || "-";
  const last = t.slice(i + 1).trim() || "-";
  return {
    firstname: first.slice(0, 80),
    lastname: last.slice(0, 80),
  };
}

function buildMessageBody(p: ContactPayloadInput): string {
  const lines = [
    p.message.trim(),
    p.phone.trim() ? `Telefon: ${p.phone.trim()}` : null,
    p.budget.trim() ? `Bütçe (varsa): ${p.budget.trim()}` : null,
    p.timeline.trim() ? `Zaman (varsa): ${p.timeline.trim()}` : null,
    p.referrer.trim() ? `Kaynak: ${p.referrer.trim()}` : null,
  ].filter(Boolean) as string[];
  return lines.join("\n").trim().slice(0, 65000);
}

/**
 * HubSpot Forms API — formdaki dahili alan adları (firstname, email, …) ile eşleşmeli.
 * @see https://developers.hubspot.com/docs/api-reference/marketing-forms-v3/forms/post-submissions-v3-integration-submit-portalId-formGuid
 */
export async function submitContactToHubSpot(options: {
  portalId: string;
  formGuid: string;
  payload: ContactPayloadInput;
  pageUri: string;
  pageName?: string;
}): Promise<{ ok: boolean; status: number; bodyText: string }> {
  const { firstname, lastname } = splitName(options.payload.name);
  const message = buildMessageBody(options.payload) || "(Kullanıcı mesajı bırakmadı.)";

  const fields: { name: string; value: string }[] = [
    { name: "firstname", value: firstname },
    { name: "lastname", value: lastname },
    { name: "email", value: options.payload.email.trim() },
    { name: "message", value: message },
  ];
  if (options.payload.phone.trim()) {
    fields.push({ name: "phone", value: options.payload.phone.trim() });
  }
  if (options.payload.company.trim()) {
    fields.push({ name: "company", value: options.payload.company.trim() });
  }

  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${options.portalId}/${options.formGuid}`;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        submittedAt: Date.now(),
        fields,
        context: {
          pageUri: options.pageUri,
          pageName: options.pageName ?? "Contact",
        },
      }),
    });
    const bodyText = await res.text();
    return { ok: res.ok, status: res.status, bodyText };
  } catch {
    return { ok: false, status: 0, bodyText: "network_or_timeout" };
  } finally {
    clearTimeout(t);
  }
}
