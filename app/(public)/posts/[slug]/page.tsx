/**
 * app/(public)/posts/[slug]/page.tsx — Single Post Page
 * SRS §3.1.3, Phase 2D step 18.
 *
 * RULE 3 COMPLIANCE:
 *   sanitizeHtml() from lib/utils/sanitize.ts is called before EVERY
 *   dangerouslySetInnerHTML. This applies to BOTH the public path AND
 *   the Draft Mode path. Sanitisation is never skipped or conditional.
 *
 * RULE 4 COMPLIANCE:
 *   Draft Mode uses createServiceSupabaseClient() (bypasses RLS) to fetch
 *   draft posts. The service client is imported ONLY in this file and ONLY
 *   used in the isDraft branch. Even in draft mode, deleted_at IS NULL is
 *   still required.
 *
 * Draft Mode flow (SRS §6):
 *   1. Admin clicks "👁 Preview" → GET /api/preview?secret=...&slug=...
 *   2. draftMode().enable() sets an HttpOnly cookie
 *   3. Redirect to this page → draftMode().isEnabled === true
 *   4. Service client fetches draft post (bypassing RLS)
 *   5. DraftModeBanner is shown
 *   6. Content is sanitized and rendered
 *   7. "Exit Preview" → /api/exit-preview → draftMode().disable()
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createServiceSupabaseClient } from '@/lib/supabase/service'
import { sanitizeHtml } from '@/lib/utils/sanitize'
import { estimateReadTime } from '@/lib/utils/readTime'
import { PublicNavbar } from '@/components/public/PublicNavbar'
import { Footer } from '@/components/public/Footer'
import { DraftModeBanner } from '@/components/public/DraftModeBanner'
import { ReadingProgressBar } from '@/components/public/ReadingProgressBar'
import { ShareButtons } from '@/components/public/ShareButtons'
import { CommentList } from '@/components/public/CommentList'
import { CommentForm } from '@/components/public/CommentForm'
import { Badge } from '@/components/ui/Badge'
import { ViewCounter } from './ViewCounter'
import Sidebar from '@/components/public/Sidebar'
import type { Post, Comment } from '@/lib/supabase/types'

export const revalidate = 60

// ---------------------------------------------------------------------------
// generateMetadata — Open Graph + SEO
// ---------------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const supabase = createServerSupabaseClient()
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, cover_image_url, meta_title, meta_description, slug')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .is('deleted_at', null)
    .maybeSingle()

  if (!post) {
    return { title: 'Postingan Tidak Ditemukan' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const description = post.meta_description ?? post.excerpt ?? ''
  const title = post.meta_title ?? post.title

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${siteUrl}/posts/${post.slug}`,
      images: post.cover_image_url
        ? [{ url: post.cover_image_url, alt: post.title }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(dateString: string | null): string {
  if (!dateString) return ''
  try {
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return ''
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d)
  } catch {
    return ''
  }
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const { isEnabled: isDraft } = draftMode()

  let post: Post | null = null
  let comments: Comment[] = []

  // ------------------------------------------------------------------
  // RULE 4: Draft Mode branch uses service client (bypasses RLS).
  //         Public branch uses server client (respects RLS).
  // ------------------------------------------------------------------
  if (isDraft) {
    /**
     * Draft Mode path:
     * - Uses service role client (bypasses RLS) to fetch drafts
     * - No status filter (allows 'draft' posts)
     * - deleted_at IS NULL is still mandatory (RULE 4)
     * - Service client permitted here per RULE 4 and lib/supabase/service.ts JSDoc
     */
    const serviceClient = createServiceSupabaseClient()
    const { data } = await serviceClient
      .from('posts')
      .select('*')
      .eq('slug', params.slug)
      .is('deleted_at', null) // RULE 4: still required even in draft mode
      .maybeSingle()

    post = data ?? null
  } else {
    /**
     * Public path:
     * - Uses anon server client (respects RLS)
     * - Must be published and not soft-deleted
     */
    const supabase = createServerSupabaseClient()
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', params.slug)
      .eq('status', 'published')
      .is('deleted_at', null)
      .maybeSingle()

    post = data ?? null
  }

  // 404 if post not found (or is soft-deleted)
  if (!post) {
    notFound()
  }

  // Fetch approved, non-soft-deleted comments for this post
  if (!isDraft) {
    const supabase = createServerSupabaseClient()
    const { data: commentsData } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', post.id)
      .eq('is_approved', true)
      .is('deleted_at', null)
      .order('created_at', { ascending: true })

    comments = commentsData ?? []
  }

  // ------------------------------------------------------------------
  // RULE 3: sanitizeHtml MUST be called before dangerouslySetInnerHTML.
  //         This applies to BOTH the public path AND the Draft Mode path.
  //         Sanitisation is never conditional or skipped.
  // ------------------------------------------------------------------
  const sanitizedHtml = sanitizeHtml(post.content_html ?? '')

  const readTime = estimateReadTime(post.content_html ?? '')
  const displayDate = formatDate(post.published_at)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const postUrl = `${siteUrl}/posts/${post.slug}`

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <PublicNavbar />
      {/* Reading progress bar (client component, renders null on server) */}
      <ReadingProgressBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24">

        {/* Draft Mode Banner — only shown when isDraft is true */}
        {isDraft && <div className="mb-8"><DraftModeBanner /></div>}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 xl:gap-12 items-start">
          
          {/* ── Main Column ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-8 min-w-0">
            <article className="rounded-3xl border border-white/10 overflow-hidden backdrop-blur-2xl animate-fade-in" style={{ background: 'rgba(255,255,255,0.03)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          {/* Cover Image */}
          {post.cover_image_url && (
            <div className="relative w-full aspect-video overflow-hidden rounded-t-3xl">
              <Image
                src={post.cover_image_url}
                alt={`Cover image for ${post.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
          )}

          <div className="p-6 md:p-10 flex flex-col gap-6">
            {/* Category + Date */}
            <div className="flex items-center gap-3 flex-wrap">
              {post.category && (
                <Link href={`/category/${encodeURIComponent(post.category.toLowerCase().replace(/\s+/g, '-'))}`}>
                  <Badge color="purple">{post.category}</Badge>
                </Link>
              )}
              {isDraft && <Badge color="amber">DRAFT</Badge>}
              {displayDate && (
                <time dateTime={post.published_at ?? ''} className="text-slate-400 text-xs font-medium">
                  {displayDate}
                </time>
              )}
            </div>

            {/* Title */}
            <h1 className="text-white font-display font-bold text-2xl sm:text-3xl md:text-[2.5rem] leading-snug md:leading-tight tracking-tight text-balance">
              {post.title}
            </h1>

            {/* Author + stats row */}
            <div className="flex items-center gap-4 flex-wrap text-slate-400 text-[12.5px] border-b border-white/10 pb-5">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="8" cy="8" r="6.5" />
                  <path d="M8 4v4l2 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {readTime} min read
              </span>
              <span aria-label={`${post.view_count ?? 0} kali dilihat`} className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 8c0-2.8 3.1-5.5 7-5.5s7 2.7 7 5.5-3.1 5.5-7 5.5S1 10.8 1 8z" />
                  <circle cx="8" cy="8" r="2.5" />
                </svg>
                {(post.view_count ?? 0).toLocaleString('id-ID')}
              </span>
              {/* ViewCounter fires the RPC on mount — invisible, renders null */}
              <ViewCounter postId={post.id} isDraft={isDraft} />
            </div>

            {/*
             * RULE 3: sanitizedHtml is the output of sanitizeHtml(post.content_html).
             * DOMPurify was applied above. This is the ONLY correct way to render
             * user-submitted HTML content.
             */}
            <div
              className="prose prose-invert max-w-none journal-article text-slate-300 prose-headings:text-white prose-headings:tracking-tight prose-a:text-violet-400 hover:prose-a:text-violet-300 prose-img:rounded-xl prose-img:border prose-img:border-white/10"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                <span className="text-slate-400 text-[12px] font-medium self-center mr-1">Tags:</span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${encodeURIComponent(tag.toLowerCase().replace(/\s+/g, '-'))}`}
                  >
                    <span
                      className="text-[11.5px] font-medium px-2.5 py-1 rounded-md transition-colors"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#c4b5fd',
                      }}
                    >
                      #{tag}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* Share buttons */}
            {!isDraft && (
              <div 
                className="mt-4 p-5 rounded-2xl flex items-center justify-between gap-4"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest">Bagikan Tulisan</span>
                <ShareButtons url={postUrl} title={post.title} />
              </div>
            )}
          </div>
        </article>

        {/* Related posts placeholder — shown only in public mode */}
        {/* (Related posts query would go here — omitted to avoid over-fetching) */}

            {/* Comment section — only shown in public mode, not draft preview */}
            {!isDraft && (
              <div className="mt-4 flex flex-col gap-6">
                <CommentList comments={comments} />
                <CommentForm postId={post.id} />
              </div>
            )}
          </div>

          {/* ── Sidebar Column ──────────────────────────────────────────── */}
          <aside className="hidden lg:block lg:sticky lg:top-24">
            <Sidebar />
          </aside>
          
        </div>
      </main>
      <Footer />
    </div>
  )
}
