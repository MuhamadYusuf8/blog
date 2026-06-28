/**
 * app/admin/page.tsx — Admin Dashboard (Server Component)
 * Mengambil data real-time dari Supabase:
 *  - Jumlah post published, draft
 *  - Total view_count
 *  - Jumlah komentar pending (is_approved IS NULL)
 *  - 5 post terbaru
 */

import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  DashboardClient,
  type DashboardStat,
  type RecentPostItem,
} from "@/components/admin/DashboardStats";

// ── Category color map (server-side only) ────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  "Ilustrasi":         "#7c3aed",
  "Webtoon":           "#7c3aed",
  "Fotografi":         "#0ea5e9",
  "Behind the Scenes": "#10b981",
  "Tutorial":          "#f59e0b",
  "Opini":             "#ec4899",
};

function getCategoryColor(cat: string | null): string {
  if (!cat) return "#64748b";
  return CATEGORY_COLORS[cat] ?? "#64748b";
}

export const metadata: Metadata = { title: "Dashboard — Kak Rahma" };

// Revalidate every 60 seconds so data stays fresh without full SSR on every hit
export const revalidate = 60;

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function getTodayDate(): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function formatShortDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

export default async function AdminDashboardPage() {
  const supabase = createServerSupabaseClient();

  // ── 1. Counts ────────────────────────────────────────────────────────────
  const [
    { count: publishedCount },
    { count: draftCount },
    { count: pendingCount },
  ] = await Promise.all([
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "published")
      .is("deleted_at", null),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft")
      .is("deleted_at", null),
    supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .is("is_approved", null)
      .is("deleted_at", null),
  ]);

  // ── 2. Total views ───────────────────────────────────────────────────────
  const { data: viewData } = await supabase
    .from("posts")
    .select("view_count")
    .is("deleted_at", null);

  const totalViews = (viewData ?? []).reduce(
    (acc, p) => acc + (p.view_count ?? 0),
    0,
  );

  // ── 3. Recent 5 posts ────────────────────────────────────────────────────
  const { data: rawPosts } = await supabase
    .from("posts")
    .select("id, title, slug, status, category, view_count, published_at, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(5);

  // ── 4. Build stat cards ──────────────────────────────────────────────────
  const stats: DashboardStat[] = [
    {
      id: "published",
      label: "Dipublikasikan",
      value: String(publishedCount ?? 0),
      delta: `${publishedCount ?? 0} post`,
      positive: true,
      accent: "#7c3aed",
      accentRgb: "124,58,237",
      iconId: "BookOpen",
      chart: null,
    },
    {
      id: "drafts",
      label: "Draft Tersimpan",
      value: String(draftCount ?? 0),
      delta: `${draftCount ?? 0} draft`,
      positive: true,
      accent: "#0ea5e9",
      accentRgb: "14,165,233",
      iconId: "FileText",
      chart: null,
    },
    {
      id: "views",
      label: "Total Tayangan",
      value: formatViews(totalViews),
      delta: `${formatViews(totalViews)} views`,
      positive: true,
      accent: "#10b981",
      accentRgb: "16,185,129",
      iconId: "Eye",
      chart: null,
    },
    {
      id: "comments",
      label: "Komentar Pending",
      value: String(pendingCount ?? 0),
      delta: `${pendingCount ?? 0} baru`,
      positive: (pendingCount ?? 0) === 0,
      accent: "#f59e0b",
      accentRgb: "245,158,11",
      iconId: "MessageSquare",
      chart: null,
    },
  ];

  // ── 5. Build recent posts ─────────────────────────────────────────────────
  const recentPosts: RecentPostItem[] = (rawPosts ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    categoryColor: getCategoryColor(p.category),
    views: formatViews(p.view_count ?? 0),
    status: p.status,
    date: formatShortDate(p.published_at ?? p.created_at),
  }));

  return (
    <DashboardClient
      stats={stats}
      recentPosts={recentPosts}
      pendingCount={pendingCount ?? 0}
      todayDate={getTodayDate()}
    />
  );
}