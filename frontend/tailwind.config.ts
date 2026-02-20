import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0efff",
          100: "#e0dfff",
          200: "#c1bfff",
          300: "#a29fff",
          400: "#837fff",
          500: "#6358DC",
          600: "#6358DC",
          700: "#5046b0",
          800: "#3d3584",
          900: "#2a2358",
        },
      },
    },
  },
  plugins: [],
};
export default config;
