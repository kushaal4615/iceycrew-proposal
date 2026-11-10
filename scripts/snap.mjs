/** Quick screenshots: node scripts/snap.mjs <outdir> <sectionId|top> [...] [--w=1440] [--h=900] [--theme=dark] [--offset=N] [--full]
 *  Scrolls the section to the top of the viewport (plus offset px) and captures one viewport. */
import { chromium } from 'playwright'
const a = process.argv.slice(2)
const out = a[0]
const opt = (k, d) => (a.find((x) => x.startsWith(`--${k}=`)) || `--${k}=${d}`).split('=')[1]
const w = +opt('w', 1440), h = +opt('h', 900), theme = opt('theme', 'light'), offset = +opt('offset', 0)
const full = a.includes('--full')
const ids = a.slice(1).filter((x) => !x.startsWith('--'))
const b = await chromium.launch()
const p = await (await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })).newPage()
const errs = []
p.on('pageerror', (e) => errs.push(e.message))
p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()) })
await p.goto(`${process.env.BASE || 'http://localhost:5304'}/?theme=${theme}`, { waitUntil: 'networkidle' })
await p.waitForTimeout(1200)
for (const id of ids) {
  await p.evaluate(([id, off]) => { const el = document.getElementById(id); const y = el ? el.getBoundingClientRect().top + scrollY + off : 0; window.scrollTo({ top: y, behavior: 'instant' }) }, [id, offset])
  await p.waitForTimeout(1100)
  await p.screenshot({ path: `${out}/p_${id}_${w}${theme === 'dark' ? '_dark' : ''}${offset ? '_o' + offset : ''}.png`, fullPage: full })
}
console.log(errs.length ? 'ERRORS:\n' + [...new Set(errs)].join('\n') : 'no errors')
await b.close()
