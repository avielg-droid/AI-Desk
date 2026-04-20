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
        // Accent — ember orange
        ore: {
          DEFAULT: '#E05C1A',
          dim:     'rgba(224,92,26,0.08)',
          glow:    'rgba(224,92,26,0.15)',
        },
        data: '#E05C1A',
        cta:  '#E05C1A',
        // Semantic
        win:  '#16a34a',
        loss: '#dc2626',
        // Surface stack — warm paper (light theme)
        ink: {
          0: '#F7F4EF',  // warm parchment — main background
          1: '#FFFFFF',  // white — cards, elevated surfaces
          2: '#F0EDE8',  // warm off-white — hover states
          3: '#E8E3DC',  // warm light gray — subtle dividers
        },
        // Borders — warm taupe
        edge: {
          DEFAULT: '#D4CEC6',
          hi:      '#A8A09A',
        },
      },
    },
  },
  plugins: [],
};
export default config;
