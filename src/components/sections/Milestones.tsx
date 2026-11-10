/* Archetype: HORIZONTAL SCROLL-SCRUB TRACK. Field 07 on the report, "Fields and payments".
   The eight fields of the report laid side by side as cards, one per milestone, each inscribed with
   its code (M-01 to M-08). From lg up (and tall enough) the track pins (position: sticky
   inside a tall wrapper; the section clips on x only) and slides left by its MEASURED overflow
   (scrollWidth − clientWidth, ResizeObserver): field 01 starts inside the viewport at the shell edge,
   field 08 ends flush inside it. When every card already fits the window there is nothing to drive, so
   the track does not pin. Under the cards a gold report line fills as the fields are inscribed, one mark
   per field. Clicking a card lifts it off the track (layoutId) into a dialog with its scope, the
   deliverable, when it is paid and the running total. Below the track, still inside the field: the
   payment schedule as a cumulative step chart drawn in SVG, the note on how the milestones work,
   and the four short rules. Reduced motion or small screens: no pin, the track scrolls natively with
   snap, nothing clipped. */
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { MILESTONES, P, TOTAL_COST, timelineLabel, type Phase, type ResolvedMilestone } from '../../data/proposal'
import { CopyAmount, Item, Stamp, Time } from '../ui/bits'
import { Reveal, SETTLE } from '../ui/motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useMedia } from '../../hooks/useMedia'
import { cn, formatMoney } from '../../lib/format'
import { overlayClosed, overlayOpened } from '../../tracker/tracker'

const PHASE: Record<Phase, { word: string; tone: 'ink' | 'primary' }> = {
  define: { word: 'Define', tone: 'ink' },
  build: { word: 'Build', tone: 'ink' },
  release: { word: 'Release', tone: 'primary' },
}
const LAST = MILESTONES.length - 1
const COUNT = String(MILESTONES.length).padStart(2, '0')
const ASIDE = `${MILESTONES.length} fields · ${formatMoney(TOTAL_COST)} · ${timelineLabel}`
/** the first and last card rest a moment before the track moves */
const DWELL = 0.07
/** the track starts on the shell's left edge, wherever the shell sits */
const EDGE = 'max(var(--gutter), calc((100% - var(--shell-max)) / 2 + var(--gutter)))'

