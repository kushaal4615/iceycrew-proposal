// Template detector + contrast + overflow + overlap + images. Exits 1 on any failure.
//   PW=<path to playwright> BASE=http://localhost:5304 node scripts/audit.mjs
import { createRequire } from 'node:module'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
const require = createRequire(import.meta.url)
const pw = require(process.env.PW || 'playwright')
const BASE = process.env.BASE || 'http://localhost:5304'
const ROOT = new URL('..', import.meta.url).pathname
const VENDORS = (process.env.VENDORS || 'indi it,indiit,indi-it,kunal,kushaal,fiverr').split(',').map((s) => s.trim().toLowerCase())
const fails = []
const fail = (k, m) => fails.push(`[${k}] ${m}`)

/* ---------- static checks ---------- */
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]))
for (const f of walk(join(ROOT, 'src/components'))) {
  const s = readFileSync(f, 'utf8')
  const hex = s.match(/#[0-9a-fA-F]{3,8}\b/g)?.filter((h) => !/#(top|overview|constraints|flow|roles|architecture|milestones|deliverables|later|clients|terms|start|arch-detail|role-panel|nav-overlay|pay-chart)/.test(h))
  if (hex?.length) fail('hex', `${f.replace(ROOT, '')}: ${hex.join(' ')}`)
}
for (const f of [...walk(join(ROOT, 'src')), join(ROOT, 'index.html'), join(ROOT, 'package.json')]) {
  if (!/\.(tsx?|css|html|json|md)$/.test(f)) continue
  const s = readFileSync(f, 'utf8').toLowerCase()
  for (const v of VENDORS) if (v && s.includes(v)) fail('vendor', `${f.replace(ROOT, '')} mentions "${v}"`)
}
for (const f of walk(join(ROOT, 'src/assets/img')).filter((f) => /\.(jpe?g|png|webp)$/.test(f))) {
  const kb = statSync(f).size / 1024
  if (kb > 300) fail('image-size', `${f.replace(ROOT, '')} is ${kb.toFixed(0)} KB`)
}

/* no cost, no timeline, no percentage while COMMERCIALS.show is false */
{
  const data = readFileSync(join(ROOT, 'src/data/proposal.ts'), 'utf8')
  const off = /show:\s*false/.test(data)
  if (off) {
    const b = await (await pw.chromium.launch()).newPage({ viewport: { width: 1440, height: 900 } })
    await b.goto(BASE, { waitUntil: 'networkidle' })
    const text = await b.evaluate(() => document.body.innerText)
    const hits = text.match(/\$\s?\d[\d,]*|\b\d+\s?%|\b\d+(?:–|-)\d+\s+(?:months?|weeks?)\b|\b\d+\s+(?:months?|weeks?)\s+(?:to|of)\s+(?:build|delivery)/gi)?.filter((h) => !/12 months|110%/i.test(h))
    if (hits?.length) fail('commercials', `page mentions ${[...new Set(hits)].join(', ')} while COMMERCIALS.show is false`)
    await b.context().browser().close()
  }
}

/* ---------- browser checks ---------- */
const WIDTHS = [320, 375, 768, 1024, 1440]
const b = await pw.chromium.launch()
for (const theme of ['light', 'dark']) {
  for (const w of WIDTHS) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' })
    const p = await ctx.newPage()
    await p.addInitScript((t) => localStorage.setItem('proposal-theme', t), theme)
    await p.goto(BASE, { waitUntil: 'networkidle' })
    await p.waitForTimeout(400)
    const r = await p.evaluate(() => {
      const out = { overflow: document.documentElement.scrollWidth > window.innerWidth + 1, contrast: [], centered: 0, external: [], containers: 0, grids3: 0 }
      const parse = (c) => {
        const m = c.match(/rgba?\(([^)]+)\)/)
        if (!m) return null
        const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number)
        return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }
      }
      const lum = ({ r, g, b }) => {
        const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
      }
      const bgOf = (el) => {
        let e = el
        while (e) {
          const s = getComputedStyle(e)
          if (s.backgroundImage.includes('url(') || e.tagName === 'IMG') return null
          const c = parse(s.backgroundColor)
          if (c && c.a > 0.85) return c
          // an absolutely positioned backplate sibling (a sliding pill) counts as the background
          for (const sib of e.parentElement ? [...e.parentElement.children] : []) {
            if (sib === e || getComputedStyle(sib).position !== 'absolute' || getComputedStyle(sib).visibility === 'hidden' || /rotateX\(180/.test(sib.className)) continue
            const a = sib.getBoundingClientRect(), r = el.getBoundingClientRect()
            const sc = parse(getComputedStyle(sib).backgroundColor)
            if (sc && sc.a > 0.85 && a.left <= r.left && a.right >= r.right && a.top <= r.top && a.bottom >= r.bottom) return sc
          }
          e = e.parentElement
        }
        return parse(getComputedStyle(document.body).backgroundColor)
      }
      for (const el of document.querySelectorAll('body *')) {
        if (el.closest('[aria-hidden="true"]') || el.closest('.evidence') || el.closest('svg') || el.closest('[data-mock]')) continue
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)
        if (!own) continue
        const rect = el.getBoundingClientRect()
        if (!rect.width || getComputedStyle(el).visibility === 'hidden' || el.closest('.sr-only')) continue
        // text sitting over a photo is judged by its own scrim/backdrop, skip unknown composites
        const bg = bgOf(el)
        if (!bg) continue
        const fg = parse(getComputedStyle(el).color)
        if (!fg) continue
        const op = parseFloat(getComputedStyle(el).opacity)
        if (op < 0.9 || fg.a < 0.9) continue
        const L1 = lum(fg), L2 = lum(bg)
        const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
        const size = parseFloat(getComputedStyle(el).fontSize)
        const need = size >= 24 ? 3 : 4.5
        if (ratio < need) out.contrast.push(`${ratio.toFixed(2)} "${el.textContent.trim().slice(0, 28)}"`)
      }
      out.centered = [...document.querySelectorAll('h2')].filter((h) => getComputedStyle(h).textAlign === 'center').length
      out.external = [...document.querySelectorAll('img')].map((i) => i.getAttribute('src')).filter((s) => /^https?:/.test(s))
      // container families: elements with border + radius + shadow and >= 3 siblings of the same signature
      const sig = new Map()
      for (const el of document.querySelectorAll('main *')) {
        const s = getComputedStyle(el)
        if (s.borderTopWidth === '0px' || s.boxShadow === 'none' || s.borderTopLeftRadius === '0px') continue
        const k = `${s.borderTopWidth}|${s.borderTopLeftRadius}|${s.boxShadow}`
        sig.set(k, (sig.get(k) || 0) + 1)
      }
      out.containers = [...sig.values()].filter((n) => n >= 3).length
      // 3-column grids, per section
      const sections = new Set()
      for (const el of document.querySelectorAll('main [class*="grid"]')) {
        if (el.closest('[aria-hidden="true"]') || el.closest('[data-mock]') || el.getAttribute('role') === 'row') continue
        const cols = getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length
        // a 3-column CARD grid: four or more items laid out three across (rows with exactly three cells,
        // such as number | text | stamp in a ledger, are table rows, not a grid of cards)
        if (cols === 3 && el.children.length >= 4) sections.add(el.closest('section')?.id)
      }
      out.grid3ids = [...sections].join(',')
      out.grids3 = sections.size
      return out
    })
    const tag = `${theme} ${w}`
    if (r.overflow) fail('overflow', `${tag}: page scrolls horizontally`)
    if (r.contrast.length) fail('contrast', `${tag}: ${r.contrast.slice(0, 6).join('; ')}`)
    if (r.centered > 2) fail('centered-h2', `${tag}: ${r.centered}`)
    if (r.external.length) fail('external-img', `${tag}: ${r.external.join(', ')}`)
    if (r.containers > 1) fail('container-families', `${tag}: ${r.containers}`)
    if (r.grids3 > 1) fail('3-col-grids', `${tag}: in ${r.grids3} sections (${r.grid3ids})`)
    await ctx.close()
  }
}

