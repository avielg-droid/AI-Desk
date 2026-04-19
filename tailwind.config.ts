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
        sans: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Accent — Neon Teal (links, UI elements, active states)
        ore: {
          DEFAULT: '#14B8A6',
          dim: 'rgba(20,184,166,0.1)',
          glow: 'rgba(20,184,166,0.2)',
        },
        // Data values — same teal family
        data: '#14B8A6',
        // CTA — Cyber Amber (Amazon buttons only)
        cta: '#FBBF24',
        win: '#34d399',
        loss: '#f87171',
        ink: {
          0: '#0F172A',
          1: '#1E293B',
          2: '#253347',
          3: '#2D3F57',
        },
        edge: {
          DEFAULT: '#334155',
          hi: '#475569',
        },
      },
      animation: {
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(20,184,166,0.15)' },
          '50%': { boxShadow: '0 0 28px rgba(20,184,166,0.35)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
