/**
 * lib/supabase/service.ts
 *
 * WARNING: Bypasses ALL RLS. Use only in server-side Draft Mode paths.
 * Never import in Client Components or public routes.
 *
 * Permitted import locations:
 *   ✅  app/(public)/posts/[slug]/page.tsx — Draft Mode branch only
 *   ✅  app/admin/posts/[id]/edit/page.tsx — needs to read drafts
 *
 * Prohibited:
 *   ❌  Any 'use client' file
 *   ❌  Any public route not behind isDraftMode check
 *
 * Security: SUPABASE_SERVICE_ROLE_KEY must NEVER have NEXT_PUBLIC_ prefix.
 */

import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

/**
 * Creates a Supabase client using the service role key.
 * Bypasses RLS entirely. Draft Mode queries MUST still include
 * `.is('deleted_at', null)` even with this client (SRS RULE 4).
 *
 * Return type is explicitly cast to SupabaseClient<Database> to maintain
 * type safety at call sites despite the GenericSchema constraint in v2.106+.
 */
export function createServiceSupabaseClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
  }
  if (!serviceRoleKey) {
    throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY')
  }

  const rawClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return rawClient as unknown as SupabaseClient<Database>
}