export function Milestones() {
  const reduced = useReducedMotion()
  const big = useMedia('(min-width: 1024px) and (min-height: 680px)')
  const [overflow, setOverflow] = useState(0)
  /* nothing to drive when every card already fits the window */
  const pin = big && !reduced && overflow > 0
  const pinRef = useRef(pin)
  pinRef.current = pin

  const scrubRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)
  const overflowMV = useMotionValue(0)

  /* how far the track must travel: its full width minus the visible window */
  useLayoutEffect(() => {
    const view = viewRef.current
    const track = trackRef.current
    if (!view || !track) return
    const measure = () => {
      const o = Math.max(0, Math.ceil(track.scrollWidth - view.clientWidth))
      setOverflow(o)
      overflowMV.set(o)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(view)
    ro.observe(track)
    return () => ro.disconnect()
  }, [overflowMV, pin])

  const { scrollYProgress } = useScroll({ target: scrubRef, offset: ['start start', 'end end'] })
  const { scrollXProgress } = useScroll({ container: viewRef })
  const scrub = useTransform(scrollYProgress, (p) => Math.min(1, Math.max(0, (p - DWELL) / (1 - DWELL * 2))))
  const x = useTransform([scrub, overflowMV], ([p, o]: number[]) => (pinRef.current ? -p * o : 0))
  const prog = useTransform([scrub, scrollXProgress], ([a, b]: number[]) => (pinRef.current ? a : b))

  const [at, setAt] = useState(0)
  useMotionValueEvent(prog, 'change', (v) => {
    const i = Math.round(v * LAST)
    setAt((p) => (p === i ? p : i))
  })

  const [open, setOpen] = useState<string | null>(null)
  const openIdx = MILESTONES.findIndex((m) => m.id === open)
  useEffect(() => {
    if (!open) return
    const name = `item-${open}`
    overlayOpened(name)
    return () => overlayClosed(name)
  }, [open])
  const lastOpen = useRef<string | null>(null)
  /* the card remounts when its dialog closes, so focus returns by id, not by a stale ref */
  const close = useCallback(() => {
    setOpen(null)
    const id = lastOpen.current
    window.setTimeout(() => {
      trackRef.current?.querySelector<HTMLElement>(`[data-card="${id}"]`)?.focus({ preventScroll: true })
    }, 0)
  }, [])
  const openAt = (m: ResolvedMilestone) => {
    lastOpen.current = m.id
    setOpen(m.id)
  }

  /* keyboard users tabbing a pinned track: scroll the page so the focused card sits in the window */
  const bringIntoView = (i: number) => {
    if (!pinRef.current || !scrubRef.current) return
    const el = scrubRef.current
    const top = el.getBoundingClientRect().top + window.scrollY
    const travel = el.offsetHeight - window.innerHeight
    const p = DWELL + (i / LAST) * (1 - DWELL * 2)
    window.scrollTo({ top: top + travel * p, behavior: 'instant' as ScrollBehavior })
  }

  const cur = MILESTONES[at]

  return (
    <section id="milestones" aria-labelledby="milestones-h" className="relative [overflow-x:clip] pt-[var(--section-y)]">
      <div className="shell">
        <div className="grid min-w-0 gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
          <Item
            no="07"
            time="F-07"
            name="Fields and payments"
            id="milestones-h"
            lines={[
              'Eight fields.',
              <span key="e">
                Nothing due <em>between.</em>
              </span>,
            ]}
            aside={ASIDE}
          />
          <p className="kicker min-w-0 text-[var(--ink-3)] lg:pb-4">Open any field for its scope, its deliverable and when it is paid</p>
        </div>
      </div>

      {/* ---------------------------------------------------------- the track */}
      <div
        ref={scrubRef}
        className="pointer-events-none relative"
        style={pin ? { height: `calc(100svh + ${Math.round(overflow * 1.15)}px)`, marginTop: 'min(0px, calc(20rem - 50svh))' } : undefined}
      >
        <div className={cn('[&>*]:pointer-events-auto', pin ? 'sticky top-0 flex h-[100svh] flex-col justify-center pt-14' : 'pt-10')}>
          <div
            ref={viewRef}
            role={pin ? undefined : 'region'}
            aria-label={pin ? undefined : 'The fields of the report, scroll sideways'}
            tabIndex={pin ? undefined : 0}
            className={cn('relative min-w-0', pin ? '[overflow-x:clip]' : 'snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:thin]')}
            style={pin ? undefined : { scrollPaddingInline: EDGE }}
          >
            <motion.ol ref={trackRef} style={{ ...(pin ? { x } : {}), paddingInline: EDGE } as CSSProperties} className="m-0 flex w-max list-none gap-5 pb-7 pt-3 lg:gap-7">
              {MILESTONES.map((m, i) => (
                <li key={m.id} className="relative w-[min(78vw,19.5rem)] shrink-0 snap-start lg:w-[21.5rem]">
                  {open === m.id ? (
                    <div aria-hidden className="h-full min-h-[25rem] border border-dashed border-[var(--rule-strong)]" />
                  ) : (
                    <ItemCard m={m} current={pin && at === i} reduced={reduced} onOpen={() => openAt(m)} onFocus={() => bringIntoView(i)} />
                  )}
                </li>
              ))}
            </motion.ol>
          </div>

          {/* the report line: the fields being inscribed, one mark per field, filled by the scroll */}
          <div className="shell mt-1">
            <div className="kicker flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <p className="text-[var(--ink-3)]">
                {pin ? (
                  'Scroll to inscribe the fields'
                ) : overflow > 0 ? (
                  <span className="inline-flex items-center gap-2">
                    Scroll sideways <ArrowRight size={14} aria-hidden />
                  </span>
                ) : (
                  'The report, planning to go-live'
                )}
              </p>
              <p aria-live="polite">
                <span className="text-[var(--ink-3)]">Field </span>
                <span className="font-bold text-[var(--ink)]">{cur.no}</span>
                <span className="text-[var(--ink-3)]"> of {COUNT} · </span>
                <span className="struck font-bold text-[var(--primary-ink)]">{cur.time}</span>
                <span className="text-[var(--ink-3)]"> · </span>
                <span className="font-bold text-[var(--ink)]">{PHASE[cur.phase].word}</span>
              </p>
            </div>
            <ReportLine prog={prog} at={at} />
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------- the payment schedule, still inside the field */}
      <div className="shell mt-16 pb-[var(--section-y)] lg:mt-24">
        <div className="grid min-w-0 gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <Reveal className="min-w-0 lg:col-span-7">
            <p className="kicker flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--ink-3)]">
              <span className="font-bold text-[var(--ink)]">Payment schedule</span>
              <span aria-hidden className="h-3 w-px bg-current opacity-50" />
              <span className="normal-case">Running total after each field, to {formatMoney(TOTAL_COST)}</span>
            </p>
            <h3 className="mt-4 text-[length:clamp(1.6rem,1.2rem+1.2vw,2.4rem)] leading-[0.95]">
              Paid in eight <em>steps.</em>
            </h3>
            <PayChart />
          </Reveal>

          <div className="min-w-0 lg:col-span-5">
            <Reveal>
              <p className="measure text-[var(--ink-2)]">{P.milestoneNote}</p>
            </Reveal>
            {/* a ul, not an ol: the audit reads `#milestones ol > li` as the cards on the track */}
            <ul className="m-0 mt-8 list-none border-t-2 border-[var(--ink)] p-0">
              {P.howItWorks.map((h, i) => (
                <motion.li
                  key={h.title}
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ duration: 0.6, ease: SETTLE, delay: 0.05 * i }}
                  className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-b border-[var(--rule-strong)] py-4"
                >
                  <span className="struck pt-[0.3em] text-[length:var(--fs-micro)] text-[var(--money)]">{String(i + 1).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--ink)]">{h.title}</p>
                    <p className="mt-1 text-[length:var(--fs-small)] text-[var(--ink-2)]">{h.body}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {openIdx >= 0 && <ItemDialog key="dlg" idx={openIdx} reduced={reduced} onClose={close} onGo={(i) => openAt(MILESTONES[i])} />}
      </AnimatePresence>
    </section>
  )
}

