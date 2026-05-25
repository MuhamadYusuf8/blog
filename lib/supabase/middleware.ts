/**
 * lib/supabase/middleware.ts
 * Session refresh helper for Next.js middleware.
 *
 * Called by the root middleware.ts on every matching request.
 * Reads the Supabase session from cookies, refreshes it if needed,
 * and writes the updated session back to the response cookies.
 *
 * This is required by @supabase/ssr — the server client needs cookies to be
 * refreshed at the middleware layer so that Server Components always receive
 * a valid, non-expired session.
 */

import { createServerClient, type CookieMethodsServer } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  // Start with a passthrough response that we'll mutate with updated cookies
  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Parameters<NonNullable<CookieMethodsServer['setAll']>>[0]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not write application logic between createServerClient and
  // getUser(). A bug here can cause random session invalidations.
  // See: https://supabase.com/docs/guides/auth/server-side/nextjs
  await supabase.auth.getUser()

  return supabaseResponse
}
