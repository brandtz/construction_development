/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary greens (forest)
        forest: {
          50: '#f0f7f4',
          100: '#d9ebe2',
          200: '#b5d9c7',
          300: '#89c0a5',
          400: '#5da382',
          500: '#2D5A27', // Primary brand green
          600: '#2a5024',
          700: '#25431f',
          800: '#1f361a',
          900: '#1a2c15',
        },
        // Warm neutrals (sand)
        sand: {
          50: '#fdfbf7',
          100: '#FAF6F1', // Primary background
          200: '#f0e8db',
          300: '#e3d5c1',
          400: '#d4bfa3',
          500: '#c4a985',
          600: '#b08f64',
          700: '#967649',
          800: '#785e3a',
          900: '#5a472c',
        },
        // Accent (terracotta)
        terracotta: {
          50: '#fdf4f3',
          100: '#fce8e6',
          200: '#f9d5d0',
          300: '#f4b6ad',
          400: '#ec8c7c',
          500: '#C45D3E', // Primary accent
          600: '#b04832',
          700: '#943a28',
          800: '#7a3224',
          900: '#672e23',
        },
        // Charcoal
        charcoal: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#333333', // Primary text
          600: '#2a2a2a',
          700: '#242424',
          800: '#1f1f1f',
          900: '#141414',
        },
      },
      fontFamily: {
        heading: ['Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
