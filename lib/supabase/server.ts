/**
 * lib/supabase/server.ts
 * Server-side Supabase client for use in:
 *   - async Server Components
 *   - Server Actions
 *   - Route Handlers
 *
 * ⚠️  NEVER import this file in a Client Component ('use client').
 * ⚠️  This client respects RLS. For Draft Mode use lib/supabase/service.ts.
 */

import { createServerClient, type CookieMethodsServer } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

/**
 * Creates a typed Supabase server client bound to the current request's cookies.
 * The return type is explicitly cast to SupabaseClient<Database> to work around
 * a TypeScript inference limitation with manually-defined Database types and the
 * GenericSchema constraint in supabase-js v2.106+.
 */
export function createServerSupabaseClient(): SupabaseClient<Database> {
  const cookieStore = cookies()

  // createServerClient with no generic → returns SupabaseClient<any>
  // We then cast to SupabaseClient<Database> for full type safety at call sites.
  // Runtime behaviour is identical; this is purely a TypeScript annotation.
  const rawClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Parameters<NonNullable<CookieMethodsServer['setAll']>>[0]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Called from a Server Component — cookies can only be set in
            // Server Actions / Route Handlers. Safe to ignore here because
            // middleware (lib/supabase/middleware.ts) handles session refresh.
          }
        },
      },
    },
  )

  return rawClient as unknown as SupabaseClient<Database>
}

export { createServerSupabaseClient as createClient }

