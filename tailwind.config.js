/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        'sans': ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f3f0f9',
          100: '#e9e5f0',
          200: '#d1c7e0',
          300: '#b7aed6',
          400: '#8b7fb1',
          500: '#5d4c8e',
          600: '#4a3a6e',
          700: '#3d2f5a',
          800: '#2d2242',
          900: '#1f1a2e',
        },
      },
    },
  },
  plugins: [],
}
