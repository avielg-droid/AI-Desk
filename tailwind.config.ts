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
        // Outfit — geometric sans for headings
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        // DM Sans — body text, reviews, UI prose
        sans:    ['var(--font-body)',    'system-ui', 'sans-serif'],
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
        // Surface stack — clean white
        ink: {
          0: '#FFFFFF',  // white — main background
          1: '#F8F8F8',  // off-white — cards
          2: '#F0F0F0',  // light gray — hover states
          3: '#E4E4E4',  // gray — subtle dividers
        },
        // Borders — neutral gray
        edge: {
          DEFAULT: '#E2E2E2',
          hi:      '#BEBEBE',
        },
      },
    },
  },
  plugins: [],
};
export default config;
