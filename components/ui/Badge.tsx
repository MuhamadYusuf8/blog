/**
 * components/ui/Badge.tsx
 * Small pill badge — used for category tags, post status indicators,
 * and the pending comment count in the admin sidebar.
 */

import React from 'react'

type BadgeColor =
  | 'purple'
  | 'pink'
  | 'blue'
  | 'green'
  | 'amber'
  | 'red'
  | 'gray'
  | 'white'

const colorClassMap: Record<BadgeColor, string> = {
  purple: 'bg-purple-500/20 text-purple-200 border border-purple-500/30',
  pink:   'bg-pink-500/20 text-pink-200 border border-pink-500/30',
  blue:   'bg-blue-500/20 text-blue-200 border border-blue-500/30',
  green:  'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30',
  amber:  'bg-amber-500/20 text-amber-200 border border-amber-500/30',
  red:    'bg-red-500/20 text-red-200 border border-red-500/30',
  gray:   'bg-white/10 text-white/70 border border-white/20',
  white:  'bg-white/15 text-white border border-white/25',
}

type BadgeProps = {
  color?: BadgeColor
  children: React.ReactNode
  className?: string
}

export function Badge({ color = 'purple', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        rounded-full text-xs font-medium
        backdrop-blur-sm
        ${colorClassMap[color]}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  )
}

export default Badge
