/**
 * components/public/ShareButtons.tsx
 * Social share buttons for a post — SRS §2.2.
 * 'use client' — required for navigator.clipboard (copy link action).
 *
 * Platforms: Twitter/X, WhatsApp, Copy Link
 */

'use client'

import React, { useState } from 'react'
import { useToast } from '@/components/ui/Toast'

type ShareButtonsProps = {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      showToast('Link berhasil disalin!', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Gagal menyalin link. Coba lagi.', 'error')
    }
  }

  return (
    <div className="flex items-center gap-3 flex-wrap" aria-label="Bagikan postingan ini">
      <span className="text-white/50 text-sm font-medium">Bagikan:</span>

      {/* Twitter / X */}
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bagikan ke Twitter/X"
        className="
          flex items-center gap-2 px-3 py-2 rounded-xl
          glass-panel-accent hover:bg-white/15
          text-white/70 hover:text-white text-sm
          transition-all duration-200
        "
      >
        {/* X (Twitter) icon */}
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Twitter
      </a>

      {/* WhatsApp */}
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bagikan ke WhatsApp"
        className="
          flex items-center gap-2 px-3 py-2 rounded-xl
          glass-panel-accent hover:bg-white/15
          text-white/70 hover:text-white text-sm
          transition-all duration-200
        "
      >
        {/* WhatsApp icon */}
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.845L.057 23.215a.5.5 0 00.615.666l5.652-1.483A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.513-5.228-1.406l-.374-.222-3.878 1.018 1.037-3.785-.243-.393A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
        WhatsApp
      </a>

      {/* Copy Link */}
      <button
        type="button"
        onClick={handleCopyLink}
        aria-label="Salin link postingan"
        aria-pressed={copied}
        className="
          flex items-center gap-2 px-3 py-2 rounded-xl
          glass-panel-accent hover:bg-white/15
          text-white/70 hover:text-white text-sm
          transition-all duration-200
        "
      >
        {copied ? (
          <>
            <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Tersalin!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Salin Link
          </>
        )}
      </button>
    </div>
  )
}

export default ShareButtons
