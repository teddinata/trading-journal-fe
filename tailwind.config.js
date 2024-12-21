/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4F46E5',
        'success': '#22C55E',
        'danger': '#EF4444',
        'warning': '#F59E0B',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}