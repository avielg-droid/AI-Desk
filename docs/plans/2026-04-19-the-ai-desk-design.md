# The AI Desk — Design Document
*2026-04-19*

## Overview

Amazon affiliate website focused on AI hardware for running AI locally. Targets GEO/SEO 2026 standards. Reference architecture: compute-market.com.

**Stack:** Next.js 14 (App Router) · Tailwind CSS · Vercel (ISR) · JSON product files

---

## 1. Project Structure

```
the-ai-desk/
├── app/
│   ├── layout.tsx              # Global layout, affiliate disclosure banner
│   ├── page.tsx                # Homepage — featured products, hero
│   ├── products/
│   │   ├── page.tsx            # Product catalog
│   │   └── [slug]/
│   │       └── page.tsx        # Individual product page (ISR, revalidate=3600)
│   ├── categories/
│   │   └── [category]/
│   │       └── page.tsx        # Category pillar pages
│   └── about/
│       └── page.tsx            # About + full disclosure page
├── content/
│   └── products/               # 7 seed product JSON files
├── components/
│   ├── ProductCard.tsx
│   ├── ProductHero.tsx
│   ├── ComparisonTable.tsx
│   ├── AffiliateButton.tsx     # "(paid link)" disclosure built-in
│   ├── SchemaMarkup.tsx        # JSON-LD injector
│   └── AffiliateDisclosure.tsx # Site-wide Amazon Associates banner
├── lib/
│   ├── products.ts             # Load/parse product JSON
│   └── schema.ts               # JSON-LD builders
└── public/
    └── robots.txt
```

---

## 2. Product Data Model

```json
{
  "slug": "apple-mac-mini-m4-pro",
  "asin": "B0DLBVHSLD",
  "name": "Apple Mac Mini (M4 Pro, 2024)",
  "category": "mini-pc",
  "brand": "Apple",
  "shortDescription": "BLUF 2-3 sentence summary. RAG-ready. Quotable by AI assistants.",
  "specs": {
    "chip": "Apple M4 Pro",
    "cpu_cores": 14,
    "gpu_cores": 20,
    "unified_memory_gb": 24,
    "storage_gb": 512,
    "tdp_watts": 25,
    "max_llm_size": "70B quantized"
  },
  "useCases": ["Local LLM inference", "Stable Diffusion", "Home AI server"],
  "pros": ["..."],
  "cons": ["..."],
  "verdict": "One-paragraph expert verdict.",
  "affiliateUrl": "https://www.amazon.com/dp/B0DLBVHSLD?tag=YOUR_ASSOCIATE_TAG",
  "rating": 4.7,
  "reviewCount": 0,
  "priceDisplay": "Check Price on Amazon",
  "lastUpdated": "2026-04-19",
  "featured": true,
  "faq": [
    {
      "question": "How many parameters can this run locally?",
      "answer": "..."
    }
  ]
}
```

**Constraints:**
- No static prices — always `"Check Price on Amazon"` (Amazon compliance)
- `shortDescription` written for RAG extraction (BLUF method)
- `faq` → FAQPage schema + GEO targeting
- `specs` → structured for comparison tables + Product schema

---

## 3. Page Types & Routing

### Homepage
- Editorial hero section
- "Best For" category grid
- 3 featured products
- Targets: "best AI hardware for local LLM", "run AI locally 2026"

### Product Page (`/products/[slug]`)
- H1: product name
- BLUF `shortDescription` (first 150 chars RAG-extractable)
- H2s as questions: "How does the Mac Mini M4 Pro perform on local LLM tasks?"
- Spec table with semantic row headers (VRAM, Cores, TDP, Max Model Size)
- Pros / Cons
- FAQ section
- Affiliate CTA button with inline `(paid link)` disclosure
- JSON-LD: `Product` + `Review` + `FAQPage` schemas
- ISR: `export const revalidate = 3600`

### Category Pages (`/categories/[category]`)
- Pillar pages for topical authority
- Categories: `mini-pc`, `gpu`, `ai-pc`, `accessories`
- H1: "Best [Category] for Running AI Locally (2026)"
- Links to all products in category (entity relationship network)

---

## 4. SEO/GEO Implementation

### Content Strategy
- BLUF method: concise factual summary at top of every section
- Semantic H2/H3 structure — real user questions
- Fact-dense bullet points — grammatically correct, quotable
- Comparison tables with semantic row headers

### Bot Governance (`robots.txt`)
```
User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: *
Allow: /
```

### Schema Markup (JSON-LD)
- `Product` — name, brand, description, offers
- `Review` — rating, author, reviewBody
- `FAQPage` — per-product FAQ pairs
- `Organization` — site entity, brand signals
- `BreadcrumbList` — on all pages

---

## 5. Amazon Compliance

**Non-negotiable. Two layers:**

1. **Site-wide disclosure** in `layout.tsx`:
   > "As an Amazon Associate I earn from qualifying purchases."

2. **Link-level disclosure** — `AffiliateButton` component always renders `(paid link)` immediately before/after every affiliate link. No exceptions. Baked into component, not left to page authors.

**No static prices.** All CTAs use `priceDisplay: "Check Price on Amazon"`.

---

## 6. Performance Targets

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |

Achieved via: ISR (pre-rendered HTML), Tailwind (zero runtime CSS), Next.js image optimization, Vercel Edge Network.

---

## 7. Seed Products (7)

| ASIN | Product |
|------|---------|
| B0DLBVHSLD | Apple Mac Mini M4 Pro (2024) |
| B0GHDTHM53 | GMKtec Mini PC (Core i3) |
| B0BC7S9R5C | TBD — identify at build time |
| B0G488CW54 | TBD — identify at build time |
| B0DLBX4B1K | TBD — identify at build time |
| B0C85YVQLW | TBD — identify at build time |
| B0DP23FPKY | TBD — identify at build time |

---

## Decisions Log

| Decision | Choice | Reason |
|----------|--------|--------|
| Framework | Next.js 14 App Router | ISR, ecosystem, Vercel native |
| Deployment | Vercel | Zero-config ISR, IndexNow integration |
| Styling | Tailwind CSS | Zero dead CSS, no runtime overhead |
| Content storage | JSON files | Structured, version-controlled, schema-mappable |
| CMS | None (phase 1) | YAGNI — 7 products don't need CMS overhead |
| Affiliate tag | Placeholder | User doesn't have tag yet |
