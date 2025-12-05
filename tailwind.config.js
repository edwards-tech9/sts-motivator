/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // STS Brand Gold Palette
        gold: {
          50: '#FDF9E7',
          100: '#FAF0C8',
          200: '#F5E19A',
          300: '#F0D775',
          400: '#E5C158',
          500: '#D4AF37', // Primary brand gold
          600: '#C9A227',
          700: '#B8962E',
          800: '#8B7355',
          900: '#6B5344',
          950: '#3D2E1F',
        },
        // Premium Black backgrounds
        carbon: {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#d4d4d4',
          300: '#a3a3a3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#262626',
          800: '#1a1a1a',
          900: '#111111',
          950: '#0a0a0a',
        },
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 8px 30px rgba(212, 175, 55, 0.4)',
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.5)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37, #F0D775)',
        'gold-gradient-dark': 'linear-gradient(135deg, #B8962E, #D4AF37)',
        'premium-dark': 'linear-gradient(to bottom, #111111, #0a0a0a, #000000)',
      },
    },
  },
  plugins: [],
}
