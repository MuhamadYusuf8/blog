// app/layout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Root layout — async Server Component.
// Pearl White Minimalist Glassmorphism default background.
// Fetches background from site_settings server-side (zero CLS).
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata }    from 'next'
import type { CSSProperties } from 'react'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Analytics }        from '@vercel/analytics/react'
import { createClient }     from '@/lib/supabase/server'
import { ToastProvider }    from '@/components/ui/Toast'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'

// ─── Fonts ───────────────────────────────────────────────────────────────────

const playfair = Playfair_Display({
  subsets:  ['latin'],
  variable: '--font-display',
  display:  'swap',
  weight:   ['400', '500', '600', '700'],
})

const dmSans = DM_Sans({
  subsets:  ['latin'],
  variable: '--font-sans',
  display:  'swap',
  weight:   ['300', '400', '500', '600'],
})

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default:  'Kak Rahma',
    template: '%s · Kak Rahma',
  },
  description: 'Tulisan harian dari Kak Rahma.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    siteName: 'Kak Rahma',
    locale:   'id_ID',
    type:     'website',
  },
  robots: { index: true, follow: true },
}

// ─── Background builder ──────────────────────────────────────────────────────

/**
 * Converts a site_settings background record into inline CSSProperties.
 * Default: Pearl White prisitne mesh — ultra-clean, breathable.
 */
function buildBackgroundStyle(
  type:  string | null | undefined,
  value: string | null | undefined,
): CSSProperties {
  if (type === 'image' && value) {
    return {
      backgroundImage:      `url(${value})`,
      backgroundSize:       'cover',
      backgroundPosition:   'center center',
      backgroundAttachment: 'fixed',
      backgroundRepeat:     'no-repeat',
    }
  }

  if (type === 'color' && value && value !== '#0f0c29') {
    return { backgroundColor: value }
  }

  // ── Pearl White default ────────────────────────────────────────────────
  // Pure white base with very soft radial hints in pearl/zinc.
  // Glass panels at rgba(255,255,255,0.60) float elegantly on this surface.
  return {
    backgroundColor: '#ffffff',
    backgroundImage: [
      'radial-gradient(ellipse 90% 65% at 15% 5%,  #f8fafc 0%, transparent 55%)',
      'radial-gradient(ellipse 75% 55% at 88% 8%,  #ffffff 0%, transparent 50%)',
      'radial-gradient(ellipse 65% 75% at 50% 102%, #f4f4f5 0%, transparent 55%)',
    ].join(', '),
  }
}

// ─── Layout ──────────────────────────────────────────────────────────────────

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: settings } = await supabase
    .from('site_settings')
    .select('background_type, background_value, site_title')
    .single()

  const bodyStyle = buildBackgroundStyle(
    settings?.background_type,
    settings?.background_value,
  )

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  return (
    <html
      lang="id"
      className={`${playfair.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${settings?.site_title ?? 'Kak Rahma'} RSS Feed`}
          href={`${siteUrl}/feed.xml`}
        />
        <link rel="sitemap" type="application/xml" href={`${siteUrl}/sitemap.xml`} />
        {/* Pearl white chrome tint */}
        <meta name="theme-color" content="#ffffff" />
      </head>

      <body
        style={bodyStyle}
        className={[
          'font-sans',
          'min-h-screen',
          'antialiased',
          'transition-[background-color,background-image]',
          'duration-700',
          'ease-in-out',
        ].join(' ')}
      >
        <NextTopLoader
          color="#d97706"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #d97706,0 0 5px #d97706"
        />
        <ToastProvider>
          {children}
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  )
}