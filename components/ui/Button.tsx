/**
 * components/ui/Button.tsx
 * Fully typed button with variants, loading state, and spinner.
 * Variants: 'primary' | 'ghost' | 'danger' | 'glass'
 */

'use client'

import React from 'react'

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'glass'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white border border-purple-500/50 shadow-lg shadow-purple-900/30',
  ghost:
    'bg-transparent hover:bg-white/10 active:bg-white/20 text-white/80 hover:text-white border border-white/20 hover:border-white/40',
  danger:
    'bg-red-600/80 hover:bg-red-500/90 active:bg-red-700 text-white border border-red-500/50 shadow-lg shadow-red-900/30',
  glass:
    'glass-panel hover:bg-white/20 active:bg-white/25 text-white border-white/25 shadow-lg',
}

type ButtonProps = {
  variant?: ButtonVariant
  isLoading?: boolean
  children: React.ReactNode
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  variant = 'primary',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading

  return (
    <button
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2 rounded-xl
        text-sm font-medium
        transition-all duration-200 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${className}
      `.trim()}
      {...rest}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}

export default Button
