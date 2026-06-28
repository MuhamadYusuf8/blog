/**
 * app/(public)/page.tsx — Public Homepage (Server Component)
 * Fetches real data from Supabase for Hero Carousel, Trending, and Latest sections.
 */

import { PublicNavbar } from "@/components/public/PublicNavbar";
import { Footer } from "@/components/public/Footer";
import { HomepageClient } from "@/components/public/HomepageClient";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  formatViews,
  formatShortDate,
  estimateReadTimeFromHtml,
  type PublicPostItem,
} from "@/lib/utils/publicHelpers";

export const revalidate = 60; // Refresh data every 60 seconds

export default async function HomePage() {
  const supabase = createServerSupabaseClient();

  // We need 3 separate queries:
  // 1. Featured (Hero Carousel): 3 latest published posts (with or without cover_image_url)
  // 2. Trending: Top 6 published posts by view_count
  // 3. Latest: 12 latest published posts

  // 1. Featured
  const { data: featuredData } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url, category, view_count, published_at, created_at, content_html")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(3);

  // 2. Trending
  const { data: trendingData } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url, category, view_count, published_at, created_at, content_html")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("view_count", { ascending: false })
    .limit(6);

  // 3. Latest
  const { data: latestData } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url, category, view_count, published_at, created_at, content_html")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(12);

  const mapPost = (p: any): PublicPostItem => ({
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
    is_new: false, // will be evaluated client-side based on dateRaw
  });

  const featured = (featuredData ?? []).map(mapPost);
  const trending = (trendingData ?? []).map(mapPost);
  const latest = (latestData ?? []).map(mapPost);

  return (
    <>
      <PublicNavbar />
      <HomepageClient featured={featured} trending={trending} latest={latest} />
      <Footer />
    </>
  );
}