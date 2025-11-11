import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0B",
        surface: "#0F0F12",
        primary: {
          50: "#F5FBFF",
          100: "#E6F6FF",
          200: "#BDE7FF",
          300: "#7DD0FF",
          400: "#39B4FF",
          500: "#0FA6FF",
          600: "#0785D4",
          700: "#0669A6",
          800: "#064F7F",
          900: "#083E63"
        },
        accent: "#8B5CF6",
        neon: "#00FFC3"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(15, 166, 255, 0.35)",
      },
      backgroundImage: {
        'grid': "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
} satisfies Config;
