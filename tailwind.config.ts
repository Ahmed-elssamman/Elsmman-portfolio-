import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Enterprise minimal-futuristic palette
        bg: {
          DEFAULT: "#05060A",
          elev: "#0A0C12",
          panel: "#0E1118",
        },
        ink: {
          DEFAULT: "#E6E8EE",
          mute: "#8A92A6",
          dim: "#5A6075",
        },
        edge: {
          DEFAULT: "#1A1F2C",
          strong: "#262C3B",
        },
        accent: {
          // Cool, architectural cyan-blue — restrained, not neon
          DEFAULT: "#7AB6FF",
          glow: "#9FD0FF",
          deep: "#3D7BD1",
        },
        signal: {
          // For data-flow accents
          DEFAULT: "#5EE7C3",
          warm: "#FFB37A",
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
        "scan-line": "scan-line 8s linear infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        "fade-in": "fade-in 1s ease-out forwards",
        "blink": "blink 1.2s steps(1) infinite",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.9" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "blink": {
          "0%, 50%": { opacity: "1" },
          "50.01%, 100%": { opacity: "0" },
        },
      },
      backgroundImage: {
        "grid-fine":
          "linear-gradient(rgba(122,182,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(122,182,255,0.05) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse at center, rgba(122,182,255,0.15) 0%, transparent 60%)",
      },
      backgroundSize: {
        "grid-fine": "48px 48px",
      },
    },
  },
  plugins: [],
};

export default config;
