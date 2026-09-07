/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0D0D0D',
        secondary: '#111111',
        surface: '#171717',
        gold: '#D4AF37',
        champagne: '#E8D7A8',
        muted: '#9A9A9A',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Manrope', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
