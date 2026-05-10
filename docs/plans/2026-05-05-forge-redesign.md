# Forge Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the rainbow aurora (cyan/violet/magenta) design system with a single-accent amber "Forge" theme — warm white light default, near-black dark mode, amber throughout.

**Architecture:** All visual changes live in `globals.css` (color tokens + CSS classes) and `tailwind.config.ts` (shadow tokens). The 33 TSX files using aurora-* class names do NOT need to change — we restyle the classes in place. One inline style in `app/page.tsx:110` needs updating.

**Tech Stack:** Tailwind CSS, CSS custom properties, Next.js 14

---

### Task 1: Update color tokens in globals.css

**Files:**
- Modify: `app/globals.css`

**What to change — Light mode `:root` block:**

Replace the ore token (cyan → amber):
```css
--color-ore:     217 119 6;    /* amber-600 — readable on white */
```

Replace the entire aurora palette section:
```css
/* Forge palette */
--forge-amber:    #D97706;
--forge-gold:     #F59E0B;
--forge-glow:     rgba(217, 119, 6, 0.15);
--forge-gradient: linear-gradient(135deg, #F59E0B 0%, #D97706 60%, #B45309 100%);
--forge-gradient-animated: linear-gradient(135deg, #FBBF24, #F59E0B, #D97706, #FBBF24);
```

Keep `--glass-bg`, `--glass-border`, `--glass-hover-bg` unchanged.

**What to change — Dark mode `[data-theme="dark"]` block:**

Replace ore token:
```css
--color-ore:     245 158 11;   /* amber-400 — brighter on dark */
```

**Step 1: Open `app/globals.css` and make the light mode changes above**

**Step 2: Make the dark mode changes above**

**Step 3: Verify no syntax errors**
```bash
cd /Users/aviel/Desktop/the-ai-desk && npm run build 2>&1 | tail -5
```
Expected: no CSS errors

**Step 4: Commit**
```bash
git add app/globals.css
git commit -m "design(forge): update ore accent from cyan to amber"
```

---

### Task 2: Replace aurora CSS classes with forge styling in globals.css

**Files:**
- Modify: `app/globals.css`

**Replace the body::before ambient mesh (both light and dark):**
```css
/* Forge ambient mesh — warm amber glow */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 70% 50% at 10% 20%, rgba(245,158,11,0.04) 0%, transparent 70%),
    radial-gradient(ellipse 50% 70% at 90% 80%, rgba(217,119,6,0.03) 0%, transparent 70%);
  opacity: 0.5;
  transition: opacity 0.3s ease;
}
[data-theme="dark"] body::before {
  background:
    radial-gradient(ellipse 70% 50% at 10% 20%, rgba(245,158,11,0.06) 0%, transparent 70%),
    radial-gradient(ellipse 50% 70% at 90% 80%, rgba(217,119,6,0.04) 0%, transparent 70%);
  opacity: 1;
}
```

**Remove the grain overlay — replace body::after with:**
```css
/* Subtle texture — very light grain */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.008;
  mix-blend-mode: multiply;
}
[data-theme="dark"] body::after {
  opacity: 0.015;
  mix-blend-mode: overlay;
}
```

**Replace .aurora-bar:**
```css
/* ── Forge Accent Bar (replaces aurora-bar) ──────────────────────────────── */
@keyframes forge-flow {
  0%   { background-position: 0% 50%;   }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%;   }
}
.aurora-bar {
  background: var(--forge-gradient-animated);
  background-size: 300% 300%;
  animation: forge-flow 6s ease infinite;
}
```

**Replace .aurora-border::before:**
```css
.aurora-border::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: var(--forge-gradient);
  border-radius: inherit;
  z-index: -1;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}
.aurora-border:hover::before { opacity: 0.9; }
```

