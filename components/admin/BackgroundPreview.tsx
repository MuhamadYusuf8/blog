'use client'

import React from 'react'

interface BackgroundPreviewProps {
  type: 'image' | 'color' | 'default'
  value: string
}

export default function BackgroundPreview({ type, value }: BackgroundPreviewProps) {
  const backgroundStyle: React.CSSProperties =
    type === 'image' && value
      ? {
          backgroundImage: `url(${value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : type === 'color' && value && value !== '#0f0c29'
      ? {
          backgroundColor: value,
        }
      : {
          backgroundColor: '#ffffff',
          backgroundImage: [
            'radial-gradient(ellipse 90% 65% at 15% 5%,  #f8fafc 0%, transparent 55%)',
            'radial-gradient(ellipse 75% 55% at 88% 8%,  #ffffff 0%, transparent 50%)',
            'radial-gradient(ellipse 65% 75% at 50% 102%, #f4f4f5 0%, transparent 55%)',
          ].join(', '),
        }

  return (
    <div
      className="relative w-full h-40 rounded-xl overflow-hidden"
      style={backgroundStyle}
      aria-label="Background preview"
    >
      {/* Overlay to simulate page depth */}
      <div className="absolute inset-0 bg-white/10" />

      {/* Sample glass panel */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="rounded-xl p-4 max-w-[65%] text-center"
          style={{
            background: 'rgba(255,255,255,0.72)',
            border: '1px solid rgba(226,232,240,0.80)',
            boxShadow: '0 4px 16px -4px rgba(15,23,42,0.10)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p className="text-slate-900 font-bold text-[13.5px] leading-tight">Sample Post Title</p>
          <p className="text-slate-500 text-[11px] mt-1.5 line-clamp-2 font-medium leading-snug">
            Ini adalah simulasi bagaimana konten blog akan terlihat di atas background.
          </p>
        </div>
      </div>

      {/* Label */}
      <div className="absolute bottom-2.5 right-2.5">
        <span
          className="text-[9px] font-bold uppercase tracking-[0.12em] px-2 py-1 rounded-md"
          style={{
            background: 'rgba(255,255,255,0.90)',
            border: '1px solid rgba(226,232,240,0.80)',
            color: '#64748b',
          }}
        >
          Preview
        </span>
      </div>
    </div>
  )
}
