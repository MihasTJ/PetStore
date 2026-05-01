import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF7F2",
        "card-warm": "#FDFBF7",
        "warm-island": "#F0E8DC",
        "tech-island": "#EDE7DD",

        terracotta: {
          DEFAULT: "#B8654A",
          hover: "#9F5239",
        },
        moss: "#3D4F3D",

        ink: {
          DEFAULT: "#2A2A28",
          muted: "#6B6862",
          subtle: "#A19D95",
        },

        "border-warm": "#E8E2D6",
        "error-warm": "#B53D2E",

        tag: {
          joints: "#A87B5C",
          coat: "#7A6E5A",
          weight: "#5C7A6B",
          teeth: "#8B7355",
          heart: "#9C5447",
          gut: "#9C8458",
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: "24px",
        "card-sm": "20px",
        button: "12px",
        field: "8px",
        tag: "8px",
      },
      boxShadow: {
        warm: "0 4px 20px 0 rgba(184, 101, 74, 0.06)",
        "warm-md": "0 6px 28px 0 rgba(184, 101, 74, 0.10)",
        "warm-focus": "0 0 0 3px rgba(184, 101, 74, 0.15)",
      },
      maxWidth: {
        editorial: "960px",
        shell: "1280px",
      },
      lineHeight: {
        editorial: "1.15",
        body: "1.6",
      },
      letterSpacing: {
        eyebrow: "0.08em",
      },
    },
  },
  plugins: [],
};
export default config;
