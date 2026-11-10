import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-pale-grey": "#f5f5f5",
        "brand-off-black": "#111111",
      },
    },
  },
  plugins: [],
};
export default config;
