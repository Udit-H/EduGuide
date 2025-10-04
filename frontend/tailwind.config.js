/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Must scan the root index.html
    "./index.html",
    // Must scan all files inside the src folder with these extensions
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    // ... your color palette is here ...
    extend: {
      // ...
    },
  },
  plugins: [],
}