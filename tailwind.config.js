/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cophetsheni Primary School — Mpumalanga Earth Palette
        // greyed-* aliases preserved for backward compatibility across 130+ files
        greyed: {
          navy: '#1B4332',      // Deep Forest Green (was navy #212754)
          blue: '#D4A843',      // African Gold / Sunrise (was blue #bbd7eb)
          black: '#2D1B0E',     // Rich Earth Brown (was black #292828)
          white: '#FDF6EC',     // Warm Cream / Ivory (was white #efeae4)
          beige: '#E8D5B7',     // Sandy Bushveld (was beige #dedbc2)
        },
        // Semantic aliases for the new brand
        cps: {
          green: '#1B4332',       // Primary — Deep Mpumalanga Forest
          greenLight: '#2D6A4F',  // Lighter forest
          gold: '#D4A843',        // Accent — African Sunrise Gold
          goldLight: '#E8C96A',   // Lighter gold
          brown: '#2D1B0E',       // Text — Rich Earth
          cream: '#FDF6EC',       // Background — Warm Ivory
          sand: '#E8D5B7',        // Secondary bg — Bushveld Sand
          terracotta: '#C4572A',  // Alert / Warm Accent
          sky: '#2D6A4F',         // Info / Links (was blue #5B9BD5)
        },
        sand: {
          50: '#FEFCF8',
          100: '#FDF6EC'
        },
        navy: {
          900: '#0B2B1A',
          700: '#1B4332'
        },
        indigoBrand: '#2D6A4F',
        mint: '#52B788',
        premium: {
          navy: '#1B4332',
          navyLight: '#2D6A4F',
          navyDark: '#0B2B1A',
          slate: '#FDF6EC',
          slateLight: '#ffffff',
          slateDark: '#E8D5B7',
          accent: '#D4A843',
          accentLight: '#E8C96A',
          accentHover: '#B8922F',
          gold: '#D4A843',
          goldLight: '#E8C96A',
          emerald: '#52B788',
          emeraldLight: '#74C69D',
          rose: '#C4572A',
          roseLight: '#D97750',
          amber: '#D4A843',
          amberLight: '#E8C96A',
          sky: '#2D6A4F',
          skyLight: '#52B788',
          neutral: {
            50: '#FEFCF8',
            100: '#FDF6EC',
            200: '#E8D5B7',
            300: '#D4C4A8',
            400: '#A89070',
            500: '#7A6548',
            600: '#5C4A33',
            700: '#3D2E1C',
            800: '#2D1B0E',
            900: '#1A0F06',
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
        glow: '0 0 20px rgba(212, 168, 67, 0.15)',
        glowHover: '0 0 30px rgba(212, 168, 67, 0.25)',
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