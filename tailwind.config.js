/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1A2E',
        secondary: '#222222',
        accent: '#6B3FA0',
        cta: '#E97451',
        border: '#CCCCCC',
        bg: '#FFFFFF',
      },
      fontSize: {
        'base': '22.4px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
  plugins: [],
}
