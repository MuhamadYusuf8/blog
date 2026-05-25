import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],

  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
      },

      colors: {
        pearl: {
          50:  '#ffffff',
          100: '#f8fafc',
          200: '#f4f4f5',
          300: '#e2e8f0',
        },
        glass: {
          white:  'rgba(255, 255, 255, 0.60)',
          border: 'rgba(255, 255, 255, 1)',
          shadow: 'rgba(0, 0, 0, 0.04)',
          hover:  'rgba(255, 255, 255, 0.75)',
        },
        accent: {
          50:  '#fffbf0',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },

      backgroundImage: {
        'pearl-mesh': [
          'radial-gradient(ellipse 80% 60% at 15% 5%, #f8fafc 0%, transparent 55%)',
          'radial-gradient(ellipse 70% 50% at 85% 5%, #ffffff 0%, transparent 50%)',
          'radial-gradient(ellipse 60% 70% at 50% 100%, #f4f4f5 0%, transparent 55%)',
        ].join(', '),
      },

      boxShadow: {
        // ── Pearl White — extremely soft, diffused ──────────────────
        'glass':            '0 10px 40px -10px rgba(0,0,0,0.04), 0 1px 3px -1px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.9)',
        'glass-hover':      '0 20px 60px -15px rgba(0,0,0,0.07), 0 4px 16px -4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
        'glass-card':       '0 4px 20px -4px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.8)',
        'glass-card-hover': '0 12px 36px -8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
        'glass-nav':        '0 1px 0 rgba(0,0,0,0.03), 0 4px 20px -4px rgba(0,0,0,0.03)',
        'glass-error':      '0 8px 32px rgba(220,38,38,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
        'glass-dark':       '0 20px 60px -15px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.05)',
        'float':            '0 32px 80px -20px rgba(0,0,0,0.08)',
        'soft':             '0 2px 12px rgba(0,0,0,0.03)',
        'lift':             '0 20px 60px rgba(0,0,0,0.06)',
      },

      backdropBlur: {
        glass:    '24px',
        'glass-sm': '12px',
        'glass-lg': '40px',
      },

      borderRadius: {
        glass:    '20px',
        'glass-sm': '14px',
        'glass-lg': '28px',
      },

      transitionDuration: {
        '400': '400ms',
      },

      letterSpacing: {
        display:    '-0.03em',
        'tight-xl': '-0.025em',
      },

      animation: {
        'float-slow':    'floatY 7s ease-in-out infinite',
        'float-delayed': 'floatY 7s ease-in-out 2s infinite',
        'spin-slow':     'spin 40s linear infinite',
        'spin-medium':   'spinReverse 26s linear infinite',
        'fade-up':       'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
      },

      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-14px)' },
        },
        spinReverse: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(-360deg)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },

  plugins: [
    typography,

    plugin(({ addUtilities, addComponents }) => {

      // ── Pearl White core glass panels ──────────────────────────────
      addUtilities({

        // PRIMARY — hyper-clean frosted glass per spec
        '.glass-panel': {
          background:           'rgba(255, 255, 255, 0.60)',
          backdropFilter:       'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border:               '1px solid rgba(255, 255, 255, 1)',
          borderRadius:         '20px',
          boxShadow:            '0 10px 40px -10px rgba(0,0,0,0.04), 0 1px 3px -1px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.9)',
        },

        // Hover lift state
        '.glass-panel-hover': {
          background:           'rgba(255, 255, 255, 0.75)',
          backdropFilter:       'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          border:               '1px solid rgba(255, 255, 255, 1)',
          borderRadius:         '20px',
          boxShadow:            '0 20px 60px -15px rgba(0,0,0,0.07), 0 4px 16px -4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)',
        },

        // Nested / secondary card — slightly lighter
        '.glass-card': {
          background:           'rgba(255, 255, 255, 0.50)',
          backdropFilter:       'blur(16px) saturate(160%)',
          WebkitBackdropFilter: 'blur(16px) saturate(160%)',
          border:               '1px solid rgba(255, 255, 255, 0.90)',
          borderRadius:         '14px',
          boxShadow:            '0 4px 20px -4px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.8)',
        },

        // Form inputs inside glass panels
        '.glass-input': {
          background:           'rgba(248, 250, 252, 0.80)',
          backdropFilter:       'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border:               '1px solid rgba(203, 213, 225, 0.60)',
          borderRadius:         '10px',
          boxShadow:            'inset 0 1px 3px rgba(0,0,0,0.02)',
          transition:           'all 0.2s ease',
          '&:focus': {
            background:  'rgba(255, 255, 255, 0.90)',
            borderColor: 'rgba(99, 102, 241, 0.35)',
            boxShadow:   '0 0 0 3px rgba(99,102,241,0.06), inset 0 1px 3px rgba(0,0,0,0.02)',
            outline:     'none',
          },
        },

        // Dark quote / accent panel — the one dark counterpoint
        '.glass-panel-dark': {
          background:           'linear-gradient(145deg, rgba(15,23,42,0.94) 0%, rgba(51,65,85,0.96) 100%)',
          backdropFilter:       'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border:               '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius:         '20px',
          boxShadow:            '0 20px 60px -15px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.05)',
        },

        // Comment / accent surfaces
        '.glass-accent': {
          background:           'rgba(255, 255, 255, 0.45)',
          backdropFilter:       'blur(12px) saturate(150%)',
          WebkitBackdropFilter: 'blur(12px) saturate(150%)',
          border:               '1px solid rgba(255, 255, 255, 0.85)',
          borderRadius:         '14px',
          boxShadow:            '0 4px 16px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.8)',
        },

        // Error pages
        '.glass-error': {
          background:           'rgba(255, 255, 255, 0.65)',
          backdropFilter:       'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          border:               '1px solid rgba(254, 202, 202, 0.60)',
          borderRadius:         '20px',
          boxShadow:            '0 8px 32px rgba(220,38,38,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
        },

        // Navbar — pill style floating above page
        '.glass-nav': {
          background:           'rgba(255, 255, 255, 0.78)',
          backdropFilter:       'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border:               '1px solid rgba(255, 255, 255, 0.95)',
          borderRadius:         '14px',
          boxShadow:            '0 2px 16px -4px rgba(0,0,0,0.05), 0 1px 0 rgba(0,0,0,0.02)',
        },

        // Footer
        '.glass-footer': {
          background:           'rgba(255, 255, 255, 0.50)',
          backdropFilter:       'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          borderTop:            '1px solid rgba(255, 255, 255, 0.90)',
        },
      })

      // ── Pearl White backgrounds ────────────────────────────────────
      addUtilities({
        '.bg-pearl': {
          background: [
            'radial-gradient(ellipse 80% 60% at 15% 5%, #f8fafc 0%, transparent 55%)',
            'radial-gradient(ellipse 70% 50% at 85% 5%, #ffffff 0%, transparent 50%)',
            'radial-gradient(ellipse 60% 70% at 50% 100%, #f4f4f5 0%, transparent 55%)',
          ].join(', '),
          backgroundColor: '#ffffff',
        },
        // Legacy warm mesh — still works if admin sets no background
        '.bg-mesh-warm': {
          backgroundImage: [
            'radial-gradient(at 20% 20%, hsla(30,100%,94%,0.6) 0px, transparent 50%)',
            'radial-gradient(at 80% 10%, hsla(200,80%,92%,0.5) 0px, transparent 50%)',
            'radial-gradient(at 50% 80%, hsla(340,60%,95%,0.4) 0px, transparent 50%)',
            'radial-gradient(at 10% 90%, hsla(60,80%,93%,0.4)  0px, transparent 50%)',
            'radial-gradient(at 90% 80%, hsla(170,60%,92%,0.4) 0px, transparent 50%)',
          ].join(', '),
          backgroundColor: '#fdfaf7',
        },
        '.bg-mesh-sky': {
          backgroundImage: [
            'radial-gradient(at 15% 25%, hsla(210,80%,94%,0.7) 0px, transparent 50%)',
            'radial-gradient(at 75% 15%, hsla(190,70%,93%,0.5) 0px, transparent 50%)',
            'radial-gradient(at 50% 75%, hsla(240,60%,95%,0.4) 0px, transparent 50%)',
            'radial-gradient(at 85% 70%, hsla(160,50%,93%,0.4) 0px, transparent 50%)',
          ].join(', '),
          backgroundColor: '#f7fafd',
        },
      })

      // ── Utility helpers ───────────────────────────────────────────
      addUtilities({
        '.glass-transition': {
          transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
        },

        // Pearl-style tag pill — monochrome, no amber shout
        '.tag-pill': {
          display:       'inline-flex',
          alignItems:    'center',
          padding:       '0.2rem 0.65rem',
          borderRadius:  '9999px',
          fontSize:      '0.7rem',
          fontWeight:    '600',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          background:    'rgba(0, 0, 0, 0.05)',
          border:        '1px solid rgba(0, 0, 0, 0.06)',
          color:         '#64748b',
        },

        // Amber accent pill — used only for featured/highlighted items
        '.tag-pill-amber': {
          display:       'inline-flex',
          alignItems:    'center',
          padding:       '0.2rem 0.65rem',
          borderRadius:  '9999px',
          fontSize:      '0.7rem',
          fontWeight:    '600',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          background:    'rgba(251, 191, 36, 0.10)',
          border:        '1px solid rgba(251, 191, 36, 0.22)',
          color:         '#92400e',
        },

        '.progress-bar': {
          position:   'fixed',
          top:        '0',
          left:       '0',
          height:     '2px',
          background: 'linear-gradient(90deg, #0f172a, #475569)',
          borderRadius: '0 2px 2px 0',
          zIndex:     '9999',
          transition: 'width 0.1s linear',
        },
      })

      // ── Prose overrides ───────────────────────────────────────────
      addComponents({
        '.prose-light': {
          '--tw-prose-body':          '#334155',
          '--tw-prose-headings':      '#0f172a',
          '--tw-prose-lead':          '#475569',
          '--tw-prose-links':         '#d97706',
          '--tw-prose-bold':          '#0f172a',
          '--tw-prose-counters':      '#64748b',
          '--tw-prose-bullets':       '#94a3b8',
          '--tw-prose-hr':            '#e2e8f0',
          '--tw-prose-quotes':        '#0f172a',
          '--tw-prose-quote-borders': '#fbbf24',
          '--tw-prose-captions':      '#64748b',
          '--tw-prose-code':          '#be185d',
          '--tw-prose-pre-code':      '#e2e8f0',
          '--tw-prose-pre-bg':        '#1e293b',
          '--tw-prose-th-borders':    '#cbd5e1',
          '--tw-prose-td-borders':    '#e2e8f0',
        },
      })
    }),
  ],
}

export default config