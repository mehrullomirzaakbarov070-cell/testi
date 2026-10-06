/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2b0a5c',
        accent: '#ff9f43',
        panel: '#f3f4f6',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(43, 10, 92, 0.12)',
      },
    },
  },
  plugins: [],
};
