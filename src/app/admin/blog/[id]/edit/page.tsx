import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { mapBlogRow } from "@/lib/map-blog-row";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  noStore();
  const { id } = await params;
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) notFound();

  const post = mapBlogRow(data as Record<string, unknown>);

  return <BlogPostForm key={post.id} mode="edit" post={post} />;
}
