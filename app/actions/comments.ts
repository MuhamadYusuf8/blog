/**
 * app/actions/comments.ts — Comment Server Action
 * SRS §3.3, Phase 2G.
 *
 * submitComment(formData):
 *   1. Extract fields: post_id, commenter_name, body, honeypot
 *   2. Honeypot: if filled → silently succeed but flag honeypot_triggered=true
 *   3. In-memory rate limit: 1 comment per IP per 60 seconds
 *   4. Validate field lengths (commenter_name: 2–80, body: 5–2000)
 *   5. Capture IP from x-forwarded-for header
 *   6. Insert comment with is_approved: false (awaits moderation)
 *   7. Return { success: boolean; error?: string }
 */

'use server'

import { headers } from 'next/headers'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------------------
// In-memory rate limiter — 1 comment per IP per 60 seconds
// Note: resets on server restart. For persistent rate limiting across
// deployments, replace with Vercel KV or Upstash Redis.
// ---------------------------------------------------------------------------
interface RateLimitEntry {
  lastCommentAt: number
}

const commentRateLimit = new Map<string, RateLimitEntry>()
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 60 seconds

function isCommentRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = commentRateLimit.get(ip)

  if (entry && now - entry.lastCommentAt < RATE_LIMIT_WINDOW_MS) {
    return true
  }

  commentRateLimit.set(ip, { lastCommentAt: now })
  return false
}

function getClientIp(headersList: ReturnType<typeof headers>): string {
  const forwarded = headersList.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = headersList.get('x-real-ip')
  if (realIp) return realIp.trim()
  return 'unknown'
}

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------
type ActionResult = { success: true } | { success: false; error: string }

// ---------------------------------------------------------------------------
// Server Action
// ---------------------------------------------------------------------------
export async function submitComment(formData: FormData): Promise<ActionResult> {
  const headersList = headers()
  const ip = getClientIp(headersList)

  // Extract form fields
  const postId = formData.get('post_id')?.toString().trim() ?? ''
  const commenterName = formData.get('commenter_name')?.toString().trim() ?? ''
  const body = formData.get('body')?.toString().trim() ?? ''
  const honeypot = formData.get('honeypot')?.toString() ?? ''

  // ------------------------------------------------------------------
  // Honeypot check (SRS §3.3)
  // If the hidden field is filled, it's a bot.
  // Silently return success so the bot doesn't know it was caught,
  // but mark honeypot_triggered = true in the DB for admin review.
  // ------------------------------------------------------------------
  if (honeypot.length > 0) {
    // Insert silently with honeypot flag — do not reveal detection to bot
    try {
      const supabase = createServerSupabaseClient()
      await supabase.from('comments').insert({
        post_id: postId,
        commenter_name: commenterName || 'Bot',
        body: body || '[honeypot triggered]',
        is_approved: false,
        honeypot_triggered: true,
        ip_address: ip,
      })
    } catch {
      // Silently ignore insert errors for honeypot-triggered comments
    }
    // Return success to the bot so it believes the comment was accepted
    return { success: true }
  }

  // ------------------------------------------------------------------
  // Input validation
  // ------------------------------------------------------------------
  if (!postId) {
    return { success: false, error: 'Permintaan tidak valid.' }
  }

  if (commenterName.length < 2 || commenterName.length > 80) {
    return {
      success: false,
      error: 'Nama harus antara 2 hingga 80 karakter.',
    }
  }

  if (body.length < 5 || body.length > 2000) {
    return {
      success: false,
      error: 'Komentar harus antara 5 hingga 2000 karakter.',
    }
  }

  // ------------------------------------------------------------------
  // Rate limiting — 1 comment per IP per 60 seconds
  // ------------------------------------------------------------------
  if (isCommentRateLimited(ip)) {
    return {
      success: false,
      error: 'Anda terlalu sering mengirim komentar. Tunggu sebentar lalu coba lagi.',
    }
  }

  // ------------------------------------------------------------------
  // Insert comment (pending moderation — is_approved: false)
  // ------------------------------------------------------------------
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      commenter_name: commenterName,
      body,
      is_approved: false,
      honeypot_triggered: false,
      ip_address: ip,
    })

    if (error) {
      console.error('[submitComment] Supabase insert error:', error.message)
      return {
        success: false,
        error: 'Gagal menyimpan komentar. Silakan coba lagi.',
      }
    }

    return { success: true }
  } catch (err) {
    console.error('[submitComment] Unexpected error:', err)
    return {
      success: false,
      error: 'Terjadi kesalahan. Silakan coba lagi.',
    }
  }
}
