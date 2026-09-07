/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', "sans-serif"],
        body: ["Satoshi", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        base: {
          DEFAULT: "#050505",
          soft: "#0a0a0c",
          card: "#0e0e11",
          line: "rgba(255,255,255,0.08)",
        },
        silver: {
          light: "#E9ECF1",
          DEFAULT: "#C9CED6",
          dim: "#9AA1AC",
          dark: "#6E747F",
        },
        accent: {
          DEFAULT: "#8B5CF6",
          soft: "#A78BFA",
          pink: "#EC4899",
          amber: "#F59E0B",
        },
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
        "metallic": "linear-gradient(180deg, #ffffff 0%, #dfe3ea 42%, #8f96a3 100%)",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(139,92,246,0.45)",
        dock: "0 20px 60px -20px rgba(0,0,0,0.7)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-bar": {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "fade-up": {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        marquee: "marquee 12s linear infinite",
        "pulse-bar": "pulse-bar 1s ease-in-out infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "fade-up": "fade-up 0.5s ease forwards",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};
