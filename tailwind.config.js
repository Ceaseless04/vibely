/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        babyBlue: '#b1d4e0',
        mistyBlue: '#afc1d0',
        navyBlue: '#1c3f60',
        blackCustom: '#0b1320',
      },
    },
  },
  plugins: [],
}
