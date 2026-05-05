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
        background: 'var(--bg)',
        foreground: 'var(--fg)',
        // All colors use RGB triplets so Tailwind opacity modifiers work across both themes
        ore:  'rgb(var(--color-ore)  / <alpha-value>)',
        data: 'rgb(var(--color-data) / <alpha-value>)',
        cta:  'rgb(var(--color-ore)  / <alpha-value>)',
        win:  'rgb(var(--color-win)  / <alpha-value>)',
        loss: 'rgb(var(--color-loss) / <alpha-value>)',
        ink: {
          0: 'rgb(var(--color-ink-0) / <alpha-value>)',
          1: 'rgb(var(--color-ink-1) / <alpha-value>)',
          2: 'rgb(var(--color-ink-2) / <alpha-value>)',
          3: 'rgb(var(--color-ink-3) / <alpha-value>)',
        },
        edge: {
          DEFAULT: 'rgb(var(--color-edge)    / <alpha-value>)',
          hi:      'rgb(var(--color-edge-hi) / <alpha-value>)',
        },
      },
      boxShadow: {
        'forge-sm': '0 0 12px rgba(245,158,11,0.15), 0 0 30px rgba(217,119,6,0.06)',
        'forge-md': '0 0 20px rgba(245,158,11,0.20), 0 0 50px rgba(217,119,6,0.10)',
        'forge-lg': '0 0 40px rgba(245,158,11,0.25), 0 0 80px rgba(217,119,6,0.12)',
        'win-glow':  '0 0 20px rgba(0,229,153,0.20), 0 0 50px rgba(0,229,153,0.10)',
        // Keep old names as aliases so existing usages don't break
        'aurora-sm': '0 0 12px rgba(245,158,11,0.15), 0 0 30px rgba(217,119,6,0.06)',
        'aurora-md': '0 0 20px rgba(245,158,11,0.20), 0 0 50px rgba(217,119,6,0.10)',
        'aurora-lg': '0 0 40px rgba(245,158,11,0.25), 0 0 80px rgba(217,119,6,0.12)',
      },
    },
  },
  plugins: [],
};
export default config;
