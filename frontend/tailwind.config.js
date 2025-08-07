/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0070f3',
        secondary: '#7928ca',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
      }
    },
  },
  plugins: [],
}
