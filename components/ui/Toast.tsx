/**
 * components/ui/Toast.tsx
 * Toast notification system — 'use client'.
 *
 * Provides:
 *   1. <ToastContainer /> — mount once in app/layout.tsx inside the body.
 *      Renders all active toasts in a fixed bottom-right portal.
 *   2. useToast() hook — call from any Client Component to show toasts.
 *   3. showToast() imperative helper — for use outside React (e.g. Server
 *      Action results surfaced via URL search params can trigger this).
 *
 * Toast types: 'success' | 'error' | 'info'
 * Auto-dismisses after 4 seconds. Can be manually dismissed.
 */

'use client'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue | null>(null)

// ---------------------------------------------------------------------------
// Icon helpers
// ---------------------------------------------------------------------------

function ToastIcon({ type }: { type: ToastType }) {
  if (type === 'success') {
    return (
      <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )
  }
  if (type === 'error') {
    return (
      <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    )
  }
  return (
    <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
      <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 0 0012 2z" />
      </svg>
    </div>
  )
}

const borderColorMap: Record<ToastType, string> = {
  success: 'border-emerald-500/30',
  error:   'border-red-500/30',
  info:    'border-violet-500/30',
}

// ---------------------------------------------------------------------------
// Single Toast item component
// ---------------------------------------------------------------------------

function ToastItemComponent({
  toast,
  onDismiss,
}: {
  toast: ToastItem
  onDismiss: (id: string) => void
}) {
  const [visible, setVisible] = useState(false)

  // Animate in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4000)
    return () => clearTimeout(t)
  }, [toast.id, onDismiss])

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-center gap-3.5 p-4 rounded-2xl
        bg-[#141417]/95 backdrop-blur-2xl border ${borderColorMap[toast.type]}
        text-white max-w-sm w-full shadow-[0_16px_40px_rgba(0,0,0,0.6)]
        transition-all duration-300 ease-out
        ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
      `}
    >
      <ToastIcon type={toast.type} />
      <p className="flex-1 font-semibold text-white text-sm leading-snug">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-white/40 hover:text-white hover:bg-white/10 p-1.5 rounded-xl transition-all shrink-0"
        aria-label="Dismiss notification"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Provider + Container (mount once in root layout)
// ---------------------------------------------------------------------------

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counterRef = useRef(0)

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast-${++counterRef.current}`
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Fixed toast container — bottom-right on desktop, bottom-center on mobile */}
      <div
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 items-end sm:items-end max-w-sm w-full sm:w-auto pointer-events-none"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full">
            <ToastItemComponent toast={toast} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hook — use in Client Components
// ---------------------------------------------------------------------------

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>.')
  }
  return ctx
}
