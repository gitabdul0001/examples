/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./src/client/**/*.{js,jsx,ts,tsx}",
      "./node_modules/@modelence/auth-ui/dist/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#5509D9',
            50: '#E8D5FF',
            100: '#D9BFFF',
            200: '#BB94FF',
            300: '#9D69FF',
            400: '#7F3EFF',
            500: '#5509D9',
            600: '#4507B3',
            700: '#35058D',
            800: '#250367',
            900: '#150141',
          }
        }
      },
    },
    plugins: [],
}