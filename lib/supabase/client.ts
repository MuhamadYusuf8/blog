/**
 * lib/supabase/client.ts
 * Browser-side Supabase client for use in Client Components ('use client').
 *
 * ⚠️  Do NOT import server.ts or service.ts here — server-only APIs will throw.
 */

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'

/**
 * Creates a typed Supabase browser client.
 * Return type is explicitly cast to SupabaseClient<Database> to work around
 * the GenericSchema constraint in supabase-js v2.106+ with manually-defined types.
 */
export function createBrowserSupabaseClient(): SupabaseClient<Database> {
  const rawClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  return rawClient as unknown as SupabaseClient<Database>
}

export { createBrowserSupabaseClient as createClient }