/* ------------------------------------------------------------------ the report line under the track */

function ReportLine({ prog, at }: { prog: ReturnType<typeof useTransform<number[], number>>; at: number }) {
  const fill = useTransform(prog, [0, 1], [0, 1])
  return (
    <div className="mt-3">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3">
        <span className="kicker text-[0.625rem] text-[var(--ink-2)]">
          <span className="font-bold">Field {MILESTONES[0].no}</span> <span className="struck normal-case">{MILESTONES[0].time}</span>
        </span>
        <div aria-hidden className="relative h-6 w-full min-w-0">
          {/* the line, unfilled: the rule of the report */}
          <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-[var(--card)] shadow-[inset_0_0_0_1px_var(--rule-strong)]" />
          {/* the fields inscribed so far, in gold */}
          <motion.span className="absolute inset-x-0 top-1/2 h-[3px] origin-left -translate-y-1/2 bg-[var(--cta)]" style={{ scaleX: fill }} />
          {/* one mark per field */}
          {MILESTONES.map((m, i) => (
            <span
              key={m.id}
              className={cn('absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-[var(--r-pill)] border-2 transition-colors duration-200', i <= at ? 'border-[var(--cta)] bg-[var(--cta)]' : 'border-[var(--rule-strong)] bg-[var(--card)]')}
              style={{ left: `${(i / LAST) * 100}%` }}
            />
          ))}
        </div>
        <span className="kicker text-right text-[0.625rem] text-[var(--ink-2)]">
          <span className="font-bold">Field {MILESTONES[LAST].no}</span> <span className="struck normal-case">{MILESTONES[LAST].time}</span>
        </span>
      </div>
      <div aria-hidden className="mt-1 grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-3">
        <span className="kicker invisible text-[0.625rem]">
          Field {MILESTONES[0].no} {MILESTONES[0].time}
        </span>
        <div className="relative h-4 w-full min-w-0">
          {MILESTONES.map((m, i) => (
            <span
              key={m.id}
              className={cn('mono absolute whitespace-nowrap text-[0.6875rem] transition-colors duration-200', i <= at ? 'text-[var(--ink)]' : 'text-[var(--ink-3)]', i === 0 ? 'translate-x-0' : i === LAST ? '-translate-x-full' : '-translate-x-1/2')}
              style={{ left: `${(i / LAST) * 100}%` }}
            >
              <span className="hidden sm:inline">{m.time}</span>
              <span className="sm:hidden">{m.no}</span>
            </span>
          ))}
        </div>
        <span className="kicker invisible text-[0.625rem]">
          Field {MILESTONES[LAST].no} {MILESTONES[LAST].time}
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ one card on the track */

function ItemCard({ m, current, reduced, onOpen, onFocus }: { m: ResolvedMilestone; current: boolean; reduced: boolean; onOpen: () => void; onFocus: () => void }) {
  const ph = PHASE[m.phase]
  return (
    <motion.article
      layoutId={reduced ? undefined : `item-${m.id}`}
      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
      className={cn('card group flex h-full min-h-[25rem] w-full flex-col p-5 transition-[box-shadow,transform] duration-300 ease-[var(--ease-turn)] lg:p-6', current ? 'card-lift lg:-translate-y-1.5' : 'hover:card-lift')}
    >
      {/* the whole upper face opens the field; the amount below is a sibling control, never inside */}
      <motion.button
        type="button"
        data-card={m.id}
        onClick={onOpen}
        onFocus={onFocus}
        data-intent="open_milestone"
        data-value={`M${m.no} ${m.name}`}
        aria-haspopup="dialog"
        whileTap={reduced ? undefined : { scale: 0.985 }}
        className="flex flex-1 flex-col text-left"
      >
        <span className="flex w-full items-start justify-between gap-3">
          <Time time={m.time} label="Field" size="sm" play={false} />
          <Stamp tone={ph.tone} rotate={-1.5} play={false} className="text-[0.62rem]">
            {ph.word}
          </Stamp>
        </span>

        <span className="foil display mt-5 block text-[3.4rem] leading-[0.85]" aria-hidden>
          {m.no}
        </span>
        <span className="sr-only">Field {m.no} of {COUNT}. </span>

        <span className="display mt-3 block text-[length:clamp(1.5rem,1.25rem+0.8vw,1.95rem)] leading-[0.95] text-[var(--ink)]">{m.name}</span>
        <span className="mt-2 block text-[0.8125rem] leading-snug text-[var(--ink-3)]">{m.heading}</span>

        <span className="mt-4 block flex-1 border-t border-[var(--rule-strong)] pt-3 text-[0.9rem] leading-snug text-[var(--ink-2)]">
          <span className="kicker mb-1 block text-[var(--ink-3)]">Deliverable</span>
          {m.deliverable}
        </span>

        <span className="kicker mt-4 inline-flex items-center gap-1 text-[0.625rem] text-[var(--primary-ink)] transition-transform duration-200 group-hover:translate-x-0.5">
          Open the field <ArrowRight size={12} aria-hidden />
        </span>
      </motion.button>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--rule)] pt-3">
        <span className="kicker text-[var(--ink-3)]">
          {m.pct}% · <span className="normal-case">{m.no === MILESTONES[0].no ? 'kick-start' : 'at sign-off'}</span>
        </span>
        <CopyAmount amount={m.amount} label={`Field ${m.no}`} className="text-[1.2rem] font-bold" />
      </div>
    </motion.article>
  )
}

