/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1A2E',        // Deep Navy / Charcoal
        secondary: '#222222',      // Charcoal
        accent: '#6B3FA0',         // Warm Purple
        cta: '#E97451',            // Warm Orange
        border: '#CCCCCC',         // Neutral Gray
        bg: '#FFFFFF',             // Clean White
      },
      backgroundColor: {
        primary: '#1A1A2E',
        accent: '#6B3FA0',
        cta: '#E97451',
        bg: '#FFFFFF',
      },
      textColor: {
        primary: '#1A1A2E',
        secondary: '#222222',
        accent: '#6B3FA0',
        muted: '#666666',
      },
      borderColor: {
        primary: '#CCCCCC',
        dark: '#1A1A2E',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        worldpulse: {
          "primary": "#6B3FA0",
          "primary-focus": "#5c2f8c",
          "primary-content": "#ffffff",
          "secondary": "#1A1A2E",
          "secondary-focus": "#0f0f1a",
          "secondary-content": "#ffffff",
          "accent": "#E97451",
          "accent-focus": "#d45f3d",
          "accent-content": "#ffffff",
          "neutral": "#CCCCCC",
          "neutral-focus": "#a8a8a8",
          "neutral-content": "#1A1A2E",
          "base-100": "#FFFFFF",
          "base-200": "#f7f7f7",
          "base-300": "#efefef",
          "base-content": "#1A1A2E",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
}
