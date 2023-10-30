/*eslint-env node*/
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#488CAC",
        secondary: "#E9DBD2",
        third: "#d2e4e9",
        fourth: "#FFFFF7",
        fifth: "#93a0a3",
        sixth: "#8798AD",
        bgprimary: "#f8f7f7",
        bgsecondary: "#ffff",
        dbgprimary: "#252E42",
        dbgsecondary: "#2F3B52",
      },
    },
  },
  plugins: [],
};
