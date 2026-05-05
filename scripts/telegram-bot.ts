/**
 * AI Desk SEO Agent — Telegram Bot Controller
 * Runs as persistent process on Railway.
 * Controls the GitHub Actions SEO agent via GitHub API.
 */

import TelegramBot from 'node-telegram-bot-api'
import { Octokit } from '@octokit/rest'
import cron from 'node-cron'

// ── Config ─────────────────────────────────────────────────────────────────────

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!
const ALLOWED_USER_ID = Number(process.env.TELEGRAM_ALLOWED_USER_ID || '0')
const OWNER = 'avielg-droid'
const REPO = 'AI-Desk'
const BRANCH = 'main'
const PENDING_PATH = 'scripts/pending-post.json'

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

if (!BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN not set')
if (!GITHUB_TOKEN) throw new Error('GITHUB_TOKEN not set')
if (!ALLOWED_USER_ID) throw new Error('TELEGRAM_ALLOWED_USER_ID not set')

const bot = new TelegramBot(BOT_TOKEN, { polling: true })
const octokit = new Octokit({ auth: GITHUB_TOKEN })

// ── Security ───────────────────────────────────────────────────────────────────

function guard(msg: TelegramBot.Message): boolean {
  if (msg.from?.id !== ALLOWED_USER_ID) {
    bot.sendMessage(msg.chat.id, '⛔ Unauthorized')
    return false
  }
  return true
}

// ── GitHub API helpers ─────────────────────────────────────────────────────────

async function getFile(path: string): Promise<{ content: string; sha: string } | null> {
  try {
    const res = await octokit.repos.getContent({ owner: OWNER, repo: REPO, path })
    const data = res.data as { content: string; sha: string }
    return { content: Buffer.from(data.content, 'base64').toString('utf-8'), sha: data.sha }
  } catch {
    return null
  }
}

async function putFile(path: string, content: string, message: string, sha?: string) {
  await octokit.repos.createOrUpdateFileContents({
    owner: OWNER, repo: REPO, path, message,
    content: Buffer.from(content).toString('base64'),
    sha, branch: BRANCH,
  })
}

async function deleteFile(path: string, sha: string, message: string) {
  await octokit.repos.deleteFile({
    owner: OWNER, repo: REPO, path, message, sha, branch: BRANCH,
  })
}

async function triggerWorkflow(workflowId: string) {
  await octokit.actions.createWorkflowDispatch({
    owner: OWNER, repo: REPO, workflow_id: workflowId, ref: BRANCH,
  })
}

async function getBlogPosts(): Promise<string[]> {
  try {
    const res = await octokit.repos.getContent({ owner: OWNER, repo: REPO, path: 'content/blog' })
    const files = res.data as Array<{ name: string }>
    return files.filter(f => f.name.endsWith('.json')).map(f => f.name.replace('.json', '')).sort()
  } catch { return [] }
}

async function getKeywordTargets(): Promise<Array<{ slug: string; keyword: string; category: string }>> {
  const file = await getFile('scripts/keyword-targets.json')
  if (!file) return []
  return JSON.parse(file.content)
}

async function isPaused(): Promise<boolean> {
  return (await getFile('scripts/paused.flag')) !== null
}

async function getPendingPost(): Promise<{ post: any; sha: string } | null> {
  const file = await getFile(PENDING_PATH)
  if (!file) return null
  return { post: JSON.parse(file.content), sha: file.sha }
}

function toSlug(keyword: string): string {
  return keyword.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80)
}

function escape(text: string): string {
  return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&')
}

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

// ── /help ──────────────────────────────────────────────────────────────────────

bot.onText(/\/help/, async (msg) => {
  if (!guard(msg)) return
  bot.sendMessage(msg.chat.id,
    `🤖 *AI Desk SEO Agent*\n\n` +
    `*Approval flow:*\n` +
    `/approve — publish pending post live\n` +
    `/skip — discard pending post, move to next\n` +
    `/preview — show pending post details\n` +
    `/draft \\[url\\] — generate Reddit reply for a thread\n\n` +
    `*Controls:*\n` +
    `/run — generate a post now\n` +
    `/status — queue status \\+ recent posts\n` +
    `/add \\[keyword\\] — add keyword to queue\n` +
    `/pause — pause scheduled runs\n` +
    `/resume — resume scheduled runs\n` +
    `/help — this message`,
    { parse_mode: 'MarkdownV2' }
  )
})

