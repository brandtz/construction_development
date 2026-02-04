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
          50:  '#f0f7f1',
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
          50:  '#FDFCFA',
          100: '#F7F4EF',
          200: '#EDE8DF',
          300: '#E0D7C9',
          400: '#C9BBAA',
          500: '#B5A48E',
          600: '#998A74',
          700: '#7D705C',
          800: '#615644',
          900: '#453C2C',
        },
        terracotta: {
          50:  '#fef6f4',
          100: '#fce8e3',
          200: '#f9d0c7',
          300: '#f4b0a0',
          400: '#ec8a74',
          500: '#B85042',
          600: '#9a4238',
          700: '#7c352d',
          800: '#5e2822',
          900: '#401b17',
        },
        charcoal: {
          50:  '#f6f7f7',
          100: '#e3e5e5',
          200: '#c7cbcc',
          300: '#a9afb0',
          400: '#8b9294',
          500: '#6d7578',
          600: '#565d5f',
          700: '#404546',
          800: '#2A2E2F',
          900: '#1a1d1e',
        },
      },
      fontFamily: {
        heading: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

