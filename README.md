# The AI Desk

> Expert reviews of AI hardware for running LLMs and Stable Diffusion locally — GPUs, Mini PCs, and accessories.

Built with Next.js 14, Tailwind CSS, deployed on Vercel with ISR.

## Features

- 7 GEO-optimized product review pages (BLUF summaries, FAQ schema, JSON-LD)
- ISR (`revalidate = 3600`) — static speed, fresh data
- Amazon Associates compliant — site-wide disclosure + per-link `(paid link)` labels
- `robots.txt` allows OAI-SearchBot, blocks GPTBot
- Dynamic sitemap at `/sitemap.xml`

## Stack

- **Framework:** Next.js 14 App Router
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **Content:** JSON files in `content/products/`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Before Launch

Replace `YOUR_ASSOCIATE_TAG` in all `content/products/*.json` files with your Amazon Associates tracking ID.

## Disclosure

As an Amazon Associate I earn from qualifying purchases.
