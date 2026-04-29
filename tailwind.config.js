/** @type {import('tailwindcss').Config} */
module.exports = {
  // Keep this broad to prevent production purge mismatches (Vercel/Linux).
  // Tailwind scans these files for classnames.
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./actions/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./constants/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          white: "#FFFFFF",
          lavender: "#F8F6FA",
          navy: "#0A1922",
          teal: {
            600: "#1C4E55",
            650: "#215A5E"
          },
          aqua: "#A5E6DF",
          charcoal: "#2D3748"
        }
      },
      fontFamily: {
        serif: ["Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        clinical: "0 18px 55px rgba(10, 25, 34, 0.10)",
        clinicalSm: "0 10px 30px rgba(10, 25, 34, 0.10)"
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: []
};

