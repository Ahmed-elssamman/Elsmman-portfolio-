import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#070811",
          elev: "#0C0E1A",
          panel: "#10131F",
          deep: "#04050B",
        },
        ink: {
          DEFAULT: "#ECEEF5",
          mute: "#9098AE",
          dim: "#5C637A",
        },
        edge: {
          DEFAULT: "#1C2236",
          strong: "#2A314A",
        },
        accent: {
          DEFAULT: "#7AB6FF",
          glow: "#A9D1FF",
          deep: "#3D7BD1",
        },
        violet: {
          DEFAULT: "#B07BFF",
          glow: "#D2AEFF",
        },
        signal: {
          DEFAULT: "#5EE7C3",
          warm: "#FFB37A",
          hot: "#FF6E9C",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.025em",
      },
      animation: {
        "pulse-slow": "pulse-slow 4s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        "float-med": "float-med 6s ease-in-out infinite",
        "fade-in": "fade-in 0.8s ease-out forwards",
        "blink": "blink 1.2s steps(1) infinite",
        "spin-slow": "spin 24s linear infinite",
        "spin-rev": "spin-rev 18s linear infinite",
        "shimmer": "shimmer 3s linear infinite",
        "aurora": "aurora 14s ease-in-out infinite",
        "rise": "rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.9" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-med": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-6px) translateX(4px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "blink": {
          "0%, 50%": { opacity: "1" },
          "50.01%, 100%": { opacity: "0" },
        },
        "spin-rev": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "aurora": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)", opacity: "0.55" },
          "50%": { transform: "translate3d(2%,-3%,0) scale(1.08)", opacity: "0.85" },
        },
        "rise": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" },
        },
      },
      backgroundImage: {
        "grid-fine":
          "linear-gradient(rgba(122,182,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(122,182,255,0.05) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse at center, rgba(122,182,255,0.18) 0%, transparent 60%)",
        "mesh-1":
          "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(122,182,255,0.18), transparent 65%), radial-gradient(ellipse 55% 45% at 80% 70%, rgba(176,123,255,0.18), transparent 65%), radial-gradient(ellipse 45% 35% at 60% 20%, rgba(94,231,195,0.12), transparent 60%)",
      },
      backgroundSize: {
        "grid-fine": "48px 48px",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(122,182,255,0.12), 0 18px 60px -20px rgba(122,182,255,0.25)",
        "glow-violet":
          "0 0 0 1px rgba(176,123,255,0.18), 0 18px 60px -20px rgba(176,123,255,0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