**Replace .aurora-glow-hover:hover:**
```css
.aurora-glow-hover:hover {
  box-shadow:
    0 0 0 1px rgba(var(--color-ore), 0.20),
    0 0 20px rgba(var(--color-ore), 0.08),
    0 0 50px rgba(var(--color-ore), 0.04);
}
```

**Replace .aurora-cta-wrap::before:**
```css
.aurora-cta-wrap::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: var(--forge-gradient-animated);
  background-size: 300% 300%;
  animation: forge-flow 4s ease infinite;
  z-index: 0;
  border-radius: inherit;
  opacity: 0.6;
}
[data-theme="dark"] .aurora-cta-wrap::before {
  opacity: 1;
}
```

**Replace .rule-ember:**
```css
.rule-ember {
  height: 2px;
  background: var(--forge-gradient);
  border: none;
}
```

**Remove the old @keyframes aurora-flow** (replaced by forge-flow above)

**Step 1: Apply all replacements above to `app/globals.css`**

**Step 2: Build check**
```bash
cd /Users/aviel/Desktop/the-ai-desk && npm run build 2>&1 | tail -10
```

**Step 3: Commit**
```bash
git add app/globals.css
git commit -m "design(forge): replace aurora rainbow classes with amber forge styling"
```

---

### Task 3: Update Tailwind shadow tokens

**Files:**
- Modify: `tailwind.config.ts`

Replace the `boxShadow` block:
```typescript
boxShadow: {
  'forge-sm': '0 0 12px rgba(245,158,11,0.15), 0 0 30px rgba(217,119,6,0.06)',
  'forge-md': '0 0 20px rgba(245,158,11,0.20), 0 0 50px rgba(217,119,6,0.10)',
  'forge-lg': '0 0 40px rgba(245,158,11,0.25), 0 0 80px rgba(217,119,6,0.12)',
  'win-glow':  '0 0 20px rgba(0,229,153,0.20), 0 0 50px rgba(0,229,153,0.10)',
  // Keep old aurora names as aliases so existing usages don't break
  'aurora-sm': '0 0 12px rgba(245,158,11,0.15), 0 0 30px rgba(217,119,6,0.06)',
  'aurora-md': '0 0 20px rgba(245,158,11,0.20), 0 0 50px rgba(217,119,6,0.10)',
  'aurora-lg': '0 0 40px rgba(245,158,11,0.25), 0 0 80px rgba(217,119,6,0.12)',
},
```

**Step 1: Apply the replacement to `tailwind.config.ts`**

**Step 2: Build check**
```bash
cd /Users/aviel/Desktop/the-ai-desk && npm run build 2>&1 | tail -5
```

**Step 3: Commit**
```bash
git add tailwind.config.ts
git commit -m "design(forge): update shadow tokens to amber"
```

---

### Task 4: Fix inline style in app/page.tsx

**Files:**
- Modify: `app/page.tsx:110`

Find this line (around line 110):
```tsx
<span className="h-px w-12 shrink-0" style={{ background: 'var(--aurora-gradient)' }} />
```

Replace with:
```tsx
<span className="h-px w-12 shrink-0" style={{ background: 'var(--forge-gradient)' }} />
```

**Step 1: Make the replacement**

**Step 2: Build check**
```bash
cd /Users/aviel/Desktop/the-ai-desk && npm run build 2>&1 | tail -5
```

**Step 3: Commit and push**
```bash
git add app/page.tsx
git commit -m "design(forge): fix inline aurora-gradient reference"
git pull --rebase origin main && git push origin main
```

---

### Notes

- All 33 aurora-* class usages in TSX files stay unchanged — classes are restyled in CSS
- The `--aurora-gradient` CSS variable is renamed to `--forge-gradient` but old name kept as alias
- Amazon affiliate button (`.view-deal-btn`) stays orange — that's Amazon's brand, not ours
- Win/loss colors (green/red) stay unchanged — semantic meaning
- `--color-data` (violet) stays — used for secondary data viz, not primary accent
- After push, Vercel deploys automatically — check ai-desk.tech visually
