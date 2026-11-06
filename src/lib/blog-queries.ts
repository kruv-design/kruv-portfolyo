import "server-only";
import { supabasePublic } from "@/lib/supabase/server";
import { mapBlogRow } from "@/lib/map-blog-row";
import { isPlaceholderEnv } from "@/lib/demo-data";
import { listPublishedHaftalikPosts } from "@/lib/haftalik";
import type { BlogPost } from "@/types";

/** Lobide ilk 8 saniye kapağı. Figma Opera Bosphorus, node 282:62. */
const LOBBY_COVER = "/blog/lobide-ilk-8-saniye-kapak.jpg";
const LOBBY_SLUGS = new Set(["first-8-seconds", "lobide-ilk-8-saniye"]);

function applyCoverOverrides(post: BlogPost): BlogPost {
  if (!LOBBY_SLUGS.has(post.slug)) return post;
  return { ...post, kapak: LOBBY_COVER };
}

function mergePublished(remote: BlogPost[]): BlogPost[] {
  const slugs = new Set(remote.map((post) => post.slug));
  const local = listPublishedHaftalikPosts().filter((post) => !slugs.has(post.slug));
  return [...remote, ...local]
    .map(applyCoverOverrides)
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
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
    return (data ?? []).map(mapBlogRow).map(applyCoverOverrides);
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const local = () => {
    const post = listPublishedHaftalikPosts().find((item) => item.slug === slug);
    return post ? applyCoverOverrides(post) : null;
  };

  if (isPlaceholderEnv()) return local();

  try {
    const sb = supabasePublic();
    const { data, error } = await sb
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? applyCoverOverrides(mapBlogRow(data)) : local();
  } catch {
    return local();
  }
}
