/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cophetsheni Primary School — Mpumalanga Earth Palette
        // greyed-* aliases preserved for backward compatibility across 130+ files
        greyed: {
          navy: '#0F172A',      // Background — Deep navy-blue
          card: '#1E2937',      // Card Background — Main content panel
          blue: '#67E8F9',      // Accent — Cyan highlight
          black: '#0F172A',     // Dark background alias
          white: '#F1F5F9',     // Main Text — Headings and body
          beige: '#94A3B8',     // Muted Text — Secondary/bullets
          btn: '#CBD5E1',       // Button — Light slate
        },
        // Semantic aliases
        cps: {
          green: '#0F172A',
          greenLight: '#1E2937',
          gold: '#67E8F9',
          goldLight: '#A5F3FC',
          brown: '#0F172A',
          cream: '#F1F5F9',
          sand: '#94A3B8',
          terracotta: '#F87171',
          sky: '#67E8F9',
        },
        sand: {
          50: '#F8FAFC',
          100: '#F1F5F9'
        },
        navy: {
          900: '#020617',
          700: '#0F172A'
        },
        indigoBrand: '#67E8F9',
        mint: '#67E8F9',
        premium: {
          navy: '#0F172A',
          navyLight: '#1E2937',
          navyDark: '#020617',
          slate: '#F1F5F9',
          slateLight: '#ffffff',
          slateDark: '#CBD5E1',
          accent: '#67E8F9',
          accentLight: '#A5F3FC',
          accentHover: '#22D3EE',
          gold: '#67E8F9',
          goldLight: '#A5F3FC',
          emerald: '#34D399',
          emeraldLight: '#6EE7B7',
          rose: '#F87171',
          roseLight: '#FCA5A5',
          amber: '#FBBF24',
          amberLight: '#FCD34D',
          sky: '#67E8F9',
          skyLight: '#A5F3FC',
          neutral: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          }
        }
      },
      fontFamily: {
        display: ['"Inter"', 'sans-serif'],
        headline: ['"Poppins"', 'sans-serif'],
      },
      boxShadow: {
        cloud: '0 1px 0 rgba(17,24,39,.04), 0 8px 24px rgba(17,24,39,.06)',
        cloudHover: '0 2px 0 rgba(17,24,39,.04), 0 16px 40px rgba(17,24,39,.10)',
        premium: '0 1px 3px 0 rgba(0, 0, 0, 0.02), 0 4px 8px -2px rgba(0, 0, 0, 0.05)',
        premiumHover: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.08)',
        premiumLg: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 20px 25px -5px rgba(0, 0, 0, 0.08)',
        glow: '0 0 20px rgba(103, 232, 249, 0.15)',
        glowHover: '0 0 30px rgba(103, 232, 249, 0.25)',
      },
      borderRadius: {
        16: '16px',
        20: '20px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.black'),
            a: {
              color: theme('colors.greyed.blue'),
              '&:hover': {
                color: theme('colors.greyed.navy'),
              },
            },
            h1: {
              color: theme('colors.black'),
            },
            h2: {
              color: theme('colors.black'),
            },
            h3: {
              color: theme('colors.black'),
            },
            strong: {
              color: theme('colors.black'),
            },
            code: {
              color: theme('colors.greyed.navy'),
              backgroundColor: theme('colors.greyed.blue/10'),
              borderRadius: theme('borderRadius.md'),
              padding: `${theme('spacing.1')} ${theme('spacing.1.5')}`,
            },
            blockquote: {
              borderLeftColor: theme('colors.greyed.blue/50'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};