import Link from "next/link";
import { getBlogPostsAdmin } from "@/lib/blog-queries";
import { BlogPostList } from "@/components/admin/BlogPostList";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getBlogPostsAdmin();

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="h2" style={{ color: "var(--ink)" }}>
          Blog
        </h1>
        <Link href="/admin/blog/new" className="btn btn-primary">
          ＋ Yeni Yazı
        </Link>
      </div>
      <BlogPostList initial={posts} />
    </>
  );
}
