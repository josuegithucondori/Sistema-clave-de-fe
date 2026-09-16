/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f0fe',
          100: '#c5d9fc',
          200: '#9ebef9',
          300: '#74a2f6',
          400: '#548df4',
          500: '#1a5276',
          600: '#15456a',
          700: '#0e2f44',
          800: '#0a2333',
          900: '#061722',
        },
        accent: {
          50: '#fff9e6',
          100: '#ffefbf',
          200: '#ffe599',
          300: '#ffdb73',
          400: '#ffd14d',
          500: '#f39c12',
          600: '#e08e0b',
          700: '#c07a08',
          800: '#9a6206',
          900: '#734a04',
        },
      },
    },
  },
  plugins: [],
}
