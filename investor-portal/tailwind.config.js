/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f1',
          100: '#d9ead9',
          200: '#b3d5b3',
          300: '#8cbf8c',
          400: '#66a866',
          500: '#2C5F2D',
          600: '#244d24',
          700: '#1c3b1c',
          800: '#142914',
          900: '#0c170c',
        },
        sand: {
          50: '#FDFCFA',
          100: '#F7F4EF',
          200: '#EDE8DF',
          300: '#E0D7C9',
          400: '#C9BBAA',
          500: '#B5A48E',
        },
        terracotta: {
          500: '#B85042',
          600: '#9a4238',
        },
      },
      fontFamily: {
        heading: ['Georgia', 'Cambria', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
