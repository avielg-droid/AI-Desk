# The AI Desk — Product Context

## Product Purpose
Independent hardware review and buying-guide site for running AI locally. Reviews GPUs, Mini PCs, AI PCs, and accessories for LLM inference (Ollama, LM Studio) and Stable Diffusion. Affiliate revenue via Amazon Associates.

## Register
brand

## Users
- **Primary**: Tech-curious individuals (25–45) who want to run AI models locally for privacy, cost savings, or performance. Intermediate technical level — they know what Ollama is but aren't kernel hackers.
- **Secondary**: Small business owners and developers evaluating private AI infrastructure alternatives to cloud APIs.
- **Tertiary**: Enthusiasts building custom rigs for Stable Diffusion and LoRA training.

## Brand Tone
Editorial, direct, no-nonsense. Like a trusted engineer friend who happens to have benchmarked everything. No hype, no filler. Numbers over adjectives. Opinionated recommendations backed by data.

## Anti-references
- Consumer electronics review sites that feel corporate and bland (CNET, Tom's Guide)
- Overly playful/startup-y AI branding (neon gradients, robot mascots)
- Dense forum aesthetics (Reddit, LinusTechTips)

## Visual Direction
- Editorial tech: think The Verge meets a Bloomberg data dashboard
- Dark/light both supported; dark is the premium experience
- Accent: cyan-600 (#0891B2) light / blue-500 (#3B82F6) dark — electric, modern, trustworthy
- Typography: Plus Jakarta Sans (body/UI) + Geist Sans (headlines) + DM Mono (labels/specs)
- Grid-based layouts with strong edge lines, `gap-px` editorial grids
- No rounded corners on cards/containers — sharp, editorial
- Rounded corners only on buttons (border-radius: 8px)
- Rule lines (thin gradient bars) at top of sections for visual anchoring

## Key Pages
- Homepage: hero + why local AI + categories + featured products + persona funnels + ROI calculator
- /products: filterable product grid
- /products/[slug]: full product review with specs, pros/cons, verdict, FAQ, cross-sells
- /best/[persona]: curated buying guides
- /guides/[slug]: setup guides
- /blog: editorial content

## Strategic Principles
- Trust through specificity: exact numbers, not vague claims
- SEO-first content: targets "best GPU for local AI 2026" type queries
- Affiliate disclosure always present — no hiding it
- Fast, static-first (Next.js SSG)
