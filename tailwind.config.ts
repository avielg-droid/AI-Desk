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
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans:    ['var(--font-display)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Primary accent — Electric Cyan
        ore: {
          DEFAULT: '#00E5FF',
          dim:     'rgba(0,229,255,0.08)',
          glow:    'rgba(0,229,255,0.25)',
        },
        // Secondary accent — Violet
        data: '#A855F7',
        cta:  '#00E5FF',
        // Semantic — neon green / hot red
        win:  '#00E599',
        loss: '#FF4466',
        // Surface stack — The Void
        ink: {
          0: '#09090B',   // absolute void
          1: '#0F0F12',   // glass surface base
          2: '#141418',   // hover
          3: '#1A1A20',   // subtle dividers
        },
        // Borders — barely-there dark
        edge: {
          DEFAULT: '#1E1E26',
          hi:      '#2E2E3C',
        },
      },
      boxShadow: {
        'aurora-sm':  '0 0 12px rgba(0,229,255,0.15), 0 0 30px rgba(138,43,226,0.08)',
        'aurora-md':  '0 0 20px rgba(0,229,255,0.20), 0 0 50px rgba(138,43,226,0.12)',
        'aurora-lg':  '0 0 40px rgba(0,229,255,0.25), 0 0 80px rgba(138,43,226,0.15), 0 0 120px rgba(255,0,255,0.08)',
        'win-glow':   '0 0 20px rgba(0,229,153,0.20), 0 0 50px rgba(0,229,153,0.10)',
      },
    },
  },
  plugins: [],
};
export default config;
