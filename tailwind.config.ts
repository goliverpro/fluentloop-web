import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          dark: "#3730A3",
          light: "#818CF8",
          subtle: "#EEF2FF",
        },
        accent: {
          DEFAULT: "#06B6D4",
          dark: "#0891B2",
          subtle: "#ECFEFF",
        },
        success: {
          DEFAULT: "#10B981",
          subtle: "#D1FAE5",
        },
        error: {
          DEFAULT: "#EF4444",
          subtle: "#FEE2E2",
        },
        warning: {
          DEFAULT: "#F59E0B",
          subtle: "#FEF3C7",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        focus: "0 0 0 3px rgba(79, 70, 229, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
