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
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#262626',
          800: '#171717',
          900: '#111111',
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
        'gradient-calm-dark': 'linear-gradient(135deg, rgb(56, 189, 248) 0%, rgb(125, 211, 252) 100%)',
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out infinite -4s',
        'pulse-calm': 'pulse-calm 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        'pulse-calm': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .7 },
        },
      },
      boxShadow: {
        'glow-calm': '0 0 40px -10px rgba(56, 189, 248, 0.4)',
        'glow-calm-lg': '0 0 60px -15px rgba(56, 189, 248, 0.5)',
      },
    },
  },
  plugins: [],
};