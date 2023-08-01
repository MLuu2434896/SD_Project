
import withMT from "@material-tailwind/react/utils/withMT";

/** @type {import('tailwindcss').Config} */

//const withMT = require('@material-tailwind/react/src/utils/withMT');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}

