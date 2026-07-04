/** @type {import('next').NextConfig} */

/**
 * Content Security Policy directives — SRS §7.4
 *
 * script-src:
 *   - 'self'                → our own scripts
 *   - hcaptcha.com          → hCaptcha widget script
 *   - newassets.hcaptcha.com
 *   - vercel insights       → Vercel Speed Insights / Analytics
 *
 * frame-src:
 *   - hcaptcha.com          → hCaptcha iframe
 *   - www.youtube.com       → Tiptap YouTube embeds
 *
 * img-src:
 *   - 'self' blob: data:    → Next.js Image + local blobs
 *   - *.supabase.co         → Storage bucket images
 *
 * connect-src:
 *   - 'self'
 *   - *.supabase.co         → Supabase API calls from browser client
 *   - vitals.vercel-insights.com → Vercel Analytics beacon
 *
 * style-src:
 *   - 'self' 'unsafe-inline' → Tailwind injected styles (required for Next.js)
 *
 * font-src:
 *   - 'self' fonts.gstatic.com
 *
 * object-src: 'none'        → forbid Flash and legacy plugins
 * base-uri: 'self'          → prevent base-tag injection
 * form-action: 'self'       → prevent cross-origin form submission
 * upgrade-insecure-requests → force HTTPS in production
 */
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com https://vercel.live;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' blob: data: https://*.supabase.co https://images.unsplash.com https://plus.unsplash.com;
  media-src 'self' https://*.supabase.co;
  object-src 'none';
  frame-src https://hcaptcha.com https://*.hcaptcha.com https://www.youtube.com https://youtube.com;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com https://hcaptcha.com https://*.hcaptcha.com;
  form-action 'self';
  base-uri 'self';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, ' ')
  .trim()

const securityHeaders = [
  // Prevent clickjacking — SRS §7.4
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  // Prevent MIME-type sniffing — SRS §7.4
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Minimal referrer for cross-origin requests — SRS §7.4
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // Legacy XSS filter (belt-and-suspenders) — SRS §7.4
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  // Disable unnecessary browser features — SRS §7.4
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // Full Content Security Policy — SRS §7.4
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy,
  },
]

const nextConfig = {
  // Apply security headers to all routes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },

  // Allow Next.js Image to optimize images from Supabase Storage — SRS §4.5
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Enable experimental server actions (required for Next.js 14 form actions)
  experimental: {
    serverActions: {
      // Increase body size limit for image uploads via Server Actions
      bodySizeLimit: '4mb',
    },
  },
}

module.exports = nextConfig