// ── /preview ───────────────────────────────────────────────────────────────────

bot.onText(/\/preview/, async (msg) => {
  if (!guard(msg)) return
  const pending = await getPendingPost()
  if (!pending) return void bot.sendMessage(msg.chat.id, '📭 No post pending approval.')

  const { post } = pending
  const faqs = post.faq?.slice(0, 5).map((f: any, i: number) => `  Q${i+1}: ${f.question}`).join('\n') ?? ''

  bot.sendMessage(msg.chat.id,
    `👁 *Pending post preview*\n\n` +
    `*Title:* ${post.title}\n` +
    `*Category:* ${post.category}\n` +
    `*Reading time:* ${post.readingTimeMinutes} min\n` +
    `*Tags:* ${post.tags?.join(', ')}\n\n` +
    `*Intro:*\n${post.intro?.slice(0, 300)}...\n\n` +
    `*FAQ (first 5):*\n${faqs}\n\n` +
    `✅ /approve | ⏭ /skip`,
    { parse_mode: 'Markdown' }
  )
})

// ── /approve ───────────────────────────────────────────────────────────────────

bot.onText(/\/approve/, async (msg) => {
  if (!guard(msg)) return
  await bot.sendMessage(msg.chat.id, '⏳ Publishing...')

  const pending = await getPendingPost()
  if (!pending) return void bot.sendMessage(msg.chat.id, '📭 No post pending approval.')

  const { post, sha } = pending

  try {
    // Write post to content/blog/
    const blogPath = `content/blog/${post.slug}.json`
    const existing = await getFile(blogPath)
    await putFile(
      blogPath,
      JSON.stringify(post, null, 2),
      `feat(blog): publish "${post.title}"`,
      existing?.sha
    )

    // Delete pending file
    await deleteFile(PENDING_PATH, sha, 'chore: clear pending post after approval')

    // Ping Bing IndexNow
    const postUrl = `https://ai-desk.tech/blog/${post.slug}`
    fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'ai-desk.tech',
        key: '723b25305fa95703f9af04d50c461ed4',
        keyLocation: 'https://ai-desk.tech/723b25305fa95703f9af04d50c461ed4.txt',
        urlList: [postUrl, 'https://ai-desk.tech/blog'],
      }),
    }).catch(err => console.error('IndexNow ping failed:', err.message))

    bot.sendMessage(msg.chat.id,
      `✅ *Published!*\n\n*${post.title}*\n\nLive in ~30s: [ai\\-desk\\.tech/blog/${post.slug}](https://ai-desk.tech/blog/${post.slug})`,
      { parse_mode: 'MarkdownV2' }
    )
  } catch (err: any) {
    bot.sendMessage(msg.chat.id, `❌ Error: ${err.message}`)
  }
})

// ── /skip ──────────────────────────────────────────────────────────────────────

bot.onText(/\/skip/, async (msg) => {
  if (!guard(msg)) return

  const pending = await getPendingPost()
  if (!pending) return void bot.sendMessage(msg.chat.id, '📭 No post pending approval.')

  try {
    await deleteFile(PENDING_PATH, pending.sha, 'chore: skip pending post')
    bot.sendMessage(msg.chat.id,
      `⏭ Discarded: *${pending.post.title}*\n\nNext run will generate the next keyword.`,
      { parse_mode: 'Markdown' }
    )
  } catch (err: any) {
    bot.sendMessage(msg.chat.id, `❌ Error: ${err.message}`)
  }
})

// ── /run ───────────────────────────────────────────────────────────────────────

bot.onText(/\/run/, async (msg) => {
  if (!guard(msg)) return
  try {
    if (await isPaused()) {
      return void bot.sendMessage(msg.chat.id, '⏸ Agent is paused. Use /resume first.')
    }
    const pending = await getPendingPost()
    if (pending) {
      return void bot.sendMessage(msg.chat.id,
        `⚠️ Post already pending approval:\n*${pending.post.title}*\n\nUse /approve or /skip first.`,
        { parse_mode: 'Markdown' }
      )
    }
    await bot.sendMessage(msg.chat.id, '⚡ Triggering SEO agent...')
    await triggerWorkflow('seo-agent.yml')
    bot.sendMessage(msg.chat.id,
      '✅ Generating post now\\. You\'ll get a Telegram preview in ~2 min\\.',
      { parse_mode: 'MarkdownV2' }
    )
  } catch (err: any) {
    bot.sendMessage(msg.chat.id, `❌ Error: ${err.message}`)
  }
})