/* overlap sweep at 1440 and 390, one viewport at a time */
for (const w of [1440, 390]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' })
  const p = await ctx.newPage()
  await p.goto(BASE, { waitUntil: 'networkidle' })
  const H = await p.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < H; y += 900) {
    await p.evaluate((y) => window.scrollTo(0, y), y)
    await p.waitForTimeout(80)
    const hits = await p.evaluate(() => {
      const blocks = [...document.querySelectorAll('main h1, main h2, main h3, main p, main dd, main dt, main li > button')].filter((e) => {
        if (e.closest('[data-mock]')) return false
        const r = e.getBoundingClientRect()
        return r.width > 0 && r.bottom > 56 && r.top < window.innerHeight && !e.closest('[aria-hidden="true"]') && !e.closest('.sr-only') && getComputedStyle(e).position !== 'absolute'
      })
      const devices = [...document.querySelectorAll('main [data-mock]')]
      const out = []
      const area = (r) => r.width * r.height
      const inter = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
      for (let i = 0; i < blocks.length; i++)
        for (let j = i + 1; j < blocks.length; j++) {
          const A = blocks[i], B = blocks[j]
          if (A.contains(B) || B.contains(A)) continue
          const a = A.getBoundingClientRect(), bb = B.getBoundingClientRect()
          if (inter(a, bb) > 0.25 * Math.min(area(a), area(bb))) out.push(`"${A.textContent.trim().slice(0, 20)}" × "${B.textContent.trim().slice(0, 20)}"`)
        }
      for (const d of devices) {
        const dr = d.getBoundingClientRect()
        for (const t of blocks) if (!d.contains(t) && inter(dr, t.getBoundingClientRect()) > 4) out.push(`device × "${t.textContent.trim().slice(0, 20)}"`)
      }
      return out
    })
    if (hits.length) fail('overlap', `${w} @${y}: ${hits.slice(0, 4).join('; ')}`)
  }
  await ctx.close()
}

