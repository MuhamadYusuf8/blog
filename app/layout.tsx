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
import MusicPlayer         from '@/components/ui/MusicPlayer'
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

  if (type === 'color' && value) {
    return { backgroundColor: value }
  }

  // ── Dark default — matches page.tsx bg-[#0f0f0f] ──────────────────────
  return {
    backgroundColor: '#0f0f0f',
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
    .select('background_type, background_value, site_title, music_url, music_title, music_enabled')
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
        {/* Dark chrome tint — matches page.tsx dark theme */}
        <meta name="theme-color" content="#0f0f0f" />
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
          color="#7c3aed"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #7c3aed,0 0 5px #a855f7"
        />
        <ToastProvider>
          {children}
        </ToastProvider>
        {settings?.music_enabled && settings?.music_url && (
          <MusicPlayer
            url={settings.music_url}
            title={settings.music_title ?? 'Musik Latar'}
          />
        )}
        <Analytics />
      </body>
    </html>
  )
}