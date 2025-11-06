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
          50: '#e6faf1',
          100: '#ccf5e3',
          200: '#99ebc7',
          300: '#66e1ab',
          400: '#33d78f',
          500: '#00bf63', // Main brand color
          600: '#00a655',
          700: '#008c47',
          800: '#007339',
          900: '#005a2b',
        },
        brand: '#00bf63',
      },
    },
  },
  plugins: [],
}
