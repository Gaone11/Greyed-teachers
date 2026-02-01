/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        greyed: {
          navy: '#212754',
          blue: '#bbd7eb',
          black: '#292828',
          white: '#efeae4',
          beige: '#dedbc2',
        },
        sand: {
          50: '#F9FAFB',
          100: '#F3F6F8'
        },
        navy: {
          900: '#0F1C2C',
          700: '#19324A'
        },
        indigoBrand: '#3F51B5',
        mint: '#1EB6B8',
        premium: {
          navy: '#1a2332',
          navyLight: '#2a3752',
          navyDark: '#0f1419',
          slate: '#f8f9fb',
          slateLight: '#ffffff',
          slateDark: '#e8eaf0',
          accent: '#4f6bff',
          accentLight: '#7a8fff',
          accentHover: '#3d56e0',
          gold: '#f59e0b',
          goldLight: '#fbbf24',
          emerald: '#10b981',
          emeraldLight: '#34d399',
          rose: '#f43f5e',
          roseLight: '#fb7185',
          amber: '#f59e0b',
          amberLight: '#fbbf24',
          sky: '#0ea5e9',
          skyLight: '#38bdf8',
          neutral: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#e5e5e5',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
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
        glow: '0 0 20px rgba(79, 107, 255, 0.15)',
        glowHover: '0 0 30px rgba(79, 107, 255, 0.25)',
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