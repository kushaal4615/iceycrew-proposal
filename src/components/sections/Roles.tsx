/* ROLES · Archetype: gapless bento. Field 05 on the report, "Who holds the report". One ink band; cells
   are separated only by 1px of the band's rule showing through the grid gap, and the whole grid is
   revealed with a single clip-path wipe, never cell by cell. Two tabs, the VIP member and the system
   administrator, swap the device (the phone for the member, the laptop for the admin) and the numbered
   feature index; the ten platform features and the three data notes fill the remaining cells; one cell
   is the role's portrait, laid in as a plate. */
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { P, type Role } from '../../data/proposal'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/format'
import { Item, Photo, Term } from '../ui/bits'
import { SETTLE } from '../ui/motion'
import { ProductMock } from '../ui/ProductMock'

const num = (i: number) => String(i + 1).padStart(2, '0')

/* on the band, tooltips, soft fills and the gold-family text invert so they stay readable */
const BAND_VARS = {
  '--toast-bg': 'var(--on-band)',
  '--toast-ink': 'var(--ink-band)',
  '--primary': 'var(--close-primary)',
  '--primary-ink': 'var(--gold-300)',
  '--primary-soft': 'rgb(230 179 22 / 0.18)',
  '--card': 'var(--ink-band)',
} as CSSProperties

