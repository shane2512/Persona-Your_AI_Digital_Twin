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
        calm: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      backgroundImage: {
        'gradient-calm': 'linear-gradient(135deg, rgb(14, 165, 233) 0%, rgb(56, 189, 248) 100%)',
        'gradient-calm-dark': 'linear-gradient(135deg, rgb(2, 132, 199) 0%, rgb(14, 165, 233) 100%)',
        'gradient-subtle': 'radial-gradient(circle at center, rgb(255, 255, 255) 0%, rgb(240, 249, 255) 100%)',
        'gradient-dark': 'radial-gradient(circle at center, rgb(7, 89, 133) 0%, rgb(12, 74, 110) 100%)',
      },
      boxShadow: {
        'calm': '0 4px 12px -1px rgba(14, 165, 233, 0.1), 0 2px 6px -1px rgba(14, 165, 233, 0.06)',
        'calm-hover': '0 8px 16px -2px rgba(14, 165, 233, 0.15), 0 3px 8px -2px rgba(14, 165, 233, 0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-calm': 'pulse-calm 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-calm': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .7 },
        },
      },
    },
  },
  plugins: [],
};