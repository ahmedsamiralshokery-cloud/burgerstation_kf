import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#1a0c0c",
        card: "#2a1414",
        fg: "#fff4e6",
        muted: "#c9a99a",
        red: "#c1121f",
        gold: "#ffc300",
      },
      fontFamily: {
        sans: ["Tahoma", '"Segoe UI"', "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;