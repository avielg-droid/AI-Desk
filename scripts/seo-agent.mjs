/**
 * SEO Agent — generates one blog post per run using Claude API.
 * Saves draft to scripts/pending-post.json and notifies via Telegram.
 * Runs via GitHub Actions on a cron schedule.
 *
 * Usage: node scripts/seo-agent.mjs
 * Requires: ANTHROPIC_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID env vars
 */

import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const BLOG_DIR = path.join(ROOT, 'content', 'blog')
const PRODUCTS_DIR = path.join(ROOT, 'content', 'products')
const PENDING_PATH = path.join(__dirname, 'pending-post.json')

// ── Telegram ───────────────────────────────────────────────────────────────────

async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.log('Telegram not configured — skipping notification')
    return
  }
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    })
  } catch (err) {
    console.error('Telegram send failed:', err.message)
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

function getExistingBlogSlugs() {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
}

function getAllProducts() {
  if (!fs.existsSync(PRODUCTS_DIR)) return []
  return fs.readdirSync(PRODUCTS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => readJSON(path.join(PRODUCTS_DIR, f)))
}

function buildProductCatalog(products) {
  return products.map(p => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    brand: p.brand,
    priceDisplay: p.priceDisplay,
    specs: p.specs,
    pros: p.pros?.slice(0, 3),
    cons: p.cons?.slice(0, 3),
    verdict: p.verdict,
    affiliateUrl: p.affiliateUrl,
  }))
}

