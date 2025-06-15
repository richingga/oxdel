/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: "#3b82f6",      // warna biru utama
          dark: "#2563eb",         // biru lebih gelap
        },
        secondary: "#172b4d",      // abu gelap
        accent: "#f59e42",         // oranye aksen
        "neutral-dark": "#444e5e", // teks abu gelap
        "neutral-light": "#f5f8fb",// background soft
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.13)',
        card: '0 4px 24px rgba(0,0,0,0.09)',
      },
      borderRadius: {
        '2xl': '1rem',
        'full': '9999px',
      },
      animation: {
        aurora: 'aurora 12s ease-in-out infinite alternate',
      },
      keyframes: {
        aurora: {
          '0%': { transform: 'translateY(0px) translateX(0px)' },
          '100%': { transform: 'translateY(-40px) translateX(20px)' },
        },
      },
    },
  },
  plugins: [],
};
