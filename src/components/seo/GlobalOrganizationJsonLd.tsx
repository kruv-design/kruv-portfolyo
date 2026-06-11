import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/get-messages";
import { t } from "@/lib/i18n/t";
import { DEFAULT_SITE_SETTINGS, getSettings } from "@/lib/queries";
import { buildOrganizationSchema } from "@/lib/seo/structured-data";
import { JsonLd } from "./JsonLd";

/** Organization schema — tüm locale sayfalarında. */
export async function GlobalOrganizationJsonLd({ locale }: { locale: Locale }) {
  const [settings, messages] = await Promise.all([
    getSettings().catch(() => DEFAULT_SITE_SETTINGS),
    Promise.resolve(getMessages(locale)),
  ]);

  const description = t(messages, "home.metaDescription");

  return (
    <JsonLd
      data={buildOrganizationSchema({
        locale,
        settings,
        description,
      })}
    />
  );
}
