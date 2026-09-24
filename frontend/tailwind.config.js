/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kisan: {
          50: '#F4F9F4',
          100: '#E6F2E6',
          200: '#C8E4C8',
          300: '#9BCE9B',
          400: '#64B264',
          500: '#2E7D32', // Leaf natural green
          600: '#236B27',
          700: '#1B5620',
          800: '#17451B',
          900: '#113314',
          dark: '#0D240F',
          earth: '#3E5C46',
          cream: '#FAF7F0',
          creamLight: '#FCFAF5',
          amber: '#E89218',
          gold: '#F59E0B',
          sand: '#EADBCA'
        }
      },
      borderRadius: {
        '2xl': '1.25rem', // 20px
        '3xl': '1.5rem',  // 24px
        '4xl': '2rem',    // 32px
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(27, 86, 32, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(27, 86, 32, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
        'token': '0 12px 36px -6px rgba(46, 125, 50, 0.2), 0 4px 12px -2px rgba(0, 0, 0, 0.06)'
      }
    },
  },
  plugins: [],
}