/* scrub track: first sheet inside at start, last sheet inside at end (motion on, 1440) */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const p = await ctx.newPage()
  await p.goto(BASE, { waitUntil: 'networkidle' })
  const m = await p.evaluate(() => { const s = document.getElementById('milestones'); return { top: s.offsetTop, h: s.offsetHeight } })
  for (const [label, y, pick] of [['start', m.top, 'first'], ['end', m.top + m.h - 900, 'last']]) {
    await p.evaluate((y) => window.scrollTo(0, y), y)
    await p.waitForTimeout(700)
    const r = await p.evaluate((pick) => {
      const lis = document.querySelectorAll('#milestones ol > li')
      const li = pick === 'first' ? lis[0] : lis[lis.length - 1]
      const r = li.getBoundingClientRect()
      return { left: r.left, right: r.right, vw: window.innerWidth }
    }, pick)
    if (r.left < 0 || r.right > r.vw) fail('scrub', `${label}: sheet at ${Math.round(r.left)}..${Math.round(r.right)}`)
  }
  await ctx.close()
}
await b.close()

/* images decode in Chrome and Firefox */
for (const engine of ['chromium', 'firefox']) {
  const br = await pw[engine].launch()
  const p = await br.newPage({ viewport: { width: 1440, height: 900 } })
  await p.goto(BASE, { waitUntil: 'networkidle' })
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 80))
    }
  })
  await p.waitForLoadState('networkidle')
  await p.waitForTimeout(800)
  const bad = await p.evaluate(() => [...document.querySelectorAll('.evidence img')].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.alt))
  if (bad.length) fail('images', `${engine}: ${bad.join(', ')}`)
  await br.close()
}

if (fails.length) {
  console.log(fails.join('\n'))
  console.log(`\nAUDIT FAILED: ${fails.length}`)
  process.exit(1)
}
console.log('AUDIT PASSED')
