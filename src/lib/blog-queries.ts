import "server-only";
import { supabasePublic } from "@/lib/supabase/server";
import { mapBlogRow } from "@/lib/map-blog-row";
import { isPlaceholderEnv } from "@/lib/demo-data";
import type { BlogPost } from "@/types";

/** Public blog listesi — yalnızca yayında olanlar, yeniden eskiye. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (isPlaceholderEnv()) return [];

  try {
    const sb = supabasePublic();
    const { data, error } = await sb
      .from("blog_posts")
      .select("*")
      .eq("yayinda", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapBlogRow);
  } catch {
    return [];
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
  if (isPlaceholderEnv()) return null;

  try {
    const sb = supabasePublic();
    const { data, error } = await sb
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? mapBlogRow(data) : null;
  } catch {
    return null;
  }
}
