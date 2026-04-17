/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cophetsheni Primary School — Mpumalanga Earth Palette
        // greyed-* aliases preserved for backward compatibility across 130+ files
        greyed: {
          navy: '#212754',      // Primary — Deep brand navy
          card: '#2a2f6e',      // Card Background — Slightly lighter navy
          blue: '#bbd7eb',      // Accent — Brand blue
          black: '#292828',     // Body text — Near black
          white: '#efeae4',     // Background — Warm off-white
          beige: '#dedbc2',     // Secondary — Warm beige
          btn: '#bbd7eb',       // Button — Brand blue
        },
        // Semantic aliases
        cps: {
          green: '#212754',
          greenLight: '#2a2f6e',
          gold: '#bbd7eb',
          goldLight: '#d4e9f5',
          brown: '#292828',
          cream: '#efeae4',
          sand: '#dedbc2',
          terracotta: '#F87171',
          sky: '#bbd7eb',
        },
        sand: {
          50: '#f8f6f0',
          100: '#efeae4'
        },
        navy: {
          900: '#191d4a',
          700: '#212754'
        },
        indigoBrand: '#212754',
        mint: '#bbd7eb',
        premium: {
          navy: '#212754',
          navyLight: '#2a2f6e',
          navyDark: '#191d4a',
          slate: '#efeae4',
          slateLight: '#ffffff',
          slateDark: '#dedbc2',
          accent: '#bbd7eb',
          accentLight: '#d4e9f5',
          accentHover: '#a8ccdf',
          gold: '#bbd7eb',
          goldLight: '#d4e9f5',
          emerald: '#34D399',
          emeraldLight: '#6EE7B7',
          rose: '#F87171',
          roseLight: '#FCA5A5',
          amber: '#FBBF24',
          amberLight: '#FCD34D',
          sky: '#bbd7eb',
          skyLight: '#d4e9f5',
          neutral: {
            50: '#f8f6f0',
            100: '#efeae4',
            200: '#dedbc2',
            300: '#ccc9b0',
            400: '#a8a58c',
            500: '#8a876e',
            600: '#6b6852',
            700: '#504e3c',
            800: '#363427',
            900: '#212754',
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
        glow: '0 0 20px rgba(187, 215, 235, 0.25)',
        glowHover: '0 0 30px rgba(187, 215, 235, 0.40)',
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