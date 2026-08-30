/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand navy — #00264d is the 700 step (the brand color)
        primary: {
          50: "#eaf1f8",
          100: "#cbdcee",
          200: "#9bb9d9",
          300: "#6a95c4",
          400: "#3d72ac",
          500: "#1e5290",
          600: "#0a3d73",
          700: "#00264d", // brand
          800: "#001d3b",
          900: "#00152b",
          950: "#000d1c",
        },
        // Gold accent for premium highlights
        gold: {
          300: "#fcd34d",
          400: "#f7b733",
          500: "#f5a623",
          600: "#e08e00",
          700: "#b45309",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(0, 38, 77, 0.18)",
        "card-hover": "0 24px 50px -12px rgba(0, 38, 77, 0.28)",
        glow: "0 0 20px 2px rgba(245, 166, 35, 0.35)",
        "glow-navy": "0 0 25px 3px rgba(30, 82, 144, 0.4)",
        "glow-emerald": "0 0 20px 2px rgba(16, 185, 129, 0.3)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(1200px 600px at 20% 0%, rgba(30,82,144,0.45), transparent 70%)",
        "radial-glow":
          "radial-gradient(circle, rgba(245, 166, 35, 0.15) 0%, transparent 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-slow": {
          "0%,100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(1deg)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};
