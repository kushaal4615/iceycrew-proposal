/* FLOW · Archetype: sticky-scroll storyboard. Field 04 on the report. The ProductMock pins in the
   left column and shows the screen of the active step while the right column walks the six steps of
   the member's path; scrolling or clicking a step sets it, and the active step wears its field code.
   Below, the five hand-offs between the app, the backend, Shopify and the AI are written as clauses
   joined by drawn arrows on a plotting grid of the report. */
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { P, type FlowStep } from '../../data/proposal'
import { useMedia } from '../../hooks/useMedia'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/format'
import { Item, Code } from '../ui/bits'
import { Draw, Reveal, SETTLE } from '../ui/motion'
import { ProductMock } from '../ui/ProductMock'

const num = (i: number) => String(i + 1).padStart(2, '0')

export function Flow() {
  const reduced = useReducedMotion()
  const lg = useMedia('(min-width: 1024px)')
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLLIElement | null)[]>([])
  const clickLock = useRef(0)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (Date.now() < clickLock.current) return
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (!hit) return
        const i = refs.current.indexOf(hit.target as HTMLLIElement)
        if (i >= 0) setActive(i)
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 },
    )
    refs.current.forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const pick = (i: number) => {
    setActive(i)
    clickLock.current = Date.now() + 900
    const el = refs.current[i]
    if (el && lg) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
  }

  const step = P.flow[active]

  return (
    <section id="flow" className="section-y relative bg-[var(--ground-2)] [overflow-x:clip]" aria-labelledby="flow-h">
      <div className="shell">
        <Item no="04" time="F-04" name="The member’s path" id="flow-h" lines={['From the order', 'number to the', <>first <em>grade</em>.</>]} aside={`${P.flow.length} steps`} />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* the pinned device: nothing else lives in this column */}
          <div className="hidden min-w-0 lg:block">
            <div className="sticky top-24 flex flex-col items-center gap-5">
              <ProductMock screen={step.screen} tilt="none" size="md" />
              <p className="kicker flex items-center gap-3 text-[var(--ink-3)]" aria-hidden>
                <span className="struck text-[var(--primary-ink)]">{num(active)}</span>
                <span>{step.who}</span>
                <span className="h-3 w-px bg-current opacity-50" />
                <span className="struck">{step.time}</span>
              </p>
            </div>
          </div>

          <ol className="relative min-w-0 border-l-2 border-[var(--rule-strong)]" aria-label="The six steps of the member’s path">
            {P.flow.map((s, i) => (
              <Step key={s.id} step={s} i={i} on={i === active} onPick={() => pick(i)} liRef={(el) => (refs.current[i] = el)} showMock={!lg} />
            ))}
          </ol>
        </div>

        <Interactions />
      </div>
    </section>
  )
}

