/**
 * app/(public)/posts/[slug]/ViewCounter.tsx
 * Invisible client component that fires the view count RPC — SRS §3.1.3.
 * 'use client' — requires useEffect for mount-time side effect.
 *
 * Renders null (no visible output). On mount, fires-and-forgets
 * the increment_view_count RPC. Does NOT block render.
 *
 * Props:
 *   postId  — the post UUID
 *   isDraft — if true, the RPC is skipped (never inflate draft view counts)
 */

'use client'

import { useEffect } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

type ViewCounterProps = {
  postId: string
  isDraft?: boolean
}

export function ViewCounter({ postId, isDraft = false }: ViewCounterProps) {
  useEffect(() => {
    // RULE: Skip view counting when Draft Mode is active
    if (isDraft) return

    // Fire-and-forget — do not await, do not block page render
    const supabase = createBrowserSupabaseClient()
    supabase
      .rpc('increment_view_count', { post_id: postId })
      .then(({ error }) => {
        if (error) {
          // Log silently — view count failure is non-critical
          console.warn('[ViewCounter] Failed to increment view count:', error.message)
        }
      })
  }, [postId, isDraft])

  // Renders nothing — this component exists purely for its side effect
  return null
}

export default ViewCounter
