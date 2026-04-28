/**
 * AI Desk SEO Agent — Telegram Bot Controller
 * Runs as persistent process on Railway.
 * Controls the GitHub Actions SEO agent via GitHub API.
 */

import TelegramBot from 'node-telegram-bot-api'
import { Octokit } from '@octokit/rest'

// ── Config ─────────────────────────────────────────────────────────────────────

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const GITHUB_TOKEN = process.env.GITHUB_TOKEN!
const ALLOWED_USER_ID = Number(process.env.TELEGRAM_ALLOWED_USER_ID || '0')
const OWNER = 'avielg-droid'
const REPO = 'AI-Desk'
const BRANCH = 'main'

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

function toSlug(keyword: string): string {
  return keyword.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 80)
}

// ── /help ──────────────────────────────────────────────────────────────────────

bot.onText(/\/help/, async (msg) => {
  if (!guard(msg)) return
  bot.sendMessage(msg.chat.id,
    `🤖 *AI Desk SEO Agent*\n\n` +
    `/run — generate a post now\n` +
    `/status — keywords left \\+ recent posts\n` +
    `/add \\[keyword\\] — add keyword to queue\n` +
    `/pause — pause scheduled runs\n` +
    `/resume — resume scheduled runs\n` +
    `/help — this message`,
    { parse_mode: 'MarkdownV2' }
  )
})

// ── /run ───────────────────────────────────────────────────────────────────────

bot.onText(/\/run/, async (msg) => {
  if (!guard(msg)) return
  try {
    if (await isPaused()) {
      return void bot.sendMessage(msg.chat.id, '⏸ Agent is paused. Use /resume first.')
    }
    await bot.sendMessage(msg.chat.id, '⚡ Triggering SEO agent...')
    await triggerWorkflow('seo-agent.yml')
    bot.sendMessage(msg.chat.id,
      '✅ Workflow started\\. New post live in ~2 min\\.\n' +
      '[View progress](https://github.com/avielg-droid/AI-Desk/actions)',
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
    const [targets, posts, paused] = await Promise.all([getKeywordTargets(), getBlogPosts(), isPaused()])
    const published = new Set(posts)
    const remaining = targets.filter(t => !published.has(t.slug))
    const recent = posts.slice(-3).reverse()

    const lines = [
      paused ? '⏸ *Status: PAUSED*' : '▶️ *Status: RUNNING*',
      '',
      `📋 *Queue:* ${remaining.length} remaining / ${targets.length} total`,
      '*Next up:*',
      ...remaining.slice(0, 3).map((t, i) => `  ${i + 1}\\. ${t.keyword.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&')}`),
      '',
      `📝 *Published:* ${posts.length} posts`,
      '*Recent:*',
      ...recent.map(s => `  • ${s.replace(/-/g, ' ').replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&')}`),
    ]
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

// ── Start ──────────────────────────────────────────────────────────────────────

console.log(`🤖 AI Desk SEO Bot started (allowed user: ${ALLOWED_USER_ID})`)
bot.on('error', (err) => console.error('Bot error:', err.message))
bot.on('polling_error', (err) => console.error('Polling error:', err.message))
