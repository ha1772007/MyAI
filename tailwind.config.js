/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,php,js}"],
  theme: {
    extend: {
      colors: {
        'dark-1': '#0F0F0F',
        'dark-2': '#000000',
        'light-1': '#F8F8F7',
        'light-2': '#F5F5F0',
      }
    },
  },
  plugins: [],
}