/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // mOOtify brand colors
        mint: {
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6e0',
          300: '#5fe9ce',
          400: '#58d6a8', // Primary brand color
          500: '#2dd4bf',
          600: '#14b8a6',
          700: '#0f9488',
          800: '#115e59',
          900: '#134e4a',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#b69cf4', // Secondary brand color
          500: '#a78bfa',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        cream: {
          DEFAULT: '#FAF9F6',
          50: '#ffffff',
          100: '#FAF9F6',
          200: '#f5f3ed',
          300: '#efeee6',
        },
        anthracite: {
          DEFAULT: '#2E2E2E',
          light: '#3a3a3a',
          dark: '#1a1a1a',
        },
        // Theme variants
        'kids-boy': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        'kids-girl': {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        },
      },
      fontFamily: {
        sans: ['Rubik', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
        fun: ['Baloo 2', 'cursive'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'spring': 'spring 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce-soft': 'bounce-soft 0.5s ease-in-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'scale-up': 'scale-up 0.3s ease-out',
        'blink': 'blink 3s ease-in-out infinite',
      },
      keyframes: {
        spring: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '60%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        blink: {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.1)' },
        },
      },
    },
  },
  plugins: [],
};


