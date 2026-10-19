import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          deep: "#123F32",       // Deep Islamic green
          emerald: "#16845B",    // Emerald green
          emeraldLight: "#1ea370",
          emeraldDark: "#0d2b22",
          cream: "#F6F0E4",      // Warm cream
          creamLight: "#FBF9F4",
          gold: "#C5A15A",       // Gold accents
          goldLight: "#D8B876",
          goldDark: "#A6843E",
          sand: "#EDE5D3",
          border: "#E5E1D8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        arabic: ["var(--font-amiri)", "Traditional Arabic", "Scheherazade New", "serif"],
        urdu: ["var(--font-noto-nastaliq)", "Jameel Noori Nastaleeq", "Urdu Typesetting", "Tahoma", "sans-serif"],
      },
      backgroundImage: {
        "islamic-pattern": "radial-gradient(#C5A15A 0.75px, transparent 0.75px), radial-gradient(#C5A15A 0.75px, #123F32 0.75px)",
      },
    },
  },
  plugins: [],
};
export default config;
