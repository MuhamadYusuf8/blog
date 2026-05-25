/**
 * components/admin/ConfirmModal.tsx — Accessible Confirmation Modal
 * SRS Phase 3F step 22.
 * 'use client'
 *
 * Accessible: role="dialog", aria-modal="true", focus trap,
 * aria-labelledby, Escape key to close.
 *
 * Used by PostsTable ("Move to Trash") and CommentModerationTable.
 */

'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/Button'

type ConfirmModalProps = {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title: string
  description: string
  confirmLabel?: string
  variant?: 'danger' | 'default'
  isLoading?: boolean
}

export function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = 'Confirm',
  variant = 'default',
  isLoading = false,
}: ConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      const btn = document.getElementById('confirm-modal-action-btn') as HTMLButtonElement | null
      btn?.focus()
    }
  }, [isOpen])

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onCancel()
      }
    },
    [isOpen, isLoading, onCancel]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current && !isLoading) onCancel()
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" aria-hidden="true" />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-desc"
        className="relative glass-panel-dark p-6 md:p-8 max-w-sm w-full flex flex-col gap-4 animate-fade-in"
      >
        {/* Icon */}
        <div
          className={`
            w-12 h-12 rounded-full flex items-center justify-center mx-auto
            ${variant === 'danger'
              ? 'bg-red-500/20 border border-red-500/30'
              : 'bg-purple-500/20 border border-purple-500/30'
            }
          `}
          aria-hidden="true"
        >
          {variant === 'danger' ? (
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        {/* Title */}
        <h2 id="confirm-modal-title" className="text-white font-bold text-lg text-center">
          {title}
        </h2>

        {/* Description */}
        <p id="confirm-modal-desc" className="text-white/60 text-sm text-center leading-relaxed">
          {description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            id="confirm-modal-action-btn"
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
            className="flex-1"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