function stripCodeFence(str) {
  return str
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

function validatePost(post) {
  const required = ['slug', 'title', 'headline', 'description', 'category',
    'tags', 'publishedAt', 'updatedAt', 'readingTimeMinutes',
    'content', 'faq', 'relatedProductSlugs']
  for (const field of required) {
    if (!post[field]) throw new Error(`Missing required field: ${field}`)
  }
  if (!Array.isArray(post.content) || post.content.length < 5) {
    throw new Error('content must be array with at least 5 blocks')
  }
  if (!Array.isArray(post.faq) || post.faq.length < 5) {
    throw new Error('faq must be array with at least 5 items')
  }
  const validCategories = ['buying-guide', 'benchmarks', 'how-to', 'analysis', 'news']
  if (!validCategories.includes(post.category)) {
    throw new Error(`Invalid category: ${post.category}`)
  }
}

// ── Prompt ─────────────────────────────────────────────────────────────────────

function buildPrompt(target, products, today) {
  const catalog = buildProductCatalog(products)
  const relevantProducts = catalog.filter(p =>
    target.relatedProducts?.includes(p.slug)
  )

  return `You are an expert local AI hardware reviewer writing for The AI Desk (ai-desk.tech).
The site reviews GPUs, Mini PCs, and AI accessories for running LLMs and Stable Diffusion locally.

Today's date: ${today}
Target keyword: "${target.keyword}"
Post slug: ${target.slug}
Category: ${target.category}
Focus: ${target.focus}

PRODUCT CATALOG (use real specs from these products — do not invent specs):
${JSON.stringify(relevantProducts, null, 2)}

OUTPUT: Return ONLY a valid JSON object matching this exact TypeScript interface.
No markdown. No explanation. No code fences. Pure JSON only.

Interface:
{
  slug: string,                    // use: "${target.slug}"
  title: string,                   // 50-65 chars, include year 2026, include primary keyword
  headline: string,                // shorter version for display
  description: string,             // 150-160 chars meta description with keyword
  category: "${target.category}",
  tags: string[],                  // 4-6 lowercase tags, hyphenated
  publishedAt: "${today}",
  updatedAt: "${today}",
  readingTimeMinutes: number,      // realistic estimate
  featured: false,
  intro: string,                   // 2-3 sentence intro paragraph (plain text, no HTML)
  relatedProductSlugs: string[],   // use slugs from: ${JSON.stringify(target.relatedProducts ?? [])}
  content: ContentBlock[],         // at least 8 blocks, see types below
  faq: { question: string, answer: string }[]  // exactly 8 FAQ items
}

ContentBlock types (use "type" field to distinguish):
- { type: "h2", text: string }
- { type: "h3", text: string }
- { type: "p", html: string }       // HTML allowed: <strong>, <em>, <a href='...'>, <code>
- { type: "ul", items: string[] }   // bullet list items (plain text)
- { type: "ol", items: string[] }   // numbered list items (plain text)
- { type: "callout", html: string, variant: "verdict"|"tip"|"info"|"warning" }
- { type: "table", headers: string[], rows: string[][] }
- { type: "divider" }

REQUIREMENTS:
1. Open with a "callout" variant="verdict" with a TL;DR summary
2. Include at least one comparison table with real spec data from the product catalog
3. Each h2 section needs 1-2 "p" blocks with substantive content (100+ words combined per section)
4. Internal links: use <a href='/products/SLUG'>Product Name</a> format in p blocks for reviewed products
5. Include a "Who should NOT buy this" or "Who this is NOT for" section
6. End content with a "Verdict" h2 section
7. FAQ: 8 questions people actually search — include keyword variants, specific model names, numbers
8. Writing style: direct, technical, no fluff. Use real numbers from product specs. Say what wins and why.
9. Do NOT invent benchmark numbers not present in the product catalog
10. readingTimeMinutes: count roughly 200 words/minute

Return ONLY the JSON. Nothing else.`
}

// ── llms.txt updater ───────────────────────────────────────────────────────────

function updateLLMsTxt(blogSlugs) {
  const llmsPath = path.join(ROOT, 'public', 'llms.txt')
  if (!fs.existsSync(llmsPath)) return

  const existing = fs.readFileSync(llmsPath, 'utf-8')
  const blogSection = blogSlugs
    .map(s => `- https://ai-desk.tech/blog/${s}`)
    .join('\n')

  const updated = existing.replace(
    /## Blog Posts[\s\S]*?(?=##|$)/,
    `## Blog Posts\n${blogSection}\n\n`
  )

  if (updated !== existing) {
    fs.writeFileSync(llmsPath, updated)
    console.log('✓ Updated llms.txt')
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('ERROR: ANTHROPIC_API_KEY not set')
    process.exit(1)
  }

  // Skip if a post is already pending approval
  if (fs.existsSync(PENDING_PATH)) {
    const pending = readJSON(PENDING_PATH)
    console.log(`Pending post already waiting for approval: "${pending.title}"`)
    await sendTelegram(
      `⏳ *Reminder: post awaiting approval*\n\n*${pending.title}*\n\nReply /approve to publish or /skip to discard.`
    )
    process.exit(0)
  }

  // Load targets and find next unwritten one
  const targets = readJSON(path.join(__dirname, 'keyword-targets.json'))
  const existingSlugs = new Set(getExistingBlogSlugs())

  const target = targets.find(t => !existingSlugs.has(t.slug))
  if (!target) {
    console.log('All keyword targets already written. Add more to keyword-targets.json.')
    await sendTelegram('📭 *SEO Agent*: All keyword targets are published. Add more with /add.')
    process.exit(0)
  }

  console.log(`→ Generating post: ${target.slug}`)
  console.log(`  Keyword: ${target.keyword}`)

  const products = getAllProducts()
  const today = new Date().toISOString().split('T')[0]
  const prompt = buildPrompt(target, products, today)

  const client = new Anthropic({ apiKey })

  let raw
  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    })
    raw = message.content[0].text
  } catch (err) {
    console.error('Claude API error:', err.message)
    await sendTelegram(`❌ *SEO Agent error*: Claude API failed — ${err.message}`)
    process.exit(1)
  }

  // Parse JSON
  let post
  try {
    post = JSON.parse(stripCodeFence(raw))
  } catch (err) {
    console.error('Failed to parse JSON response:', err.message)
    await sendTelegram(`❌ *SEO Agent error*: JSON parse failed — ${err.message}`)
    process.exit(1)
  }

  // Validate
  try {
    validatePost(post)
  } catch (err) {
    console.error('Validation failed:', err.message)
    await sendTelegram(`❌ *SEO Agent error*: Validation failed — ${err.message}`)
    process.exit(1)
  }

  post.slug = target.slug

  // Save as pending draft
  fs.writeFileSync(PENDING_PATH, JSON.stringify(post, null, 2))
  console.log(`✓ Draft saved: scripts/pending-post.json`)

  // Notify via Telegram
  const excerpt = post.intro?.slice(0, 200) ?? post.description?.slice(0, 200) ?? ''
  const msg = [
    `📝 *New post ready for review*`,
    ``,
    `*${post.title}*`,
    `Category: ${post.category} | ${post.readingTimeMinutes} min read`,
    ``,
    `${excerpt}...`,
    ``,
    `FAQ items: ${post.faq.length} | Content blocks: ${post.content.length}`,
    ``,
    `✅ /approve — publish now`,
    `⏭ /skip — discard and move to next keyword`,
    `👁 /preview — show full FAQ list`,
  ].join('\n')

  await sendTelegram(msg)
  console.log(`✓ Telegram notification sent`)
  console.log(`✓ Done. Awaiting approval for: "${post.title}"`)
}

main().catch(async err => {
  console.error('Fatal:', err)
  await sendTelegram(`❌ *SEO Agent fatal error*: ${err.message}`)
  process.exit(1)
})
