/**
 * components/public/CommentList.tsx
 * Renders the full comment section for a post — SRS §2.2.
 * Server Component.
 *
 * Accepts an array of pre-fetched approved, non-soft-deleted comments.
 * Renders:
 *   - "💬 N Comments" header
 *   - List of CommentItem components
 *   - Empty state when no comments exist
 */

import React from 'react'
import { CommentItem } from '@/components/public/CommentItem'
import type { Comment } from '@/lib/supabase/types'

type CommentListProps = {
  comments: Comment[]
}

export function CommentList({ comments }: CommentListProps) {
  const count = comments.length

  return (
    <section aria-label="Komentar" className="flex flex-col gap-6 mt-4">
      {/* Header — SRS: "💬 N Comments" */}
      <h2 className="text-white font-display font-bold text-xl flex items-center gap-2">
        <span aria-hidden="true">💬</span>
        <span>
          {count === 0
            ? 'Komentar'
            : count === 1
            ? '1 Komentar'
            : `${count} Komentar`}
        </span>
      </h2>

      {count === 0 ? (
        /* Empty state */
        <div 
          className="p-8 text-center rounded-2xl border border-white/10 backdrop-blur-xl"
          style={{ background: 'rgba(255,255,255,0.03)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        >
          <div className="text-3xl mb-3" aria-hidden="true">🌙</div>
          <p className="text-slate-400 text-sm">
            Belum ada komentar. Jadilah yang pertama berkomentar!
          </p>
        </div>
      ) : (
        /* Comment list */
        <div 
          className="p-6 rounded-2xl border border-white/10 flex flex-col gap-6 backdrop-blur-xl"
          style={{ background: 'rgba(255,255,255,0.03)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        >
          {comments.map((comment, index) => (
            <React.Fragment key={comment.id}>
              <CommentItem comment={comment} />
              {/* Divider between comments, not after the last one */}
              {index < comments.length - 1 && (
                <hr className="border-white/10" aria-hidden="true" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </section>
  )
}

export default CommentList
