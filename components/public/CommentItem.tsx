/**
 * components/public/CommentItem.tsx
 * Renders a single approved comment — SRS §2.2.
 * Server Component.
 *
 * Renders:
 *   - Avatar circle (first letter of commenter_name, styled as glass-panel circle)
 *   - Commenter name
 *   - Relative time (e.g. "3 hari lalu")
 *   - Comment body in text-white/80
 */

import React from 'react'
import type { Comment } from '@/lib/supabase/types'

type CommentItemProps = {
  comment: Comment
}

function getRelativeTime(dateString: string): string {
  const now = Date.now()
  const then = new Date(dateString).getTime()
  const diffMs = now - then
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSeconds < 60) return 'baru saja'
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`
  if (diffHours < 24) return `${diffHours} jam lalu`
  if (diffDays < 7) return `${diffDays} hari lalu`
  if (diffWeeks < 4) return `${diffWeeks} minggu lalu`
  if (diffMonths < 12) return `${diffMonths} bulan lalu`
  return `${diffYears} tahun lalu`
}

// Generates a deterministic background gradient from a name string
function getAvatarGradient(name: string): string {
  const gradients = [
    'from-violet-600/30 to-fuchsia-600/30 text-violet-200 border-violet-500/40',
    'from-rose-600/30 to-orange-600/30 text-rose-200 border-rose-500/40',
    'from-emerald-600/30 to-teal-600/30 text-emerald-200 border-emerald-500/40',
    'from-blue-600/30 to-cyan-600/30 text-blue-200 border-blue-500/40',
    'from-pink-600/30 to-purple-600/30 text-pink-200 border-pink-500/40',
    'from-amber-600/30 to-yellow-600/30 text-amber-200 border-amber-500/40',
  ]
  const index = name.charCodeAt(0) % gradients.length
  return gradients[index]
}

export function CommentItem({ comment }: CommentItemProps) {
  const initial = comment.commenter_name.charAt(0).toUpperCase()
  const gradient = getAvatarGradient(comment.commenter_name)
  const relativeTime = getRelativeTime(comment.created_at)

  return (
    <article className="flex items-start gap-3" aria-label={`Komentar dari ${comment.commenter_name}`}>
      {/* Avatar circle */}
      <div
        className={`
          w-9 h-9 rounded-full shrink-0
          flex items-center justify-center
          bg-gradient-to-br ${gradient}
          border shadow-sm
        `}
        aria-hidden="true"
      >
        <span className="text-sm font-bold">{initial}</span>
      </div>

      {/* Comment content */}
      <div className="flex-1 min-w-0">
        {/* Name + timestamp row */}
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <span className="text-white text-sm font-semibold leading-none tracking-tight">
            {comment.commenter_name}
          </span>
          <time
            dateTime={comment.created_at}
            title={new Intl.DateTimeFormat('id-ID', {
              dateStyle: 'full',
              timeStyle: 'short',
            }).format(new Date(comment.created_at))}
            className="text-slate-400 text-xs font-medium"
          >
            {relativeTime}
          </time>
        </div>

        {/* Body */}
        <p className="text-slate-300 text-[13.5px] leading-relaxed whitespace-pre-wrap break-words">
          {comment.body}
        </p>
      </div>
    </article>
  )
}

export default CommentItem
