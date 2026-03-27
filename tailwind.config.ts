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
          DEFAULT: "#006DB2",
          dark: "#005490",
          light: "#0088DC",
          subtle: "#E6F3FA",
        },
        accent: {
          DEFAULT: "#00A3E0",
          dark: "#0082B3",
          subtle: "#E0F4FF",
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
        focus: "0 0 0 3px rgba(0, 109, 178, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
