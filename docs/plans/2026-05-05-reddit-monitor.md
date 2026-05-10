# Reddit Monitor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add daily r/LocalLLaMA monitoring + `/draft <url>` command to the existing Telegram bot.

**Architecture:** Extend `scripts/telegram-bot.ts` with (1) a daily cron that fetches r/LocalLLaMA public JSON, filters by keyword, sends a Telegram digest, and (2) a `/draft` command that fetches a Reddit thread and calls Claude API to write a contextual reply linking to ai-desk.tech.

**Tech Stack:** TypeScript, node-telegram-bot-api (existing), @anthropic-ai/sdk (existing), node-cron (new), native fetch (Node 18+)

---

### Task 1: Add node-cron dependency

**Files:**
- Modify: `package.json`

**Step 1: Install node-cron**

```bash
cd /Users/aviel/Desktop/the-ai-desk
npm install node-cron
npm install --save-dev @types/node-cron
```

**Step 2: Verify install**

```bash
grep "node-cron" package.json
```
Expected: `"node-cron": "^3.x.x"` in dependencies

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add node-cron for Reddit monitor scheduler"
```

---

### Task 2: Add keyword list and product-to-URL mapping

**Files:**
- Modify: `scripts/telegram-bot.ts` — add constants near top of file (after existing config block)

**Step 1: Add constants**

Add after the `const PENDING_PATH = ...` line:

```typescript
// ── Reddit Monitor Config ──────────────────────────────────────────────────────

const REDDIT_KEYWORDS = [
  // Products
  'rtx 5070', 'rtx 5080', 'rtx 4090', 'rtx 4070', 'rtx 5060',
  'rx 9060', 'mac mini m4', 'geekom', 'gmktec', 'kamrui', 'noctua',
  // Topics
  'local llm', 'local ai', 'ollama', 'llama.cpp', 'gpu for llm',
  'vram', 'tokens per second', 'inference speed', 'mini pc for ai',
  'stable diffusion gpu', 'flux gpu', 'amd rocm', 'unified memory',
]

const PRODUCT_LINKS: Record<string, string> = {
  'rtx 5070':        'https://ai-desk.tech/products/gigabyte-rtx-5070-windforce',
  'rtx 5080':        'https://ai-desk.tech/products/msi-rtx-5080-gaming-trio',
  'rtx 4090':        'https://ai-desk.tech/products/msi-rtx-4090',
  'rtx 5060':        'https://ai-desk.tech/products/asus-rtx-5060-ti-dual',
  'rx 9060':         'https://ai-desk.tech/products/gigabyte-rx-9060-xt-gaming',
  'mac mini m4 pro': 'https://ai-desk.tech/products/apple-mac-mini-m4-pro',
  'mac mini m4':     'https://ai-desk.tech/products/apple-mac-mini-m4',
  'geekom':          'https://ai-desk.tech/products/geekom-ai-a7-max',
  'gmktec':          'https://ai-desk.tech/products/gmktec-m6-ultra',
  'kamrui':          'https://ai-desk.tech/products/kamrui-pinova-p1',
  'noctua':          'https://ai-desk.tech/products/noctua-nh-d15',
  'default':         'https://ai-desk.tech',
}

const REDDIT_SEEN_IDS = new Set<string>() // in-memory dedup within same day
```

**Step 2: Commit**

```bash
git add scripts/telegram-bot.ts
git commit -m "feat(reddit): add keyword list and product URL mapping"
```

---

### Task 3: Add Reddit fetch + filter helper functions

**Files:**
- Modify: `scripts/telegram-bot.ts` — add helpers after the existing GitHub API helpers block

**Step 1: Add helpers**

```typescript
// ── Reddit helpers ─────────────────────────────────────────────────────────────

interface RedditPost {
  id: string
  title: string
  url: string
  permalink: string
  score: number
  num_comments: number
  selftext: string
}

async function fetchRedditPosts(subreddit: string, limit = 100): Promise<RedditPost[]> {
  const res = await fetch(
    `https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}`,
    { headers: { 'User-Agent': 'ai-desk-monitor/1.0 (by /u/ai_desk_tech)' } }
  )
  if (!res.ok) throw new Error(`Reddit API ${res.status}`)
  const json = await res.json() as any
  return json.data.children.map((c: any) => c.data as RedditPost)
}

function filterRelevantPosts(posts: RedditPost[]): RedditPost[] {
  return posts.filter(post => {
    if (REDDIT_SEEN_IDS.has(post.id)) return false
    const text = `${post.title} ${post.selftext}`.toLowerCase()
    return REDDIT_KEYWORDS.some(kw => text.includes(kw))
  })
}

function pickBestProductLink(title: string): string {
  const lower = title.toLowerCase()
  for (const [kw, url] of Object.entries(PRODUCT_LINKS)) {
    if (kw !== 'default' && lower.includes(kw)) return url
  }
  return PRODUCT_LINKS['default']
}
```

**Step 2: Commit**

```bash
git add scripts/telegram-bot.ts
git commit -m "feat(reddit): add fetch and filter helpers"
```

---

### Task 4: Add daily digest cron job

**Files:**
- Modify: `scripts/telegram-bot.ts` — add cron near bottom, before the `console.log` start line

**Step 1: Add import at top of file**

```typescript
import cron from 'node-cron'
```

**Step 2: Add cron job**

Add before `console.log(...)` at bottom:

```typescript
// ── Reddit daily digest (09:00 UTC) ───────────────────────────────────────────

