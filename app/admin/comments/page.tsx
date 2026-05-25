import CommentModerationTable from '@/components/admin/CommentModerationTable'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comments | Admin',
}

export default function CommentsPage() {
  return (
    <div className="flex flex-col gap-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.4px] text-slate-900">
            Comment Moderation
          </h1>
          <p className="text-[12.5px] text-slate-400 mt-0.5 font-medium">
            Kelola dan moderasi komentar dari pembaca blog.
          </p>
        </div>

        {/* Decorative icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.72)',
            border: '1px solid rgba(226,232,240,0.80)',
            boxShadow: '0 2px 8px -3px rgba(15,23,42,0.06)',
          }}
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#64748b" strokeWidth="1.8">
            <path d="M2 4c0-1.1.9-2 2-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6l-4 2V4z" />
          </svg>
        </div>
      </div>

      <CommentModerationTable />
    </div>
  )
}