/* ------------------------------------------------------------------ the card lifted off the track */

function ItemDialog({ idx, reduced, onClose, onGo }: { idx: number; reduced: boolean; onClose: () => void; onGo: (i: number) => void }) {
  const m = MILESTONES[idx]
  const ph = PHASE[m.phase]
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const navBtn = 'inline-flex h-11 items-center gap-1.5 rounded-[var(--r-pill)] border border-[var(--rule-strong)] px-4 text-[0.8125rem] font-semibold transition-transform hover:bg-[var(--primary-soft)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto p-4 sm:p-8">
      <motion.div
        aria-hidden
        className="fixed inset-0 bg-[color-mix(in_srgb,var(--close-bg)_64%,transparent)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.18 } }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-dlg-h"
        layoutId={reduced ? undefined : `item-${m.id}`}
        initial={reduced ? { opacity: 0 } : undefined}
        animate={reduced ? { opacity: 1 } : undefined}
        exit={reduced ? { opacity: 0 } : undefined}
        transition={{ type: 'spring', stiffness: 360, damping: 36 }}
        className="card card-lift relative z-10 my-auto w-full max-w-[60rem] p-6 sm:p-10"
      >
        <motion.div key={m.id} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: SETTLE, delay: 0.08 }}>
          <div className="flex items-start justify-between gap-4 border-b-2 border-[var(--ink)] pb-3">
            <div className="kicker flex flex-wrap items-center gap-x-3 gap-y-2">
              <Time time={m.time} label="Field" size="md" play={false} />
              <span className="font-bold">
                Field {m.no} of {COUNT}
              </span>
              <span aria-hidden className="h-3 w-px bg-current opacity-50" />
              <Stamp tone={ph.tone} rotate={-1.5} play={false} className="text-[0.62rem]">
                {ph.word}
              </Stamp>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              data-intent="close_milestone"
              data-value={`M${m.no}`}
              className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-[var(--r-pill)] border border-[var(--rule-strong)] transition-transform hover:bg-[var(--primary-soft)] active:scale-95"
            >
              <X size={18} aria-hidden />
              <span className="sr-only">Close the field</span>
            </button>
          </div>

          <div className="mt-6 grid min-w-0 gap-x-10 gap-y-8 md:grid-cols-[minmax(0,1fr)_16rem]">
            <div className="min-w-0">
              <p className="foil display text-[4rem] leading-[0.85]" aria-hidden>
                {m.no}
              </p>
              <h3 id="item-dlg-h" className="mt-3 text-[clamp(1.9rem,1.3rem+1.8vw,2.9rem)] leading-[0.95]">
                {m.name}
              </h3>
              <p className="mt-2 text-[length:var(--fs-small)] text-[var(--ink-3)]">{m.heading}</p>
              <p className="kicker mt-6 text-[var(--ink-3)]">Scope</p>
              <p className="measure mt-1.5 text-[var(--ink-2)]">{m.body}</p>
              <div className="mt-6 grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2 border-t border-[var(--rule-strong)] pt-4">
                <span className="struck pt-0.5 text-[0.8rem] text-[var(--primary-ink)]">{m.no}</span>
                <p>
                  <span className="kicker block text-[var(--ink-3)]">Deliverable</span>
                  <span className="font-semibold text-[var(--ink)]">{m.deliverable}</span>
                </p>
              </div>
            </div>

            <div className="min-w-0 border-t border-[var(--rule)] pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <p className="kicker text-[var(--ink-3)]">Inscribed as</p>
              <div className="mt-2">
                <Time time={m.time} label="Field" size="lg" play={false} />
              </div>
              <p className="kicker mt-6 text-[var(--ink-3)]">This field · {m.pct}%</p>
              <CopyAmount amount={m.amount} label={`Field ${m.no}`} className="mt-1 text-[1.3rem] font-bold" />
              <p className="mt-1 text-[0.8125rem] text-[var(--ink-2)]">{m.pay}</p>
              <p className="kicker mt-6 text-[var(--ink-3)]">Running total</p>
              <p className="mono mt-1 text-[0.9rem] text-[var(--ink)]">
                <span className="font-bold">{formatMoney(m.cumulative)}</span> <span className="text-[var(--ink-3)]">of {formatMoney(TOTAL_COST)}</span>
              </p>
              <div aria-hidden className="mt-2 h-[3px] w-full bg-[var(--card)] shadow-[inset_0_0_0_1px_var(--rule-strong)]">
                <span className="block h-full bg-[var(--cta)]" style={{ width: `${(m.cumulative / TOTAL_COST) * 100}%` }} />
              </div>
              <div className="mt-8 flex items-center gap-2">
                <button type="button" disabled={idx === 0} onClick={() => onGo(idx - 1)} data-intent="prev_milestone" data-value={`M${m.no}`} className={navBtn}>
                  <ArrowLeft size={16} aria-hidden /> Previous
                </button>
                <button type="button" disabled={idx === LAST} onClick={() => onGo(idx + 1)} data-intent="next_milestone" data-value={`M${m.no}`} className={navBtn}>
                  Next <ArrowRight size={16} aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ the payment schedule: a cumulative step chart */

