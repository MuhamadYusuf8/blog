/**
 * middleware.ts (root)
 * Consolidated Next.js middleware — SRS §7.3
 *
 * Layer 1 — IP-based rate limiter for /admin/login:
 *   Max 10 requests per IP per 15-minute window.
 *   Returns HTTP 429 with Retry-After: 900 on breach.
 *   Uses an in-memory Map (sufficient for single-instance / Vercel Edge).
 *   Note: for multi-region deployments, replace with Vercel KV or Upstash Redis.
 *
 * Layer 2 — Supabase session refresh:
 *   Delegates to updateSession() from lib/supabase/middleware.ts.
 *   Ensures every Server Component downstream gets a valid session cookie.
 */

import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// ---------------------------------------------------------------------------
// Rate limiter state
// Key: IP address string
// Value: { count: number; windowStart: number (epoch ms) }
// ---------------------------------------------------------------------------
interface RateLimitEntry {
  count: number
  windowStart: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

const RATE_LIMIT_MAX = 10          // max attempts
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000  // 15 minutes in ms
const RATE_LIMIT_RETRY_AFTER = 900 // seconds (matches window)

/**
 * Checks whether the given IP has exceeded the rate limit for /admin/login.
 * Returns true if the request should be blocked.
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(ip)

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    // No entry or window has expired — start a fresh window
    rateLimitStore.set(ip, { count: 1, windowStart: now })
    return false
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    // Within the window and limit exceeded
    return true
  }

  // Within the window, increment count
  entry.count += 1
  return false
}

/**
 * Extracts the real client IP from the request headers.
 * Vercel sets x-forwarded-for with the original client IP.
 * Falls back to '127.0.0.1' in local development.
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for may be a comma-separated list; first entry is the client
    return forwarded.split(',')[0].trim()
  }
  return '127.0.0.1'
}

// ---------------------------------------------------------------------------
// Main middleware function
// ---------------------------------------------------------------------------
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // ------------------------------------------------------------------
  // Layer 1: Rate limiting — only applies to POST /admin/login
  // GET requests are excluded (they serve the login page HTML).
  // ------------------------------------------------------------------
  if (pathname === '/admin/login' && request.method === 'POST') {
    const ip = getClientIp(request)

    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many login attempts. Please try again in 15 minutes.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(RATE_LIMIT_RETRY_AFTER),
          },
        }
      )
    }
  }

  // ------------------------------------------------------------------
  // Layer 2: Supabase session refresh (runs on all matched routes)
  // ------------------------------------------------------------------
  return await updateSession(request)
}

// ---------------------------------------------------------------------------
// Matcher configuration — SRS §7.3
// Runs middleware on:
//   1. All /admin/* routes (auth protection + login rate limiting)
//   2. All /posts/* routes (Draft Mode cookie needs refresh)
//   3. All /api/* routes (session needed for preview/exit-preview endpoints)
//   4. The root / path (session needed for Navbar auth state)
//
// Excludes static assets, _next internals, and image optimisation routes
// to avoid performance overhead on every static file request.
// ---------------------------------------------------------------------------
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     *   - _next/static (static files)
     *   - _next/image (Next.js image optimisation)
     *   - favicon.ico, robots.txt, sitemap.xml (public static assets)
     *   - Any file with an extension (e.g. .png, .js, .css)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)',
  ],
}
