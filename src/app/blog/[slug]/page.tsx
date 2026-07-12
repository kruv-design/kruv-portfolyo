import { redirect } from "next/navigation";
import { withLocale } from "@/lib/i18n/path";

type Params = { slug: string };

/** Legacy `/blog/[slug]` → locale'li canonical URL (`/tr/blog/...`). */
export default async function LegacyBlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  redirect(withLocale(`/blog/${slug}`, "tr"));
}
