// Clicks every interactive surface and asserts state changes. COMMERCIALS.show is true: the milestone cards carry their amounts.
//   BASE=http://localhost:5304 node scripts/interact.mjs
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PW || 'playwright')
const BASE = process.env.BASE || 'http://localhost:5304'
const MESSAGE = 'Hi, I’ve read through the AI Style Assistant proposal. $8,000 over 3 months in eight milestones works for me. Let’s set the start date.'
const fails = []
const ok = (cond, m) => (cond ? console.log(`ok   ${m}`) : (fails.push(m), console.log(`FAIL ${m}`)))
const intent = (p, scope, name, value) => p.locator(`${scope} [data-intent="${name}"]${value ? `[data-value^="${value}"]` : ''}:visible`)

const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write'] })
const p = await ctx.newPage()
const errs = []
p.on('pageerror', (e) => errs.push(e.message))
await p.goto(BASE, { waitUntil: 'networkidle' })

// hero: screen buttons swap the device
await intent(p, '#top', 'hero_screen').nth(1).click()
await p.waitForTimeout(400)
ok((await intent(p, '#top', 'hero_screen').nth(1).getAttribute('aria-pressed')) === 'true', 'hero screen button selects the second screen')
ok((await p.locator('#top [data-mock][data-screen="home"]').count()) === 1, 'hero device shows the Home screen')

// constraints: a title activates its detail and its drawing
await p.locator('#constraints [data-intent="flip_constraint"]:visible').nth(1).click()
await p.waitForTimeout(400)
ok((await p.locator('#constraints [data-intent="flip_constraint"][aria-pressed="true"]:visible').count()) >= 1, 'a constraint activates')
ok((await p.locator('#constraint-detail', { hasText: /adapter/i }).count()) > 0, 'the membership-layer constraint shows its adapters')

// flow: a step becomes current and the pinned device follows
await p.locator('#flow [data-intent="flow_step"][data-value="analysis"]:visible').first().click()
await p.waitForTimeout(900)
{
  const cur = await p.locator('#flow [aria-current="step"]').allTextContents()
  ok(cur.length >= 1 && cur.every((t) => /grade|analysis/i.test(t)), 'flow step 6 (read the grade) becomes current')
  ok((await p.locator('#flow [data-mock][data-screen="analysis"]').count()) >= 1, 'the pinned phone shows the Analysis screen')
}

// roles: tabs swap the feature index and the device; arrow keys move between tabs
await p.click('#role-tab-admin')
await p.waitForTimeout(500)
ok(/System Administrator/.test(await p.textContent('#role-panel')), 'admin tab shows the administrator')
ok((await p.locator('#role-panel [data-mock][data-screen^="admin"]').count()) === 1, 'admin tab shows the laptop')
await p.keyboard.press('ArrowLeft')
await p.waitForTimeout(500)
ok(/Colour analysis quiz/.test(await p.textContent('#role-panel')), 'arrow key moves back to the member tab')
await p.locator('#roles button', { hasText: /^Cohesion$/ }).first().focus()
ok((await p.locator('[role="tooltip"]').count()) === 1, 'Cohesion tooltip opens on keyboard focus')

// architecture: selecting the bottom layer opens its detail
await p.locator('#architecture button[aria-pressed][data-value^="L1"]:not([aria-hidden="true"]):visible').first().click()
await p.waitForTimeout(500)
ok(/S3|AWS|hosting/i.test(await p.textContent('#arch-detail')), 'architecture L1 detail opens (hosting and storage)')

// milestones: a card opens its dialog with scope, deliverable and the amount for that field
await intent(p, '#milestones', 'open_milestone', 'M03').first().click()
await p.waitForTimeout(500)
const sheet = p.locator('[role="dialog"]')
ok((await sheet.count()) === 1 && /navigable and responsive/.test(await sheet.textContent()), 'milestone 03 dialog shows its deliverable')
ok(/\$1,200/.test(await sheet.textContent()) && /\$2,800 of \$8,000/.test(await sheet.textContent()), 'milestone 03 dialog shows $1,200 and the running total')
await p.keyboard.press('Escape')
await p.waitForTimeout(1200)
ok((await p.locator('[role="dialog"]').count()) === 0, 'Esc closes the milestone dialog')
ok((await p.locator('#pay-chart').count()) === 1, 'the payment schedule chart is present')

// terms: ninety days, then opt-in
ok(/Ninety days of free support and maintenance/.test(await p.textContent('#terms')), 'terms carry ninety days of free support')
ok(/\$500 \/ month/.test(await p.textContent('#terms')), 'terms carry the $500 a month opt-in')

// FAQ: one open at a time
await p.locator('#terms h3 button').nth(2).click()
ok((await p.locator('#terms h3 [aria-expanded="true"]').count()) === 1, 'FAQ keeps one item open')

// close: Accept copies the start message and seals the slip
await intent(p, '#start', 'accept').first().click()
await p.waitForTimeout(2600)
ok((await p.evaluate(() => navigator.clipboard.readText())) === MESSAGE, 'Accept copies the start message')
ok((await p.locator('#start', { hasText: /accepted/i }).count()) > 0, 'the slip is sealed accepted')
ok((await p.locator('#start', { hasText: /QA, deployment and stores/ }).count()) > 0, 'the slip carries the last field')

// theme toggle
const before = await p.evaluate(() => document.documentElement.dataset.theme)
await p.locator('[data-intent="toggle_theme"]').click()
ok((await p.evaluate(() => document.documentElement.dataset.theme)) !== before, 'theme toggles')

// nav overlay opens and lists every field
await p.locator('[data-intent="open_menu"]').click()
await p.waitForTimeout(400)
ok((await p.locator('#nav-overlay a').count()) >= 12, 'menu overlay lists all twelve fields')
await p.keyboard.press('Escape')

ok(errs.length === 0, `no page errors (${errs.join(' | ').slice(0, 80)})`)

// marquee: a click on a mark inside the loop copy opens the site in a new tab (motion on)
const ctx2 = await b.newContext({ viewport: { width: 1440, height: 900 } })
const p2 = await ctx2.newPage()
await p2.goto(BASE, { waitUntil: 'networkidle' })
await p2.locator('#clients').scrollIntoViewIfNeeded()
const copyLink = p2.locator('#clients [aria-hidden="true"] a').first()
ok((await copyLink.getAttribute('tabindex')) === '-1', 'marquee copy links leave the tab order')
const [popup] = await Promise.all([ctx2.waitForEvent('page'), copyLink.click({ force: true })])
ok(/clientify/.test(popup.url()), `marquee copy link opens ${popup.url().slice(0, 40)}`)

await b.close()
if (fails.length) {
  console.log(`\nINTERACT FAILED: ${fails.length}`)
  process.exit(1)
}
console.log('\nINTERACT PASSED')
