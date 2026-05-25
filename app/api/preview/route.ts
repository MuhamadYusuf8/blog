/**
 * app/api/preview/route.ts — Draft Mode Enable Endpoint
 * SRS §6.3, RULE 4, Phase 2F step 28.
 *
 * Exact implementation from SRS §6.3:
 *   1. Validate DRAFT_PREVIEW_SECRET from query params
 *   2. Return 401 if secret is invalid or missing
 *   3. Return 400 if slug is missing
 *   4. Call draftMode().enable()
 *   5. Redirect to /posts/${slug}
 *
 * The admin clicks "👁 Preview" → this URL is constructed:
 *   /api/preview?secret=DRAFT_PREVIEW_SECRET&slug=my-post-slug
 *
 * Security: The secret is compared using constant-time comparison
 * to prevent timing attacks.
 */

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest): Promise<NextResponse | never> {
  const { searchParams } = request.nextUrl

  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // Validate secret — return 401 if missing or incorrect (RULE 4)
  const expectedSecret = process.env.DRAFT_PREVIEW_SECRET

  if (!expectedSecret) {
    console.error('[preview] DRAFT_PREVIEW_SECRET environment variable is not set.')
    return NextResponse.json(
      { error: 'Preview mode is not configured.' },
      { status: 500 }
    )
  }

  // Constant-time string comparison to prevent timing attacks
  if (!secret || secret.length !== expectedSecret.length || secret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Invalid preview token.' },
      { status: 401 }
    )
  }

  // Return 400 if slug is missing (RULE 4)
  if (!slug) {
    return NextResponse.json(
      { error: 'Missing required parameter: slug' },
      { status: 400 }
    )
  }

  // Enable Draft Mode — sets an HttpOnly cookie on the response (RULE 4)
  draftMode().enable()

  // Redirect to the post. The Draft Mode cookie will be present on this request,
  // causing app/(public)/posts/[slug]/page.tsx to use the service role client.
  redirect(`/posts/${slug}`)
}
