/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        'tablet': '900px',
        'desktop': '1200px',
      },
      colors: {
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      brown: {
        DEFAULT: '#7a5230',
        dark: '#500f0f',
      },
      beige: '#fdf6f3',
      primary: {
        DEFAULT: '#0066CC',
        light: '#60A5FA',
        dark: '#1E3A8A',
      },
      secondary: {
        DEFAULT: '#FFD700',
        light: '#FCD34D',
        dark: '#B45309',
      },
      background: {
        DEFAULT: '#FFFFFF',
        light: '#FFFFFF',
        dark: '#FFFFFF',
      },
      text: {
        DEFAULT: '#111827',
        light: '#6B7280',
        dark: '#F3F4F6',
      },
    },
    fontFamily: {
      he: ['Heebo', 'Assistant', 'sans-serif'],
      en: ['Inter', 'Open Sans', 'sans-serif'],
    },
    animation: {
      'fadeIn': 'fadeIn 0.5s ease-in-out',
      'fadeInSlow': 'fadeIn 1s ease-in-out',
      'fadeInFast': 'fadeIn 0.3s ease-in-out',
      'slideUp': 'slideUp 0.5s ease-out',
      'slideUpSlow': 'slideUp 0.8s ease-out',
      'slideUpFast': 'slideUp 0.3s ease-out',
      'slideDown': 'slideDown 0.5s ease-out',
      'slideLeft': 'slideLeft 0.5s ease-out',
      'slideRight': 'slideRight 0.5s ease-out',
      'bounce': 'bounce 1s infinite',
      'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      'spin': 'spin 1s linear infinite',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      slideUp: {
        '0%': {
          opacity: '0',
          transform: 'translateY(20px)'
        },
        '100%': {
          opacity: '1',
          transform: 'translateY(0)'
        },
      },
      slideDown: {
        '0%': {
          opacity: '0',
          transform: 'translateY(-20px)'
        },
        '100%': {
          opacity: '1',
          transform: 'translateY(0)'
        },
      },
      slideLeft: {
        '0%': {
          opacity: '0',
          transform: 'translateX(20px)'
        },
        '100%': {
          opacity: '1',
          transform: 'translateX(0)'
        },
      },
      slideRight: {
        '0%': {
          opacity: '0',
          transform: 'translateX(-20px)'
        },
        '100%': {
          opacity: '1',
          transform: 'translateX(0)'
        },
      },
    },
  },
},
  plugins: [require('@tailwindcss/typography')],
}
