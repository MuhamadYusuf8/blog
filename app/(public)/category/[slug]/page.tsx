/**
 * app/(public)/category/[slug]/page.tsx — Public Category Page (Server Component)
 * Fetches published posts for a specific category from Supabase.
 */

import { PublicNavbar } from "@/components/public/PublicNavbar";
import { Footer } from "@/components/public/Footer";
import { CategoryClient } from "@/components/public/CategoryClient";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  formatViews,
  formatShortDate,
  estimateReadTimeFromHtml,
  type PublicPostItem,
} from "@/lib/utils/publicHelpers";

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const supabase = createServerSupabaseClient();
  const rawSlug = params.slug;

  // The database categories are usually capitalized (e.g. "Desain", "Jurnal")
  // Let's do a case-insensitive search or just capitalize the first letter.
  const categoryStr = rawSlug.charAt(0).toUpperCase() + rawSlug.slice(1);

  const { data: postsData } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url, category, view_count, published_at, created_at, content_html")
    .eq("status", "published")
    .is("deleted_at", null)
    .ilike("category", categoryStr) // case-insensitive match
    .order("published_at", { ascending: false, nullsFirst: false });

  const posts = (postsData ?? []).map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    cover_image_url: p.cover_image_url,
    category: p.category,
    view_count: p.view_count ?? 0,
    views: formatViews(p.view_count ?? 0),
    date: formatShortDate(p.published_at ?? p.created_at),
    dateRaw: p.published_at ?? p.created_at,
    read_time: estimateReadTimeFromHtml(p.content_html),
    is_new: false,
  })) as PublicPostItem[];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <PublicNavbar />
      <CategoryClient slug={rawSlug} posts={posts} />
      <Footer />
    </div>
  );
}