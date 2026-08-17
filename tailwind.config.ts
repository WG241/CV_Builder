import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Restrained, institutional Workforce palette.
        ink: {
          DEFAULT: "#0f1b2d", // deep navy — primary text / brand
          soft: "#33415c",
          muted: "#5b6b83",
        },
        brand: {
          DEFAULT: "#0a2540", // Workforce deep navy
          accent: "#b8860b", // restrained gold accent
          light: "#eef2f7",
        },
        line: "#e2e8f0",
        canvas: "#f7f9fc",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      maxWidth: {
        content: "72rem",
        prose: "42rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(15,27,45,0.06), 0 8px 24px rgba(15,27,45,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
