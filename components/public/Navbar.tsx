// components/public/Navbar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Server component — fetches siteTitle from Supabase, then delegates all
// interactive nav rendering to NavbarClient (client component).
// ─────────────────────────────────────────────────────────────────────────────

import { createClient }   from '@/lib/supabase/server'
import { NavbarClient }   from './NavbarClient'

export async function Navbar() {
  const supabase = createClient()
  const { data: settings } = await supabase
    .from('site_settings')
    .select('site_title')
    .single()

  const siteTitle = settings?.site_title ?? 'Kak Rahma Blog'

  return <NavbarClient siteTitle={siteTitle} />
}

export default Navbar