export function Roles() {
  const reduced = useReducedMotion()
  const [idx, setIdx] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const gridRef = useRef<HTMLDivElement>(null)
  const seen = useInView(gridRef, { once: true, amount: 0.08 })
  const role = P.roles[idx]

  const select = (i: number, focus = false) => {
    const n = (i + P.roles.length) % P.roles.length
    setIdx(n)
    if (focus) tabs.current[n]?.focus()
  }
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      select(idx + 1, true)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      select(idx - 1, true)
    } else if (e.key === 'Home') {
      e.preventDefault()
      select(0, true)
    } else if (e.key === 'End') {
      e.preventDefault()
      select(P.roles.length - 1, true)
    }
  }

  const swap = {
    initial: reduced ? { opacity: 1 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, transition: { duration: 0.12 } },
    transition: { duration: 0.4, ease: SETTLE },
  }

  return (
    <section id="roles" className="section-y relative bg-[var(--ink-band)] text-[var(--on-band)] [overflow-x:clip]" aria-labelledby="roles-h" style={BAND_VARS}>
      <div className="shell">
        <Item no="05" time="F-05" name="Who holds the report" id="roles-h" lines={['Two people', 'read the report.']} tone="close" aside={`${P.roles.length} roles`} />

        {/* the observer watches the unclipped wrapper: a clip-path on the grid itself would hide it from the intersection check */}
        <div ref={gridRef} className="mt-14 lg:mt-20">
          <motion.div
            className="grid gap-px bg-[var(--band-rule)] lg:grid-cols-12"
            initial={false}
            animate={{ clipPath: reduced || seen ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)' }}
            transition={{ duration: reduced ? 0 : 1.1, ease: SETTLE }}
          >
            {/* the tabs: one cell across the top, two readers */}
            <div role="tablist" aria-label="Roles" onKeyDown={onKey} className="grid min-w-0 grid-cols-2 gap-px bg-[var(--band-rule)] lg:col-span-12">
              {P.roles.map((r, i) => {
                const on = i === idx
                return (
                  <button
                    key={r.id}
                    ref={(el) => (tabs.current[i] = el)}
                    type="button"
                    role="tab"
                    id={`role-tab-${r.id}`}
                    aria-selected={on}
                    aria-controls="role-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => select(i)}
                    data-intent="role_tab"
                    data-value={r.id}
                    className={cn('relative flex min-h-16 min-w-0 items-start gap-3 bg-[var(--ink-band)] px-4 py-4 text-left transition-colors duration-200 sm:px-6', on ? 'text-[var(--on-band)]' : 'text-[var(--on-band-2)] hover:text-[var(--on-band)]')}
                  >
                    <span className="struck shrink-0 pt-1 text-[0.8rem] text-[var(--primary-ink)]">{num(i)}</span>
                    <span className="min-w-0">
                      <span className="display block text-[clamp(1.1rem,0.9rem+0.9vw,1.45rem)] leading-[1.05]">{r.name}</span>
                      <span className="kicker mt-1 block normal-case tracking-normal text-[var(--on-band-2)]">{r.device}</span>
                    </span>
                    {on && <motion.span layoutId="role-tab-rule" aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-[var(--close-cta)]" transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 32 }} />}
                  </button>
                )
              })}
            </div>

            {/* the panel: a real element, itself a gapless grid in the same band */}
            <div id="role-panel" role="tabpanel" aria-labelledby={`role-tab-${role.id}`} className="grid min-w-0 gap-px bg-[var(--band-rule)] lg:col-span-12 lg:grid-cols-12">
              {/* the role's line */}
              <div className="min-w-0 bg-[var(--ink-band)] p-6 sm:p-8 lg:col-span-4">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={role.id} {...swap}>
                    <p className="kicker flex items-center gap-3 text-[var(--on-band-2)]">
                      <span className="struck text-[var(--primary-ink)]">{num(idx)}</span>
                      <span>{role.device}</span>
                    </p>
                    <h3 className="mt-4 text-[clamp(2rem,1.4rem+2.4vw,3.4rem)] text-[var(--on-band)]">{role.name}</h3>
                    <p className="mt-5 max-w-[34ch] text-[1.125rem] leading-snug text-[var(--on-band)]">{role.line}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* the device: the phone for the member, the laptop for the administrator */}
              <div className="flex min-w-0 items-center justify-center overflow-hidden bg-[var(--ink-band)] p-6 sm:p-8 lg:col-span-4 lg:row-span-2">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={role.screen} {...swap} className="flex max-w-full justify-center">
                    <ProductMock screen={role.screen} tilt="none" size="md" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* the numbered feature index */}
              <div className="min-w-0 bg-[var(--ink-band)] p-6 sm:p-8 lg:col-span-4 lg:row-span-2">
                <p className="kicker flex items-center gap-3 border-b border-[var(--band-rule)] pb-2 text-[var(--on-band-2)]">
                  <span>Feature index</span>
                  <span className="struck ml-auto text-[var(--primary-ink)]">{role.features.length}</span>
                </p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.ol key={role.id} initial="hide" animate="show" exit="exit" className="mt-2" variants={{ show: { transition: { staggerChildren: reduced ? 0 : 0.05 } } }}>
                    {role.features.map((f, i) => (
                      <motion.li
                        key={f.title}
                        variants={{ hide: reduced ? { opacity: 1 } : { opacity: 0, x: 10 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: SETTLE } }, exit: { opacity: 0, transition: { duration: 0.1 } } }}
                        className="flex gap-4 border-b border-[var(--band-rule)] py-3 last:border-b-0"
                      >
                        <span className="struck shrink-0 pt-0.5 text-[0.8rem] text-[var(--primary-ink)]">{num(i)}</span>
                        <span className="min-w-0">
                          <span className="block font-semibold leading-snug text-[var(--on-band)]">{f.title}</span>
                          <span className="mt-0.5 block text-[length:var(--fs-small)] leading-snug text-[var(--on-band-2)]">{f.tip ? <WithTerm text={f.detail} tip={f.tip} /> : f.detail}</span>
                        </span>
                      </motion.li>
                    ))}
                  </motion.ol>
                </AnimatePresence>
              </div>

              {/* the portrait: a plate laid into the report */}
              <div className="relative flex min-w-0 flex-col bg-[var(--ink-band)] lg:col-span-4">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={role.id} initial={reduced ? { opacity: 1 } : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={{ duration: 0.5, ease: SETTLE }} className="flex flex-1 flex-col">
                    {/* the plate fills whatever height the row gives it, never its own intrinsic height */}
                    <span className="relative block aspect-[4/3] w-full lg:aspect-auto lg:min-h-[16rem] lg:flex-1">
                      <Photo img={role.img} className="absolute inset-0 h-full w-full [&_img]:object-[50%_18%]" sizes="(min-width:1024px) 33vw, 100vw" />
                    </span>
                    <p className="kicker flex items-center gap-3 px-6 py-3 text-[var(--on-band-2)] sm:px-8">
                      <span className="struck text-[var(--primary-ink)]">{num(idx)}</span>
                      <span className="truncate">{role.name}</span>
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* the platform underneath: the same ten features for both readers */}
            <div className="min-w-0 bg-[var(--ink-band)] p-6 sm:p-8 lg:col-span-8">
              <p className="kicker flex items-center gap-3 border-b border-[var(--band-rule)] pb-2 text-[var(--on-band-2)]">
                <span>Across the platform</span>
                <span className="struck ml-auto text-[var(--primary-ink)]">{P.featureList.length}</span>
              </p>
              <ol className="mt-2 grid gap-x-8 md:grid-cols-2">
                {P.featureList.map((f, i) => (
                  <li key={f.title} className="flex gap-4 border-b border-[var(--band-rule)] py-3">
                    <span className="struck shrink-0 pt-0.5 text-[0.8rem] text-[var(--primary-ink)]">{num(i)}</span>
                    <span className="min-w-0">
                      <span className="block font-semibold leading-snug text-[var(--on-band)]">{f.title}</span>
                      <span className="mt-0.5 block text-[length:var(--fs-small)] leading-snug text-[var(--on-band-2)]">{f.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* where the data comes from */}
            <div className="flex min-w-0 flex-col bg-[var(--ink-band)] p-6 sm:p-8 lg:col-span-4">
              <p className="kicker flex items-center gap-3 border-b border-[var(--band-rule)] pb-2 text-[var(--on-band-2)]">
                <span>Where the data comes from</span>
                <span className="struck ml-auto text-[var(--primary-ink)]">{P.ingestion.length}</span>
              </p>
              <ol className="mt-2 flex flex-1 flex-col">
                {P.ingestion.map((f, i) => (
                  <li key={f.title} className="flex flex-1 gap-4 border-b border-[var(--band-rule)] py-3 last:border-b-0">
                    <span className="struck shrink-0 pt-0.5 text-[0.8rem] text-[var(--primary-ink)]">{num(i)}</span>
                    <span className="min-w-0">
                      <span className="block font-semibold leading-snug text-[var(--on-band)]">{f.title}</span>
                      <span className="mt-0.5 block text-[length:var(--fs-small)] leading-snug text-[var(--on-band-2)]">{f.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/** Wraps the first occurrence of the term in a tooltip; falls back to appending it. */
function WithTerm({ text, tip }: { text: string; tip: NonNullable<Role['features'][number]['tip']> }) {
  const i = text.toLowerCase().indexOf(tip.term.toLowerCase())
  if (i < 0)
    return (
      <>
        {text} <Term term={tip.term}>{tip.text}</Term>
      </>
    )
  return (
    <>
      {text.slice(0, i)}
      <Term term={text.slice(i, i + tip.term.length)}>{tip.text}</Term>
      {text.slice(i + tip.term.length)}
    </>
  )
}
