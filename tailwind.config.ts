import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        card: "0 20px 50px -25px rgb(15 23 42 / 0.32)",
      },
    },
  },
  plugins: [],
};

export default config;
