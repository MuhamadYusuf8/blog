/**
 * components/public/CommentForm.tsx
 * Public comment submission form — SRS §3.3.
 * 'use client' — uses React state for form management and toast feedback.
 *
 * Features:
 *   - commenter_name and body fields with validation
 *   - Hidden honeypot field (anti-bot, aria-hidden)
 *   - Submits via the submitComment Server Action
 *   - Loading state disables form during submission
 *   - Toast on success / error
 *   - Uses .glass-panel-accent
 */

'use client'

import React, { useRef, useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { submitComment } from '@/app/actions/comments'

type CommentFormProps = {
  postId: string
}

export function CommentForm({ postId }: CommentFormProps) {
  const { showToast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const result = await submitComment(formData)

      if (result.success) {
        setSubmitted(true)
        formRef.current?.reset()
        showToast(
          'Komentar berhasil dikirim! Menunggu moderasi sebelum ditampilkan.',
          'success'
        )
      } else {
        showToast(result.error ?? 'Terjadi kesalahan. Silakan coba lagi.', 'error')
      }
    } catch {
      showToast('Terjadi kesalahan jaringan. Silakan coba lagi.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="glass-card border border-emerald-200 bg-emerald-50/30 rounded-xl p-6 text-center">
        <div className="text-3xl mb-3" aria-hidden="true">✅</div>
        <h3 className="text-slate-800 font-semibold mb-1">Komentar Terkirim!</h3>
        <p className="text-slate-500 text-sm">
          Komentar Anda sedang menunggu moderasi dan akan segera ditampilkan.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium underline underline-offset-2 transition-colors duration-200"
        >
          Tambah komentar lain
        </button>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 md:p-8 rounded-2xl shadow-sm">
      <h3 className="text-slate-800 font-display font-semibold text-lg mb-5 flex items-center gap-2">
        <span aria-hidden="true">✍️</span> Tinggalkan Komentar
      </h3>

      <form ref={formRef} onSubmit={handleSubmit}>
        {/* Hidden post_id */}
        <input type="hidden" name="post_id" value={postId} />

        {/*
         * HONEYPOT FIELD — anti-bot trap (SRS §3.3)
         * Must be display:none and aria-hidden so real users never see it.
         * If this field contains any value on submission, the Server Action
         * silently "accepts" the comment but marks honeypot_triggered = true.
         */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <label htmlFor="website">Website (do not fill)</label>
          <input
            type="text"
            id="website"
            name="honeypot"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-4">
          {/* Name field */}
          <div>
            <label
              htmlFor="commenter_name"
              className="block text-[13px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5"
            >
              Nama <span className="text-rose-500" aria-label="wajib diisi">*</span>
            </label>
            <input
              type="text"
              id="commenter_name"
              name="commenter_name"
              required
              minLength={2}
              maxLength={80}
              placeholder="Nama Anda"
              disabled={isSubmitting}
              className="
                w-full px-4 py-2.5 rounded-xl
                bg-white/70 border border-slate-200
                text-slate-800 placeholder-slate-400
                text-sm shadow-sm
                focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
              "
            />
          </div>

          {/* Comment body */}
          <div>
            <label
              htmlFor="comment_body"
              className="block text-[13px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5"
            >
              Komentar <span className="text-rose-500" aria-label="wajib diisi">*</span>
            </label>
            <textarea
              id="comment_body"
              name="body"
              required
              minLength={5}
              maxLength={2000}
              rows={4}
              placeholder="Tulis komentar Anda di sini..."
              disabled={isSubmitting}
              className="
                w-full px-4 py-2.5 rounded-xl
                bg-white/70 border border-slate-200
                text-slate-800 placeholder-slate-400
                text-sm leading-relaxed resize-none shadow-sm
                focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
              "
            />
            <p className="text-slate-400 text-xs mt-1 font-medium">Maksimal 2000 karakter</p>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="self-start"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}
          </Button>

          <p className="text-slate-400 text-xs font-medium">
            Komentar Anda akan ditampilkan setelah dimoderasi.
          </p>
        </div>
      </form>
    </div>
  )
}

export default CommentForm
