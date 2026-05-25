/**
 * components/ui/GlassPanel.tsx
 * Polymorphic glassmorphism wrapper — SRS §2.1, RULE 1.
 *
 * Every content-bearing container in the app MUST use this component
 * (or one of the four .glass-panel-* Tailwind utilities directly).
 * Using a plain unstyled <div> is a Rule 1 violation.
 *
 * Props:
 *   variant  - which glass variant to apply (default: 'default')
 *   as       - which HTML element to render (default: 'div')
 *   className - additional Tailwind classes to merge in
 *   children  - content
 *   ...rest   - any standard HTML attributes for the chosen element
 */

import React from 'react'

type GlassVariant = 'default' | 'dark' | 'accent' | 'error'

// Map variants to the custom Tailwind utilities from tailwind.config.ts
const variantClassMap: Record<GlassVariant, string> = {
  default: 'glass-panel',
  dark: 'glass-panel-dark',
  accent: 'glass-panel-accent',
  error: 'glass-panel-error',
}

// Supported HTML element types for the polymorphic `as` prop
type AsProp = 'div' | 'section' | 'article' | 'aside' | 'nav' | 'main' | 'header' | 'footer'

type GlassPanelProps<T extends AsProp = 'div'> = {
  variant?: GlassVariant
  as?: T
  className?: string
  children?: React.ReactNode
} & Omit<React.ComponentPropsWithRef<T>, 'as' | 'variant'>

/**
 * Polymorphic glassmorphism container.
 *
 * @example
 * // Default glass panel
 * <GlassPanel className="p-6">Content</GlassPanel>
 *
 * @example
 * // Dark glass panel rendered as an <aside>
 * <GlassPanel variant="dark" as="aside" className="p-4">Sidebar</GlassPanel>
 *
 * @example
 * // Error glass panel with role="alert" for WCAG compliance
 * <GlassPanel variant="error" role="alert" className="p-8">Error</GlassPanel>
 */
export function GlassPanel<T extends AsProp = 'div'>({
  variant = 'default',
  as,
  className = '',
  children,
  ...rest
}: GlassPanelProps<T>) {
  const Tag = (as ?? 'div') as AsProp
  const glassClass = variantClassMap[variant]

  return React.createElement(
    Tag,
    {
      className: `${glassClass} ${className}`.trim(),
      ...rest,
    },
    children
  )
}

export default GlassPanel
