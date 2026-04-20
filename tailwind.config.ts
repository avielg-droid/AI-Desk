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
        display: ['var(--font-display)', 'sans-serif'],
        sans:    ['var(--font-body)',    'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Primary accent — deep ember orange
        ore: {
          DEFAULT: '#E05C1A',
          dim:     'rgba(224,92,26,0.10)',
          glow:    'rgba(224,92,26,0.18)',
        },
        data: '#E05C1A',
        // CTA — same ember (unified, no second color family)
        cta: '#E05C1A',
        // Semantic
        win:  '#5DBB63',
        loss: '#D94F3D',
        // Surface stack — warm dark
        ink: {
          0: '#131110',
          1: '#1C1713',
          2: '#252018',
          3: '#2F291F',
        },
        // Borders — warm taupe
        edge: {
          DEFAULT: '#3D342A',
          hi:      '#514439',
        },
      },
    },
  },
  plugins: [],
};
export default config;
