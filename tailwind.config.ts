import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Playfair Display — editorial serif, 900 weight for hero headlines
        display: ['var(--font-display)', 'Georgia', 'serif'],
        // Source Serif 4 — body text, UI prose, reviews
        sans:    ['var(--font-body)',    'Georgia', 'serif'],
        // JetBrains Mono — specs, labels, stats, badges
        mono:    ['var(--font-mono)',    'monospace'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Accent — ember orange (high contrast on zinc-black)
        ore: {
          DEFAULT: '#E05C1A',
          dim:     'rgba(224,92,26,0.10)',
          glow:    'rgba(224,92,26,0.18)',
        },
        data: '#E05C1A',
        cta:  '#E05C1A',
        // Semantic
        win:  '#4ADE80',
        loss: '#F87171',
        // Surface stack — OLED zinc-black
        ink: {
          0: '#0D0D0F',
          1: '#18181B',
          2: '#1F1F23',
          3: '#27272A',
        },
        // Borders — zinc
        edge: {
          DEFAULT: '#3F3F46',
          hi:      '#52525B',
        },
      },
    },
  },
  plugins: [],
};
export default config;
