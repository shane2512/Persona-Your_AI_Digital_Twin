/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          50: '#ffffff',
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#e5e5e5',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#262626',
          800: '#171717',
          900: '#0a0a0a',
          950: '#050505',
        },
      },
      backgroundImage: {
        'gradient-subtle': 'radial-gradient(circle at center, rgb(255, 255, 255) 0%, rgb(249, 250, 251) 100%)',
        'gradient-dark': 'radial-gradient(circle at center, rgb(23, 23, 23) 0%, rgb(10, 10, 10) 100%)',
      },
      boxShadow: {
        'elegant': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'elegant-hover': '0 2px 4px 0 rgb(0 0 0 / 0.05), 0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      letterSpacing: {
        'tighter': '-0.04em',
      },
    },
  },
  plugins: [],
};