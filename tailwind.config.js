/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // This path tells Tailwind to scan your index.html file
    "./index.html",
    // This path tells Tailwind to scan all React component files in your 'src' folder
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}