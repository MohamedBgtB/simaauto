import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        sima: {
          gold: "#D4A017",
          goldHover: "#B8860B",
          dark: "#121212",
          card: "#1E1E1E",
        },
      },
    },
  },
  plugins: [],
};
export default config;
