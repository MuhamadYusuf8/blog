/**
 * app/(public)/archive/page.tsx — Public Archive Page (Server Component)
 * Fetches all published posts from Supabase for the archive timeline.
 */

import { PublicNavbar } from "@/components/public/PublicNavbar";
import { Footer } from "@/components/public/Footer";
import { ArchiveClient } from "@/components/public/ArchiveClient";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  formatViews,
  formatShortDate,
  estimateReadTimeFromHtml,
  type PublicPostItem,
} from "@/lib/utils/publicHelpers";

export const revalidate = 60;

export default async function ArchivePage() {
  const supabase = createServerSupabaseClient();

  const { data: postsData } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url, category, view_count, published_at, created_at, content_html")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false, nullsFirst: false });

  let totalViewsNum = 0;
  const categoriesSet = new Set<string>();

  const posts = (postsData ?? []).map((p: any) => {
    const vc = p.view_count ?? 0;
    totalViewsNum += vc;
    if (p.category) categoriesSet.add(p.category);

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      cover_image_url: p.cover_image_url,
      category: p.category,
      view_count: vc,
      views: formatViews(vc),
      date: formatShortDate(p.published_at ?? p.created_at),
      dateRaw: p.published_at ?? p.created_at,
      read_time: estimateReadTimeFromHtml(p.content_html),
      is_new: false,
    } as PublicPostItem;
  });

  const categories = Array.from(categoriesSet).sort();
  const totalViews = formatViews(totalViewsNum);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white overflow-x-hidden">
      <PublicNavbar />
      <ArchiveClient posts={posts} categories={categories} totalViews={totalViews} />
      <Footer />
    </div>
  );
}