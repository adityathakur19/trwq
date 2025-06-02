// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Extend keyframes
      keyframes: {
        roll: {
          '0%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(-200%)' },
          '75%': { transform: 'translateY(-300%)' },
          '100%': { transform: 'translateY(0)' }
        },
        fadeIn: {
          'from': { 
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          'to': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          }
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0)'
          },
          '50%': { 
            transform: 'translateY(-20px)'
          }
        },
        pulse: {
          '0%, 100%': { 
            opacity: 1,
            transform: 'scale(1)'
          },
          '50%': { 
            opacity: 0.8,
            transform: 'scale(1.05)'
          }
        }
      },
      // Extend animation
      animation: {
        'roll': 'roll 20s infinite',
        'fade-in': 'fadeIn 1s ease-in',
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite'
      },
      // Scrollbar customization
      scrollbar: {
        thin: {
          thumb: 'scrollbar-thumb-w-2',
          track: 'scrollbar-track-w-2',
        },
        wide: {
          thumb: 'scrollbar-thumb-w-6',
          track: 'scrollbar-track-w-6',
        },
      },
      // Custom colors
      colors: {
        scrollbarThumbDark: '#4a5568',
        scrollbarThumbLight: '#d4d4d8',
        scrollbarTrackDark: '#2d3748',
        scrollbarTrackLight: '#edf2f7',
        primary: {
          50: '#fef3c7',
          100: '#fde68a',
          200: '#fcd34d',
          300: '#fbbf24',
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#63300d',
        },
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        }
      },
      // Add transition durations
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
        '4000': '4000ms',
      },
      // Add backdrop blur values
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};