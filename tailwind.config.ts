import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
        colors: {
            TheadColor: "#64748b",
            tableBodyBGColor: colors.white,
        },
    },
    plugins: [require("daisyui"), nextui()],
    daisyui: {
        themes: ["light", "dark", "cupcake", "emerald"],
    },
    darkMode: "class",
};
export default config;
