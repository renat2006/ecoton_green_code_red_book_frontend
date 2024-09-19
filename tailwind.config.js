/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2e9',
          100: '#cce5d3',
          200: '#99cbb6',
          300: '#66b198',
          400: '#33977b',
          500: '#288049',
          600: '#226d3c',
          700: '#1b5930',
          800: '#144623',
          900: '#0e3217',
        },
      },
      fontFamily: {
        jost: ['Jost', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
