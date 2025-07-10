// tailwind.config.cjs
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        foreground: "#333333",  // Add custom foreground color here
      },
    },
  },
  plugins: [],
};

export default config;
