'use client'

import React, { useState, useTransition } from 'react'
import ImageUploader from '@/components/admin/ImageUploader'
import BackgroundPreview from '@/components/admin/BackgroundPreview'
import { updateBackground } from '@/app/admin/settings/actions'

type TabType = 'default' | 'image' | 'color'

const COLOR_PRESETS = [
  { hex: '#f8fafc', label: 'Slate Light' },
  { hex: '#f1f5f9', label: 'Slate Soft' },
  { hex: '#eff6ff', label: 'Blue Light' },
  { hex: '#f0fdfa', label: 'Teal Light' },
  { hex: '#ecfdf5', label: 'Emerald Light' },
  { hex: '#fdf2f8', label: 'Pink Light' },
  { hex: '#fffbeb', label: 'Amber Light' },
  { hex: '#faf5ff', label: 'Purple Light' },
  { hex: '#1e293b', label: 'Slate Dark' },
  { hex: '#0f172a', label: 'Midnight' },
]

interface BackgroundChangerProps {
  currentType: 'image' | 'color' | 'default' | string
  currentValue: string
}

export default function BackgroundChanger({ currentType, currentValue }: BackgroundChangerProps) {
  const isDefault = currentType === 'color' && (!currentValue || currentValue === '#0f0c29' || currentValue === '')
  const initialTab = isDefault ? 'default' : currentType
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)
  const [selectedColor, setSelectedColor] = useState(currentType === 'color' && !isDefault ? currentValue : '#f8fafc')
  const [selectedImageUrl, setSelectedImageUrl] = useState(currentType === 'image' ? currentValue : '')
  const [isPending, startTransition] = useTransition()
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const previewValue = activeTab === 'default' ? '' : activeTab === 'color' ? selectedColor : selectedImageUrl

  function handleApply() {
    const value = activeTab === 'default' ? '' : activeTab === 'color' ? selectedColor : selectedImageUrl
    if (activeTab !== 'default' && !value) {
      setStatusMsg({ type: 'error', text: 'Pilih background terlebih dahulu.' })
      return
    }
    startTransition(async () => {
      const result = await updateBackground(activeTab, value)
      setStatusMsg(
        result.success
          ? { type: 'success', text: 'Background berhasil diperbarui.' }
          : { type: 'error', text: result.error ?? 'Update gagal.' }
      )
      setTimeout(() => setStatusMsg(null), 4000)
    })
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.72)',
        border: '1px solid rgba(226,232,240,0.80)',
        boxShadow: '0 2px 12px -4px rgba(15,23,42,0.05)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* ── Panel header ──────────────────────────────────────────────── */}
      <div
        className="px-5 py-4 flex items-center gap-2"
        style={{ borderBottom: '1px solid rgba(226,232,240,0.70)' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(241,245,249,0.90)', border: '1px solid rgba(226,232,240,0.80)' }}
          aria-hidden="true"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#64748b" strokeWidth="2">
            <rect x="1" y="1" width="14" height="14" rx="2" />
            <circle cx="5.5" cy="5.5" r="1.5" />
            <path d="M1 11l4-4 3 3 3-3 4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-[13px] font-semibold text-slate-700">Background Situs</h2>
      </div>

      <div className="p-5 space-y-5">

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        <div
          className="inline-flex rounded-xl p-1 gap-0.5"
          style={{
            background: 'rgba(241,245,249,0.90)',
            border: '1px solid rgba(226,232,240,0.80)',
          }}
        >
          {(['default', 'image', 'color'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-150',
                activeTab === tab
                  ? 'bg-white shadow-[0_1px_4px_-1px_rgba(15,23,42,0.10)] border border-slate-200/80 text-slate-700'
                  : 'text-slate-400 hover:text-slate-600',
              ].join(' ')}
            >
              {tab === 'default' ? (
                <>
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="8" cy="8" r="6" strokeLinecap="round" strokeDasharray="2 3" />
                    <circle cx="8" cy="8" r="2" />
                  </svg>
                  Default
                </>
              ) : tab === 'image' ? (
                <>
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="14" height="10" rx="1.5" />
                    <circle cx="6" cy="8" r="2" />
                  </svg>
                  Gambar
                </>
              ) : (
                <>
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="8" cy="8" r="6.5" />
                    <path d="M8 1.5v13M1.5 8h13" strokeLinecap="round" strokeOpacity="0.4" />
                  </svg>
                  Warna
                </>
              )}
            </button>
          ))}
        </div>

        {/* ── Default tab ─────────────────────────────────────────────────── */}
        {activeTab === 'default' && (
          <div className="space-y-3">
            <p className="text-[12px] text-slate-400">
              Situs akan menggunakan background tema Pearl White bawaan.
            </p>
          </div>
        )}

        {/* ── Image tab ─────────────────────────────────────────────────── */}
        {activeTab === 'image' && (
          <div className="space-y-3">
            <p className="text-[12px] text-slate-400">
              Upload gambar untuk dijadikan background situs.
            </p>
            <ImageUploader
              onUpload={(url) => setSelectedImageUrl(url)}
              bucket="posts-images"
              folder="backgrounds"
              label="Background Image"
            />
            {selectedImageUrl && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{
                  background: 'rgba(241,245,249,0.70)',
                  border: '1px solid rgba(226,232,240,0.70)',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <path d="M2 4c0-1.1.9-2 2-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" />
                </svg>
                <p className="text-[10.5px] text-slate-400 font-medium truncate">{selectedImageUrl}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Color tab ─────────────────────────────────────────────────── */}
        {activeTab === 'color' && (
          <div className="space-y-4">
            <p className="text-[12px] text-slate-400">
              Pilih warna solid untuk background situs.
            </p>

            {/* Preset swatches */}
            <div className="flex flex-wrap gap-2.5">
              {COLOR_PRESETS.map(({ hex, label }) => (
                <button
                  key={hex}
                  onClick={() => setSelectedColor(hex)}
                  title={label}
                  aria-label={`Pilih warna ${label}`}
                  className="w-8 h-8 rounded-full transition-all duration-150 hover:scale-110 focus-visible:outline-none"
                  style={{
                    backgroundColor: hex,
                    border: selectedColor === hex
                      ? '2.5px solid #64748b'
                      : '2px solid rgba(226,232,240,0.80)',
                    boxShadow: selectedColor === hex
                      ? '0 0 0 3px rgba(100,116,139,0.15)'
                      : '0 1px 4px -1px rgba(15,23,42,0.15)',
                    transform: selectedColor === hex ? 'scale(1.12)' : undefined,
                  }}
                />
              ))}
            </div>

            {/* Custom color picker */}
            <div
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{
                background: 'rgba(248,250,252,0.80)',
                border: '1px solid rgba(226,232,240,0.80)',
              }}
            >
              <label htmlFor="custom-color" className="text-[12px] font-semibold text-slate-500 whitespace-nowrap">
                Kustom:
              </label>
              <div className="relative">
                <input
                  id="custom-color"
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0.5"
                  style={{ background: 'transparent' }}
                />
              </div>
              <span
                className="text-[12px] font-mono font-semibold px-2 py-1 rounded-md"
                style={{
                  background: 'rgba(241,245,249,0.90)',
                  border: '1px solid rgba(226,232,240,0.80)',
                  color: '#475569',
                }}
              >
                {selectedColor}
              </span>
            </div>
          </div>
        )}

        {/* ── Live preview ──────────────────────────────────────────────── */}
        <div className="space-y-2">
          <p className="text-[11.5px] font-semibold text-slate-400 uppercase tracking-[0.10em]">
            Live Preview
          </p>
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(226,232,240,0.80)' }}
          >
            <BackgroundPreview type={activeTab} value={previewValue} />
          </div>
        </div>

        {/* ── Apply button ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 flex-wrap pt-1">
          <button
            onClick={handleApply}
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12.5px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(15,23,42,0.05)',
              border: '1px solid rgba(15,23,42,0.10)',
              color: '#0f172a',
            }}
          >
            {isPending ? (
              <span
                className="w-3.5 h-3.5 rounded-full border-2 inline-block"
                style={{
                  borderColor: 'rgba(226,232,240,0.80)',
                  borderTopColor: '#64748b',
                  animation: 'spin 0.75s linear infinite',
                }}
              />
            ) : (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            Terapkan Background
          </button>

          {statusMsg && (
            <div
              className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg"
              style={
                statusMsg.type === 'success'
                  ? { background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.22)', color: '#059669' }
                  : { background: 'rgba(254,242,242,0.97)', border: '1px solid rgba(239,68,68,0.20)', color: '#991b1b' }
              }
            >
              {statusMsg.type === 'success' ? (
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="8" cy="8" r="6.5" /><path d="M8 5v3M8 11v.5" strokeLinecap="round" />
                </svg>
              )}
              {statusMsg.text}
            </div>
          )}
        </div>

        <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
      </div>
    </div>
  )
}