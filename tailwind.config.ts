import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0b2e4f",
          dark: "#082237",
        },
        blue: {
          DEFAULT: "#1c6ea4",
          light: "#e7f1f8",
        },
        border: "#c9d6e0",
        muted: "#5c7285",
        ok: "#2e7d4f",
        warn: "#b8860b",
        danger: "#b3261e",
      },
      fontFamily: {
        sans: ["Segoe UI", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