function Step({ step, i, on, onPick, liRef, showMock }: { step: FlowStep; i: number; on: boolean; onPick: () => void; liRef: (el: HTMLLIElement | null) => void; showMock: boolean }) {
  const reduced = useReducedMotion()
  return (
    <li ref={liRef} className="relative min-w-0 border-b border-[var(--rule)] last:border-b-0">
      <span aria-hidden className="absolute -left-[7px] top-9 block h-3 w-3 rounded-[1px] bg-[var(--ground-2)] ring-2 ring-[var(--rule-strong)]">
        <motion.span className="block h-full w-full bg-[var(--primary)]" initial={false} animate={{ scale: on ? 1 : 0 }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 28 }} />
      </span>
      <button
        type="button"
        onClick={onPick}
        aria-current={on ? 'step' : undefined}
        data-intent="flow_step"
        data-value={step.id}
        className={cn('group block w-full py-7 pl-7 text-left transition-colors duration-300 lg:pl-8 lg:pr-6', on ? 'text-[var(--ink)]' : 'text-[var(--ink-3)]')}
      >
        <span className="kicker flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-bold">Field 04.{num(i)}</span>
          <span className={cn('inline-flex min-h-6 items-center rounded-[var(--r-pill)] px-2.5 normal-case tracking-[0.04em] transition-colors duration-300', on ? 'bg-[var(--primary-soft)] text-[var(--primary-ink)]' : 'bg-[var(--ground)] text-[var(--ink-3)]')}>{step.who}</span>
          <span className="ml-auto inline-flex min-h-6 items-center">{on ? <Code time={step.time} size="sm" tone="ink" /> : <span className="struck text-[0.8rem]">{step.time}</span>}</span>
        </span>
        <span className="display mt-3 block text-[clamp(1.75rem,1.3rem+1.6vw,2.6rem)] leading-[0.95] transition-transform duration-300 ease-[var(--ease-turn)] group-hover:translate-x-1">{step.title}</span>
        <span className={cn('measure mt-3 block text-[length:var(--fs-body)] leading-relaxed transition-colors duration-300', on ? 'text-[var(--ink-2)]' : 'text-[var(--ink-3)]')}>{step.body}</span>
      </button>
      {showMock && (
        <AnimatePresence initial={false}>
          {on && (
            <motion.div
              key={step.screen}
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.45, ease: SETTLE }}
              className="flex justify-center pb-8 pl-7"
            >
              <ProductMock screen={step.screen} tilt="none" size="sm" />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </li>
  )
}

/* ------------------------------------------------------------------ the five hand-offs */

function Interactions() {
  const md = useMedia('(min-width: 768px)')
  return (
    <Reveal className="mt-20 lg:mt-28">
      <div className="card px-5 pb-8 pt-7 sm:px-14 sm:pb-10">
        <p className="kicker flex flex-wrap items-center gap-x-4 gap-y-2 border-b-2 border-[var(--ink)] pb-2 text-[var(--ink)]">
          <span className="font-bold">How the parts hand off</span>
          <span className="normal-case text-[var(--ink-3)]">the app, the backend, Shopify and the AI</span>
          <span className="struck ml-auto text-[var(--ink-3)]">{P.interactions.length}</span>
        </p>
        <ol className="plot mt-4">
          {P.interactions.map((it, k) => (
            <li key={it.name} className="grid min-w-0 gap-x-10 gap-y-0 border-b border-[var(--rule-strong)] py-4 last:border-b-0 md:grid-cols-[13rem_minmax(0,1fr)] md:items-start">
              <h3 className="flex items-baseline gap-3 font-[family-name:var(--font-body)] text-[length:var(--fs-small)] font-semibold leading-8 tracking-[0.02em] text-[var(--ink)]" style={{ letterSpacing: 0 }}>
                <span className="struck text-[var(--primary-ink)]">{num(k)}</span>
                {it.name}
              </h3>
              <div className={cn('flex min-w-0', md ? 'flex-row items-start gap-2' : 'flex-col gap-0')}>
                {it.chain.map((c, j) => (
                  <div key={c} className="contents">
                    <p className={cn('min-w-0 text-[0.9375rem] leading-8 text-[var(--ink-2)]', md ? 'flex-1' : '')}>{c}</p>
                    {j < it.chain.length - 1 && <Arrow down={!md} delay={0.15 * j + 0.1 * k} />}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  )
}

function Arrow({ down, delay }: { down: boolean; delay: number }) {
  return down ? (
    <svg width="18" height="32" viewBox="0 0 18 32" className="ml-1 shrink-0 text-[var(--primary-ink)]" aria-hidden>
      <Draw d="M9 4 V26 M3 20 L9 27 L15 20" delay={delay} strokeWidth={1.8} />
    </svg>
  ) : (
    <svg width="44" height="18" viewBox="0 0 44 18" className="mx-1 mt-[7px] shrink-0 text-[var(--primary-ink)]" aria-hidden>
      <Draw d="M2 9 H38 M31 3 L39 9 L31 15" delay={delay} strokeWidth={1.8} />
    </svg>
  )
}