// ── /status ────────────────────────────────────────────────────────────────────

bot.onText(/\/status/, async (msg) => {
  if (!guard(msg)) return
  await bot.sendMessage(msg.chat.id, '⏳ Fetching...')
  try {
    const [targets, posts, paused, pending] = await Promise.all([
      getKeywordTargets(), getBlogPosts(), isPaused(), getPendingPost(),
    ])
    const published = new Set(posts)
    const remaining = targets.filter(t => !published.has(t.slug))
    const recent = posts.slice(-3).reverse()

    const lines = [
      paused ? '⏸ *Status: PAUSED*' : '▶️ *Status: RUNNING*',
      pending ? `📝 *Pending approval:* ${escape(pending.post.title)}` : '',
      '',
      `📋 *Queue:* ${remaining.length} remaining / ${targets.length} total`,
      '*Next up:*',
      ...remaining.slice(0, 3).map((t, i) => `  ${i + 1}\\. ${escape(t.keyword)}`),
      '',
      `✅ *Published:* ${posts.length} posts`,
      '*Recent:*',
      ...recent.map(s => `  • ${escape(s.replace(/-/g, ' '))}`),
    ].filter(Boolean)

    bot.sendMessage(msg.chat.id, lines.join('\n'), { parse_mode: 'MarkdownV2' })
  } catch (err: any) {
    bot.sendMessage(msg.chat.id, `❌ Error: ${err.message}`)
  }
})

// ── /add ───────────────────────────────────────────────────────────────────────

bot.onText(/\/add (.+)/, async (msg, match) => {
  if (!guard(msg)) return
  const keyword = match?.[1]?.trim()
  if (!keyword) return void bot.sendMessage(msg.chat.id, '❌ Usage: /add your keyword here')

  try {
    const file = await getFile('scripts/keyword-targets.json')
    if (!file) return void bot.sendMessage(msg.chat.id, '❌ Could not read keyword-targets.json')

    const targets = JSON.parse(file.content)
    const slug = toSlug(keyword)

    if (targets.find((t: any) => t.slug === slug)) {
      return void bot.sendMessage(msg.chat.id, `⚠️ Already in queue: \`${slug}\``, { parse_mode: 'Markdown' })
    }

    targets.push({
      slug,
      keyword,
      category: 'buying-guide',
      focus: `Comprehensive guide covering ${keyword} for local AI workloads`,
      relatedProducts: [],
    })

    await putFile('scripts/keyword-targets.json', JSON.stringify(targets, null, 2),
      `feat: add keyword target "${keyword}"`, file.sha)

    bot.sendMessage(msg.chat.id, `✅ Added:\n*${keyword}*\nSlug: \`${slug}\``, { parse_mode: 'Markdown' })
  } catch (err: any) {
    bot.sendMessage(msg.chat.id, `❌ Error: ${err.message}`)
  }
})

// ── /pause ─────────────────────────────────────────────────────────────────────

bot.onText(/\/pause/, async (msg) => {
  if (!guard(msg)) return
  try {
    if (await isPaused()) return void bot.sendMessage(msg.chat.id, '⏸ Already paused.')
    await putFile('scripts/paused.flag', 'paused\n', 'chore: pause SEO agent')
    bot.sendMessage(msg.chat.id, '⏸ Agent paused. Scheduled runs skipped until /resume.')
  } catch (err: any) {
    bot.sendMessage(msg.chat.id, `❌ Error: ${err.message}`)
  }
})

// ── /resume ────────────────────────────────────────────────────────────────────

bot.onText(/\/resume/, async (msg) => {
  if (!guard(msg)) return
  try {
    const file = await getFile('scripts/paused.flag')
    if (!file) return void bot.sendMessage(msg.chat.id, '▶️ Already running.')
    await deleteFile('scripts/paused.flag', file.sha, 'chore: resume SEO agent')
    bot.sendMessage(msg.chat.id, '▶️ Agent resumed. Next run at 08:00 UTC.')
  } catch (err: any) {
    bot.sendMessage(msg.chat.id, `❌ Error: ${err.message}`)
  }
})

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

// ── Start ──────────────────────────────────────────────────────────────────────

console.log(`🤖 AI Desk SEO Bot started (allowed user: ${ALLOWED_USER_ID})`)
bot.on('error', (err) => console.error('Bot error:', err.message))
bot.on('polling_error', (err) => console.error('Polling error:', err.message))
