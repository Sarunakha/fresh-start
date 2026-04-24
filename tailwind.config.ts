import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Ocean / Deep Sea theme tokens
        ocean: {
          navy: "#0F172A",
          slate: "#1E293B",
          mint: "#99F6E4"
        },
        slateNavy: "#1A2836",
        mutedTeal: "#365B5E"
      }
    }
  },
  plugins: []
} satisfies Config;

