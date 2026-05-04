import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        santos: {
          navy: "#062B55",
          cyan: "#00C8E8",
          silver: "#C9CED6",
          ice: "#F7FAFC",
          dark: "#031A33",
          success: "#16A34A",
          warning: "#F59E0B",
          danger: "#DC2626",
        },
      },
    },
  },
  plugins: [],
};

export default config;