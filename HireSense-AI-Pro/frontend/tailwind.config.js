/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#eef5ff',
          100: '#d9e9ff',
          200: '#bcd6ff',
          300: '#8ebcff',
          400: '#5a97ff',
          500: '#3371ff',
          600: '#1a4fff',
          700: '#133beb',
          800: '#1530be',
          900: '#172d95',
          950: '#111c5a',
        },
        accent: {
          cyan: '#00f5d4',
          violet: '#7c3aed',
          pink: '#ec4899',
          amber: '#f59e0b',
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(51,113,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(51,113,255,0.05) 1px, transparent 1px)",
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(51,113,255,0.3), transparent)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(51,113,255,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(51,113,255,0.7)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
