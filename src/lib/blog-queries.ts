import "server-only";
import { supabasePublic } from "@/lib/supabase/server";
import { mapBlogRow } from "@/lib/map-blog-row";
import { isPlaceholderEnv } from "@/lib/demo-data";
import { listPublishedHaftalikPosts } from "@/lib/haftalik";
import type { BlogPost } from "@/types";

function mergePublished(remote: BlogPost[]): BlogPost[] {
  const slugs = new Set(remote.map((post) => post.slug));
  const local = listPublishedHaftalikPosts().filter((post) => !slugs.has(post.slug));
  return [...remote, ...local].sort(
    (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
  );
}

/** Public blog listesi — yalnızca yayında olanlar, yeniden eskiye. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (isPlaceholderEnv()) return mergePublished([]);

  try {
    const sb = supabasePublic();
    const { data, error } = await sb
      .from("blog_posts")
      .select("*")
      .eq("yayinda", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return mergePublished((data ?? []).map(mapBlogRow));
  } catch {
    return mergePublished([]);
  }
}

/** Admin listesi — gizli yazılar dahil. */
export async function getBlogPostsAdmin(): Promise<BlogPost[]> {
  if (isPlaceholderEnv()) return [];

  try {
    const sb = supabasePublic();
    const { data, error } = await sb
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapBlogRow);
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const local = () =>
    listPublishedHaftalikPosts().find((post) => post.slug === slug) ?? null;

  if (isPlaceholderEnv()) return local();

  try {
    const sb = supabasePublic();
    const { data, error } = await sb
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? mapBlogRow(data) : local();
  } catch {
    return local();
  }
}
