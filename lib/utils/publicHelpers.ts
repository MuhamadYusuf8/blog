/**
 * lib/utils/publicHelpers.ts
 * Shared serialisable helpers for public-facing Server Components.
 */

export function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function formatShortDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function estimateReadTimeFromHtml(html: string | null): number {
  if (!html) return 1;
  const text = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Plain serialisable post shape passed as props to Client Components */
export type PublicPostItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  view_count: number;
  /** formatted views string e.g. "12.4K" */
  views: string;
  /** formatted short date string */
  date: string;
  /** ISO published_at or created_at */
  dateRaw: string;
  read_time: number;
  is_new: boolean;
};