cron.schedule('0 9 * * *', async () => {
  try {
    const posts = await fetchRedditPosts('LocalLLaMA')
    const relevant = filterRelevantPosts(posts).slice(0, 5)

    if (relevant.length === 0) {
      await bot.sendMessage(ALLOWED_USER_ID, '📡 Reddit digest: no relevant threads today.')
      return
    }

    relevant.forEach(p => REDDIT_SEEN_IDS.add(p.id))

    const lines = [
      `📡 *r/LocalLLaMA — Today's relevant threads (${relevant.length})*\n`,
      ...relevant.map((p, i) =>
        `*${i + 1}\\. ${escape(p.title)}*\n` +
        `↑${p.score} · ${p.num_comments} comments\n` +
        `[View thread](https://reddit.com${p.permalink})\n` +
        `Reply: \`/draft https://reddit.com${p.permalink}\``
      ),
    ]

    await bot.sendMessage(ALLOWED_USER_ID, lines.join('\n'), {
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: true,
    })
  } catch (err: any) {
    console.error('Reddit digest error:', err.message)
  }
}, { timezone: 'UTC' })
```

**Step 3: Commit**

```bash
git add scripts/telegram-bot.ts
git commit -m "feat(reddit): add daily 09:00 UTC digest cron"
```

---

### Task 5: Add `/draft` command

**Files:**
- Modify: `scripts/telegram-bot.ts` — add handler before the `// ── Start ──` block

**Step 1: Add `/draft` handler**

```typescript
// ── /draft ─────────────────────────────────────────────────────────────────────

bot.onText(/\/draft (.+)/, async (msg, match) => {
  if (!guard(msg)) return
  const url = match?.[1]?.trim()
  if (!url || !url.includes('reddit.com')) {
    return void bot.sendMessage(msg.chat.id, '❌ Usage: /draft <reddit_url>')
  }

  await bot.sendMessage(msg.chat.id, '⏳ Reading thread and drafting reply...')

  try {
    // Fetch thread JSON — append .json to Reddit URL
    const jsonUrl = url.replace(/\/?$/, '.json')
    const res = await fetch(jsonUrl, {
      headers: { 'User-Agent': 'ai-desk-monitor/1.0 (by /u/ai_desk_tech)' }
    })
    if (!res.ok) throw new Error(`Reddit fetch failed: ${res.status}`)
    const data = await res.json() as any

    const postData = data[0]?.data?.children?.[0]?.data
    if (!postData) throw new Error('Could not parse Reddit thread')

    const title: string = postData.title
    const selftext: string = postData.selftext || ''
    const comments: string[] = (data[1]?.data?.children || [])
      .slice(0, 8)
      .map((c: any) => c.data?.body || '')
      .filter(Boolean)

    const productLink = pickBestProductLink(title)

    // Call Claude
    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `You are a knowledgeable member of r/LocalLLaMA who runs a local AI hardware review site (ai-desk.tech). Write a helpful Reddit reply to this thread.

Thread title: ${title}
Thread body: ${selftext.slice(0, 500)}
Top comments context:
${comments.join('\n---\n').slice(0, 1000)}

Rules:
- Sound like a real community member, not an advertiser
- Be genuinely helpful first — answer the question
- Include ONE natural link to ${productLink} only if it directly answers something in the thread
- Keep it under 150 words
- No markdown headers, no bullet spam, write like a Reddit comment
- Do NOT mention you run the site — just link it naturally ("I benchmarked this on [product] over at ai-desk.tech")

Write only the comment text, nothing else.`,
      }],
    })

    const draft = (response.content[0] as any).text

    await bot.sendMessage(msg.chat.id,
      `📝 *Draft reply:*\n\n${escape(draft)}\n\n_Copy and paste to Reddit_`,
      { parse_mode: 'MarkdownV2' }
    )
  } catch (err: any) {
    bot.sendMessage(msg.chat.id, `❌ Error: ${err.message}`)
  }
})
```

**Step 2: Update `/help` to include `/draft`**

In the existing `/help` handler, add this line to the approval flow section:

```
/draft [url] — generate Reddit reply for a thread\n` +
```

Add it after the `/preview` line.

**Step 3: Commit**

```bash
git add scripts/telegram-bot.ts
git commit -m "feat(reddit): add /draft command with Claude reply generation"
```

---

### Task 6: Deploy to Railway

**Step 1: Push**

```bash
git push origin main
```

**Step 2: Verify Railway redeploys**

Railway auto-deploys on push. Check Railway dashboard → Deployments → confirm build succeeds.

**Step 3: Test `/draft` manually**

Send to Telegram bot:
```
/draft https://www.reddit.com/r/LocalLLaMA/comments/any_real_thread/
```

Expected: bot replies with a drafted Reddit comment in ~5 seconds.

**Step 4: Digest fires next day at 09:00 UTC**

No action needed — cron runs automatically.

---

### Notes

- **No new Railway env vars needed** — `ANTHROPIC_API_KEY` already set
- **Reddit rate limits** — public JSON API allows ~1 req/min. Daily cron = 1 req/day, well within limits
- **`REDDIT_SEEN_IDS`** is in-memory — resets on Railway restart, but that's fine for daily digest
- **Haiku model used for `/draft`** — fast and cheap for short reply generation
