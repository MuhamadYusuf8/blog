/**
 * app/sitemap.ts — XML Sitemap
 * SRS §3.1.9, RULE 7, Phase 2E step 26.
 *
 * RULE 7: This is a live DB query — NOT a static file.
 *   - Filters: status = 'published' AND deleted_at IS NULL
 *   - ISR: revalidate every 3600 seconds (1 hour)
 *   - Uses NEXT_PUBLIC_SITE_URL for absolute URLs
 */

import type { MetadataRoute } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const revalidate = 3600 // RULE 7: 1-hour ISR

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kakrahma.com'

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]

  // Dynamic post routes — live DB query (RULE 7)
  try {
    const supabase = createServerSupabaseClient()
    const { data: posts } = await supabase
      .from('posts')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .is('deleted_at', null)  // RULE 7: soft-deleted posts excluded
      .order('published_at', { ascending: false })

    const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
      url: `${siteUrl}/posts/${post.slug}`,
      lastModified: new Date(post.updated_at ?? post.published_at ?? new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    return [...staticRoutes, ...postRoutes]
  } catch (error) {
    console.error('[sitemap] Failed to fetch posts:', error)
    // Return static routes only if DB is unavailable
    return staticRoutes
  }
}
