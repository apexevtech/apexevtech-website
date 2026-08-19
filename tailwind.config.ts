import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        apex: {
          blue: "#0B5ED7",
          dark: "#1E293B",
          accent: "#00A3FF",
        },
      },
      boxShadow: {
        industrial: "0 24px 70px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
