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
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ore: {
          DEFAULT: '#f97316',
          dim: 'rgba(249,115,22,0.1)',
          glow: 'rgba(249,115,22,0.2)',
        },
        data: '#22d3ee',
        win: '#34d399',
        loss: '#f87171',
        ink: {
          0: '#05080d',
          1: '#0b1117',
          2: '#111b27',
          3: '#17243a',
        },
        edge: {
          DEFAULT: '#1a2c3d',
          hi: '#2a4260',
        },
      },
      animation: {
        'shimmer': 'shimmer 2.5s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(249,115,22,0.15)' },
          '50%': { boxShadow: '0 0 28px rgba(249,115,22,0.35)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
