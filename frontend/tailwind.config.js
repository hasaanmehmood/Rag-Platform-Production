/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0f4',
          100: '#cce1e9',
          200: '#99c3d3',
          300: '#66a5bd',
          400: '#3387a7',
          500: '#1D546D',
          600: '#174357',
          700: '#113241',
          800: '#0b212b',
          900: '#061E29',
        },
        dark: {
          50: '#061E29',
          100: '#0a2532',
          200: '#0e2c3b',
          300: '#123344',
          400: '#163a4d',
          500: '#1D546D',
          600: '#2a6a8a',
          700: '#3780a7',
          800: '#5F9598',
          900: '#F3F4F4',
        },
        accent: {
          teal: '#5F9598',
          lightTeal: '#87b5b8',
          darkBlue: '#1D546D',
          light: '#F3F4F4',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(14, 165, 233, 0.5), 0 0 10px rgba(14, 165, 233, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.8), 0 0 30px rgba(14, 165, 233, 0.5)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}