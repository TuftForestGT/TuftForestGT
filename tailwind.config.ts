import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  "#f0f7f0",
          100: "#d9edd9",
          200: "#b4dab4",
          300: "#83c183",
          400: "#52a552",
          500: "#3a8a3a",
          600: "#2d6e2d",
          700: "#245724",
          800: "#1e461e",
          900: "#193a19",
          950: "#0d200d",
        },
        moss:  "#5c7a4a",
        bark:  "#7a5c3a",
        cream: "#f5f0e8",
        mist:  "#e8ede5",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body:    ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
