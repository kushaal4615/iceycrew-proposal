// Playwright screenshot walk: full page at five widths in both themes (motion settled via reduced
// motion), plus start/middle/end captures of the pinned milestone track and the architecture stack.
//   PW=<path to playwright> BASE=http://localhost:5304 node scripts/shoot.mjs
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PW || 'playwright')
const BASE = process.env.BASE || 'http://localhost:5304'
const WIDTHS = [320, 375, 768, 1024, 1440]

const b = await chromium.launch()
for (const theme of ['light', 'dark']) {
  for (const w of WIDTHS) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce', colorScheme: theme })
    const p = await ctx.newPage()
    await p.addInitScript((t) => localStorage.setItem('proposal-theme', t), theme)
    await p.goto(BASE, { waitUntil: 'networkidle' })
    // walk the page once so every lazy image decodes before the full-page capture
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 60))
      }
      window.scrollTo(0, 0)
    })
    await p.waitForLoadState('networkidle')
    await p.waitForTimeout(600)
    // Chromium cannot paint one capture taller than 16,384px, so shoot section by section
    const ids = await p.evaluate(() => [...document.querySelectorAll('main > section, body > div > section')].map((s) => s.id))
    for (const [i, id] of ids.entries()) await p.locator(`#${id}`).screenshot({ path: `shots/${theme}-${w}-${String(i).padStart(2, '0')}-${id}.png` })
    await ctx.close()
  }
}
// pinned milestone track, motion on, 1440
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
const p = await ctx.newPage()
await p.goto(BASE, { waitUntil: 'networkidle' })
const box = await p.evaluate(() => { const s = document.getElementById('milestones'); return { top: s.offsetTop, h: s.offsetHeight } })
for (const [name, f] of [['start', 0.02], ['middle', 0.5], ['end', 0.98]]) {
  await p.evaluate((y) => window.scrollTo(0, y), box.top + (box.h - 900) * f)
  await p.waitForTimeout(700)
  await p.screenshot({ path: `shots/milestones-${name}.png` })
}
// architecture with the bottom layer selected
await p.evaluate(() => document.getElementById('architecture').scrollIntoView())
await p.waitForTimeout(500)
await p.locator('#architecture button[aria-pressed][data-value^="L1"]:not([aria-hidden="true"]):visible').first().click()
await p.waitForTimeout(700)
await p.screenshot({ path: 'shots/architecture-L1.png' })
// hero, motion on, first viewport
await p.evaluate(() => window.scrollTo(0, 0))
await p.mouse.move(1180, 420)
await p.waitForTimeout(2600)
await p.screenshot({ path: 'shots/hero-1440.png' })
await b.close()
console.log('shots written')
