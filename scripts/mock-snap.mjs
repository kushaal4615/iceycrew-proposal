import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await (await b.newContext({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 1 })).newPage()
const errs = []
p.on('pageerror', (e) => errs.push(e.message))
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()) })
await p.goto('http://localhost:5304/?mock=1&size=md', { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)
await p.screenshot({ path: 'shots/m/mock.png', fullPage: true })
console.log(errs.length ? 'ERRORS:\n' + [...new Set(errs)].join('\n') : 'no errors')
await b.close()
