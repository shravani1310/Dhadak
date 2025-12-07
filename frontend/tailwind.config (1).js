/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#030712',
        foreground: '#F9FAFB',
        primary: '#F43F5E',
        'primary-foreground': '#FFFFFF',
        secondary: '#6366F1',
        'secondary-foreground': '#FFFFFF',
        accent: '#10B981',
        'accent-foreground': '#000000',
        muted: '#1F2937',
        'muted-foreground': '#9CA3AF',
        border: '#374151',
        card: '#111827',
        'card-foreground': '#F9FAFB',
      },
      fontFamily: {
        heading: ['Unbounded', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        accent: ['Rock Salt', 'cursive'],
      },
    },
  },
  plugins: [],
}
