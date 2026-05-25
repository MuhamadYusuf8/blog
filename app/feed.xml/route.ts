/**
 * app/feed.xml/route.ts — RSS 2.0 Feed
 * SRS §3.1.10, RULE 7, Phase 2E step 27.
 *
 * RULE 7: Live DB query — NOT a static file.
 *   - Queries latest 20 published, non-deleted posts
 *   - ISR: revalidate = 3600 (1 hour)
 *   - Returns Content-Type: application/rss+xml; charset=utf-8
 *
 * Autodiscovery <link> is in app/layout.tsx (RULE 7).
 */

import { createServerSupabaseClient } from '@/lib/supabase/server'

export const revalidate = 3600 // RULE 7: 1-hour ISR

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(): Promise<Response> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kakrahma.com'

  try {
    const supabase = createServerSupabaseClient()

    const { data: posts } = await supabase
      .from('posts')
      .select('title, slug, excerpt, published_at, updated_at, category, cover_image_url')
      .eq('status', 'published')
      .is('deleted_at', null) // RULE 7: soft-deleted posts excluded
      .order('published_at', { ascending: false })
      .limit(20)

    // Fetch site settings for feed metadata
    const { data: settings } = await supabase
      .from('site_settings')
      .select('site_title, bio')
      .eq('id', 1)
      .single()

    const siteTitle = settings?.site_title ?? 'Kak Rahma Blog'
    const siteDescription = settings?.bio ?? 'Blog pribadi Kak Rahma.'
    const buildDate = new Date().toUTCString()

    const items = (posts ?? [])
      .map((post) => {
        const postUrl = `${siteUrl}/posts/${post.slug}`
        const pubDate = post.published_at
          ? new Date(post.published_at).toUTCString()
          : buildDate
        const description = post.excerpt
          ? escapeXml(post.excerpt)
          : `Baca selengkapnya di ${escapeXml(postUrl)}`

        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ''}
      ${post.cover_image_url ? `<enclosure url="${escapeXml(post.cover_image_url)}" type="image/jpeg" length="0" />` : ''}
    </item>`
      })
      .join('')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
>
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>id</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${escapeXml(siteUrl)}/feed.xml" rel="self" type="application/rss+xml" />
    <generator>Kak Rahma Blog (Next.js 14)</generator>${items}
  </channel>
</rss>`

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('[feed.xml] Failed to generate RSS feed:', error)
    return new Response('Failed to generate RSS feed.', { status: 500 })
  }
}
