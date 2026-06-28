/**
 * app/admin/posts/[id]/page.tsx — Admin Post Detail / Preview
 * Server Component: fetch data from Supabase, render PostDetailClient.
 */

import { notFound } from "next/navigation";
import { createServiceSupabaseClient } from "@/lib/supabase/service";
import { estimateReadTime } from "@/lib/utils/readTime";
import PostDetailClient, {
  type AdminPostDetail,
} from "@/components/admin/PostDetailClient";

export const metadata = {
  title: "Preview Post — Admin",
};

interface Props {
  params: { id: string };
}

// Format number with K/M suffix
function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// Format date to Indonesian locale
function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Belum diterbitkan";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function AdminPostDetailPage({ params }: Props) {
  const supabase = createServiceSupabaseClient();

  // 1. Fetch post
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .is("deleted_at", null)
    .single();

  if (error || !post) notFound();

  // 2. Count approved comments for this post
  const { count: commentCount } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("post_id", params.id)
    .eq("is_approved", true)
    .is("deleted_at", null);

  // 3. Fetch site settings for author info
  const { data: settings } = await supabase
    .from("site_settings")
    .select("site_title")
    .single();

  // 4. Build the typed data object
  const postDetail: AdminPostDetail = {
    id: post.id,
    title: post.title ?? "Tanpa Judul",
    slug: post.slug ?? "",
    category: post.category ?? null,
    status: post.status ?? "draft",
    author: {
      name: settings?.site_title ?? "Kak Rahma",
      avatar: "",
      handle: "@kakrahma",
    },
    date: formatDate(post.published_at ?? post.created_at),
    readTime: `${estimateReadTime(post.content_html ?? "")} mnt baca`,
    views: formatViews(post.view_count ?? 0),
    coverImage: post.cover_image_url ?? null,
    contentHtml: post.content_html ?? "",
    likes: (post as any).like_count ?? 0,
    comments: commentCount ?? 0,
  };

  return <PostDetailClient post={postDetail} />;
}
