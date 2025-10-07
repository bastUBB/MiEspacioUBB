/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ubb-blue': '#0c549c',
        'ubb-light-blue': '#b4ecff',
        'ubb-orange': '#FBB13C',
        'ubb-dark-blue': '#115397'
      }
    },
  },
  plugins: [],
}