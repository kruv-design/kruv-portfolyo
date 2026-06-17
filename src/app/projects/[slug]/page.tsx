import { redirect } from "next/navigation";
import { withLocale } from "@/lib/i18n/path";

type Params = { slug: string };

/** Legacy `/projects/[slug]` → locale'li canonical URL (`/tr/projects/...`). */
export default async function LegacyProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  redirect(withLocale(`/projects/${slug}`, "tr"));
}
