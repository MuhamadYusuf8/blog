/**
 * app/(public)/category/[slug]/page.tsx — Category Archive Page
 * SRS §3.1.6, Phase 2D step 21.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PostFeed, POSTS_PER_PAGE } from '@/components/public/PostFeed'
import { GlassPanel } from '@/components/ui/GlassPanel'

export const revalidate = 60

type CategoryPageProps = {
  params: { slug: string }
  searchParams: { page?: string }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  // Decode slug back to display name (e.g. "teknologi" → "Teknologi")
  const displayName = decodeURIComponent(params.slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  return {
    title: `Kategori: ${displayName}`,
    description: `Postingan dalam kategori ${displayName}.`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const currentPage = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1)
  const from = (currentPage - 1) * POSTS_PER_PAGE
  const to = from + POSTS_PER_PAGE - 1

  // Decode slug to category string — try exact match first, then case-insensitive
  const decodedSlug = decodeURIComponent(params.slug).replace(/-/g, ' ')

  const supabase = createServerSupabaseClient()

  const { data: posts, count, error } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .is('deleted_at', null)
    .ilike('category', decodedSlug) // case-insensitive match
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('[CategoryPage] Error fetching posts:', error.message)
  }

  // If no posts found at all and it's the first page, show 404
  if (!posts || (posts.length === 0 && currentPage === 1)) {
    notFound()
  }

  const displayName = decodedSlug.replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Page header */}
      <GlassPanel className="p-6">
        <p className="text-white/50 text-xs uppercase tracking-widest mb-1 font-medium">Kategori</p>
        <h1 className="text-white font-bold text-3xl flex items-center gap-3">
          <span aria-hidden="true">🗂</span> {displayName}
        </h1>
        {count != null && (
          <p className="text-white/40 text-sm mt-2">{count} postingan ditemukan</p>
        )}
      </GlassPanel>

      <PostFeed
        posts={posts ?? []}
        totalCount={count ?? 0}
        currentPage={currentPage}
        basePath={`/category/${params.slug}`}
      />
    </div>
  )
}
