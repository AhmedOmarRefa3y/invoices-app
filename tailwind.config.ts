import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  plugins: [],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      TheadColor: "#64748b",
      tableBodyBGColor: colors.white,
    },
  },
  darkMode: "class",
};
export default config;
