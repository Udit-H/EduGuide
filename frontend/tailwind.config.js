/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors for a dark theme (can be swapped for a light theme by changing bg to a light color)
        'background': '#121212', // Very dark gray
        'surface': '#1E1E1E',    // Slightly lighter dark gray for cards/containers
        'text-base': '#E0E0E0',  // Light gray text for readability
        'text-muted': '#A0A0A0', // Muted gray text for secondary information
        
        // Primary brand color: A vibrant teal/cyan for CTAs, links, and active elements
        'primary': '#06B6D4', // Tailwind's cyan-500
        'primary-dark': '#0891B2', // Tailwind's cyan-600
        
        // Success/Completion color
        'success': '#10B981', // Tailwind's emerald-500
      },
      fontFamily: {
        // Use a modern, clean sans-serif font stack
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['Fira Code', 'ui-monospace', 'SFMono-Regular'],
      },
      boxShadow: {
        // Custom shadow for lifted, professional cards
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}