/**
 * One hue (gold, the money colour), a 2px step line with a gold wash under it, 2px surface gaps
 * between the steps, direct labels on the step caps (every other cap when the bands are narrow), field
 * numbers on the x axis and three clean ticks on the y axis. Geometry is computed in pixels from the
 * measured width so the type never scales with the viewBox. Text wears ink, never the series colour.
 */
function PayChart() {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(720)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setW(Math.max(260, Math.round(el.clientWidth)))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const reduced = useReducedMotion()

  const narrow = w < 600
  const H = narrow ? 250 : 320
  const padL = narrow ? 50 : 64
  const padR = narrow ? 10 : 20
  const padT = 30
  const padB = narrow ? 46 : 50
  const iw = w - padL - padR
  const ih = H - padT - padB
  const n = MILESTONES.length
  const band = iw / n
  const gap = 2
  const y = (v: number) => padT + ih - (v / TOTAL_COST) * ih
  const base = y(0)

  /* the step line: a riser at the left edge of each band up to its running total, then a flat */
  let d = `M${padL} ${base}`
  MILESTONES.forEach((m, i) => {
    const x0 = padL + i * band
    d += ` L${x0} ${y(m.cumulative)} L${x0 + band} ${y(m.cumulative)}`
  })
  const half = MILESTONES[Math.floor(n / 2) - 1]
  const ticks = [0, half.cumulative, TOTAL_COST]
  const labelEvery = band < 58 ? 2 : 1
  const tid = 'pay-chart-title'
  const did = 'pay-chart-desc'
  const summary = MILESTONES.map((m) => `field ${m.no} ${formatMoney(m.amount)}, running total ${formatMoney(m.cumulative)}`).join('; ')

  return (
    <div ref={ref} className="mt-6 min-w-0">
      <svg id="pay-chart" role="img" aria-labelledby={`${tid} ${did}`} viewBox={`0 0 ${w} ${H}`} width={w} height={H} className="block h-auto w-full max-w-full overflow-visible">
        <title id={tid}>Payment schedule: the running total after each of the eight fields</title>
        <desc id={did}>
          Rises in eight steps from a {formatMoney(MILESTONES[0].amount)} kick-start to {formatMoney(TOTAL_COST)}: {summary}.
        </desc>

        {/* gridlines and y ticks: three clean values, hairline, recessive */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={padL + iw} y1={y(t)} y2={y(t)} stroke="var(--rule)" strokeWidth="1" />
            <text x={padL - 10} y={y(t)} dy="0.35em" textAnchor="end" style={{ fontFamily: "var(--font-mono)" }} fontSize="11" fill="var(--ink-3)">
              {t === 0 ? '$0' : formatMoney(t)}
            </text>
          </g>
        ))}

        {/* the wash under the steps: one gold hue, 2px surface gaps between fields */}
        {MILESTONES.map((m, i) => {
          const x0 = padL + i * band
          const top = y(m.cumulative)
          return (
            <motion.rect
              key={m.id}
              x={x0 + (i === 0 ? 0 : gap / 2)}
              width={Math.max(1, band - (i === 0 ? gap / 2 : gap))}
              y={top}
              height={Math.max(0, base - top)}
              fill="var(--cta)"
              fillOpacity={0.2}
              style={{ transformOrigin: `${x0}px ${base}px` }}
              initial={reduced ? { scaleY: 1 } : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: SETTLE, delay: reduced ? 0 : 0.06 * i }}
            />
          )
        })}

        {/* the step line */}
        <motion.path d={d} fill="none" stroke="var(--cta)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" initial={reduced ? { pathLength: 1 } : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: SETTLE }} />

        {/* baseline and x labels */}
        <line x1={padL} x2={padL + iw} y1={base} y2={base} stroke="var(--rule-strong)" strokeWidth="1" />
        {MILESTONES.map((m, i) => {
          const cx = padL + i * band + band / 2
          const labelled = (i + 1) % labelEvery === 0 || i === n - 1
          return (
            <g key={m.id}>
              {/* direct label on the cap: the running total */}
              {labelled && (
                <text x={cx} y={y(m.cumulative) - 8} textAnchor="middle" style={{ fontFamily: "var(--font-mono)" }} fontSize={narrow ? 10.5 : 11.5} fontWeight="600" fill="var(--ink)">
                  {formatMoney(m.cumulative)}
                </text>
              )}
              <text x={cx} y={base + 18} textAnchor="middle" style={{ fontFamily: "var(--font-mono)" }} fontSize="11.5" fontWeight="700" fill="var(--ink)">
                {m.no}
              </text>
              <text x={cx} y={base + 32} textAnchor="middle" style={{ fontFamily: "var(--font-mono)" }} fontSize="10" fill="var(--ink-3)">
                {m.pct}%
              </text>
              {/* the hover layer: one band per item */}
              <rect x={padL + i * band} y={padT - 10} width={band} height={ih + 10 + padB} fill="transparent" className="hover:fill-[var(--money-soft)]">
                <title>{`Field ${m.no} · ${m.name} · ${formatMoney(m.amount)} · running total ${formatMoney(m.cumulative)}`}</title>
              </rect>
            </g>
          )
        })}

        {/* the end marker: the total, ringed in the ground */}
        <circle cx={padL + iw} cy={y(TOTAL_COST)} r={6} fill="var(--ground)" />
        <circle cx={padL + iw} cy={y(TOTAL_COST)} r={4} fill="var(--cta)" />
      </svg>
      <p className="kicker mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[0.625rem] text-[var(--ink-3)]">
        <span>Field number · share of the total</span>
        <span className="normal-case">Running total in gold</span>
      </p>

      {/* the same figures as a table, for readers who cannot see the chart */}
      <table className="sr-only">
        <caption>Payment schedule by field</caption>
        <thead>
          <tr>
            <th scope="col">Field</th>
            <th scope="col">Name</th>
            <th scope="col">Share</th>
            <th scope="col">Amount</th>
            <th scope="col">Running total</th>
            <th scope="col">Paid</th>
          </tr>
        </thead>
        <tbody>
          {MILESTONES.map((m) => (
            <tr key={m.id}>
              <th scope="row">{m.no}</th>
              <td>{m.name}</td>
              <td>{m.pct}%</td>
              <td>{formatMoney(m.amount)}</td>
              <td>{formatMoney(m.cumulative)}</td>
              <td>{m.pay}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
