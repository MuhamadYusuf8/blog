/**
 * app/(public)/tag/[slug]/page.tsx — Tag Archive Page
 * SRS §3.1.7, Phase 2D step 22.
 *
 * Uses Supabase array contains operator (.contains) to filter posts
 * where the tags[] column includes the given tag.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PostFeed, POSTS_PER_PAGE } from '@/components/public/PostFeed'
import { GlassPanel } from '@/components/ui/GlassPanel'

export const revalidate = 60

type TagPageProps = {
  params: { slug: string }
  searchParams: { page?: string }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = decodeURIComponent(params.slug).replace(/-/g, ' ')
  return {
    title: `Tag: #${tag}`,
    description: `Postingan dengan tag #${tag}.`,
  }
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const currentPage = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1)
  const from = (currentPage - 1) * POSTS_PER_PAGE
  const to = from + POSTS_PER_PAGE - 1

  // Decode the URL slug back to the tag value stored in the DB
  const tagValue = decodeURIComponent(params.slug).replace(/-/g, ' ')

  const supabase = createServerSupabaseClient()

  // SRS §3.1.7: use .contains() for PostgreSQL array overlap
  const { data: posts, count, error } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .is('deleted_at', null)
    .contains('tags', [tagValue]) // matches posts where tags[] @> ARRAY[tagValue]
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('[TagPage] Error fetching posts:', error.message)
  }

  if (!posts || (posts.length === 0 && currentPage === 1)) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Page header */}
      <GlassPanel className="p-6">
        <p className="text-white/50 text-xs uppercase tracking-widest mb-1 font-medium">Tag</p>
        <h1 className="text-white font-bold text-3xl flex items-center gap-3">
          <span aria-hidden="true" className="text-purple-400">#</span>
          {tagValue}
        </h1>
        {count != null && (
          <p className="text-white/40 text-sm mt-2">{count} postingan ditemukan</p>
        )}
      </GlassPanel>

      <PostFeed
        posts={posts ?? []}
        totalCount={count ?? 0}
        currentPage={currentPage}
        basePath={`/tag/${params.slug}`}
      />
    </div>
  )
}
