/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#fff4ea', 100: '#ffe9d6', 500: '#f97316', 600: '#d94a0b', 700: '#b83d08' },
        cream: '#faf5ee',
        sand: '#f4ece2',
        line: '#e8dccf',
        ink: '#241b15',
        mute: '#76675b',
        ok: { DEFAULT: '#15803d', soft: '#dcf2e3' },
        warn: { DEFAULT: '#a16207', soft: '#fdf0c9' },
        bad: '#b91c1c',
      },
      fontFamily: {
        body: ['Inter', 'system-ui', 'sans-serif'],
        head: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px rgba(60,30,10,.10)',
      },
    },
  },
  plugins: [],
}
