/* 12 · CLOSE · Archetype: closing band. Field 12, "Accept". The report under the loupe at night: dark,
   quiet, one line, one CTA. THE SURPRISE: the acceptance slip. A slip of report stock lies on the band
   with "Signed for", a blank signature line and the eight fields of the report, unticked. Pressing
   Accept writes "Hazel · accepts the report" on the line, ticks the fields off one by one with a gold
   line (stiff springs, 90ms apart), presses the gold ACCEPTED seal onto the slip, and copies the
   message to the clipboard with a toast. Reduced motion: the sealed slip is shown immediately. */
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MILESTONES, P, TOTAL_COST, timelineLabel, type ResolvedMilestone } from '../../data/proposal'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn, formatMoney } from '../../lib/format'
import { IceMark, Item, Seal, useToast } from '../ui/bits'
import { Magnetic, Reveal, SETTLE, Spotlight } from '../ui/motion'

const STIFF = { type: 'spring' as const, stiffness: 560, damping: 26 }
const GAP = 0.09
const FIRST = 0.4

function Line({ m, i, ticked, reduced }: { m: ResolvedMilestone; i: number; ticked: boolean; reduced: boolean }) {
  const delay = reduced ? 0 : FIRST + i * GAP
  return (
    <li className="relative flex min-w-0 items-center gap-x-2 py-2 sm:gap-x-3">
      {/* the tick box */}
      <span aria-hidden className="relative grid h-5 w-5 shrink-0 place-items-center" style={{ boxShadow: 'inset 0 0 0 1px var(--close-rule)' }}>
        <svg viewBox="0 0 20 20" width="20" height="20" className="absolute inset-0 text-[var(--close-cta)]">
          <motion.path
            d="M4 10.5 L8.5 15 L16 5.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={ticked ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={ticked ? { pathLength: { ...STIFF, delay }, opacity: { duration: 0.01, delay } } : { duration: 0.12 }}
          />
        </svg>
      </span>
      <span className="struck w-[3.25rem] shrink-0 text-[0.78rem] text-[var(--close-card-ink)] opacity-70 sm:w-16">{m.time}</span>
      <span className="relative min-w-0 flex-1 pb-[3px] text-[0.95rem] font-semibold leading-tight text-[var(--close-card-ink)]">
        <span className="struck mr-2 text-[0.72rem] font-normal opacity-60">{m.no}</span>
        {m.name}
        {/* the gold line run along the field as it is ticked off */}
        <motion.span
          aria-hidden
          className="absolute bottom-0 left-0 block h-[2px] w-full origin-left bg-[var(--close-cta)]"
          initial={false}
          animate={{ scaleX: ticked ? 1 : 0 }}
          transition={ticked ? { ...STIFF, delay: delay + 0.04 } : { duration: 0.12 }}
        />
      </span>
      <span className="sr-only">{ticked ? 'ticked' : 'not yet ticked'}</span>
    </li>
  )
}

export function Close() {
  const reduced = useReducedMotion()
  const toast = useToast()
  const [accepted, setAccepted] = useState(false)
  const [pressed, setPressed] = useState(false)

  /* reduced motion: the slip is already sealed */
  useEffect(() => {
    if (reduced) setAccepted(true)
  }, [reduced])

  const rsvp = async () => {
    setAccepted(true)
    try {
      await navigator.clipboard.writeText(P.cta.message)
    } catch {
      /* clipboard blocked; the message is still printed under the button */
    }
    setPressed(true)
    toast(P.cta.done)
  }

  const sealDelay = reduced ? 0 : FIRST + MILESTONES.length * GAP + 0.25

  return (
    <section id="start" aria-labelledby="start-h" className="relative overflow-x-clip bg-[var(--close-bg)] text-[var(--close-ink)]">
      <Spotlight />
      <div className="shell section-y relative">
        <Item no="12" time="F-12" name="Accept" id="start-h" tone="close" lines={[P.cta.line]} aside={P.client.eventName} />

        <div className="mt-10 grid items-start gap-12 lg:mt-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-16">
          {/* the one CTA and the quiet line */}
          <Reveal delay={0.15} className="min-w-0 text-center lg:text-left">
            <p className="measure mx-auto text-[var(--close-ink-2)] lg:mx-0">
              Press Accept and the slip is signed and sealed. The message that starts us off is copied for you to paste into our chat; the call that follows sets the start date.
            </p>
            <div className="mt-8 flex flex-col items-center gap-5 lg:items-start">
              <Magnetic>
                <motion.button
                  type="button"
                  onClick={rsvp}
                  data-intent="accept"
                  data-value={pressed ? 'again' : 'first'}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                  className="display-wide inline-flex min-h-14 items-center gap-3 rounded-[var(--r-card)] bg-[var(--close-cta)] px-8 text-[1.15rem] text-[var(--close-on-cta)] transition-[filter] duration-150 hover:brightness-110"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={pressed ? 'check' : 'copy'}
                      className="inline-grid place-items-center"
                      initial={reduced ? { opacity: 0 } : { scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={reduced ? { opacity: 0, transition: { duration: 0.1 } } : { scale: 0.8, opacity: 0, transition: { duration: 0.1 } }}
                      transition={{ type: 'spring', stiffness: 520, damping: 26 }}
                    >
                      {pressed ? <Check size={20} aria-hidden /> : <Copy size={20} aria-hidden />}
                    </motion.span>
                  </AnimatePresence>
                  {P.cta.action}
                </motion.button>
              </Magnetic>
              <p className="struck text-[0.85rem] text-[var(--close-ink-2)]">
                <span className="text-[var(--close-cta)]">{formatMoney(TOTAL_COST)}</span> · {MILESTONES.length} fields · {timelineLabel}
              </p>
              <p className="mono max-w-[36rem] text-[0.8125rem] leading-relaxed text-[var(--close-ink-2)]" aria-live="polite">
                {pressed ? P.cta.done : `“${P.cta.message}”`}
              </p>
            </div>
          </Reveal>

          {/* the acceptance slip */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 26, rotate: -0.8 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.8, ease: SETTLE }}
            className="relative min-w-0 rounded-[var(--r-card)] bg-[var(--close-card)] text-[var(--close-card-ink)]"
            style={{ boxShadow: '0 30px 60px -24px rgb(0 0 0 / 0.75), inset 0 0 0 1px var(--close-rule)' }}
          >
            {/* the report's gold micro-rule, inset from the slip's edge */}
            <span aria-hidden className="pointer-events-none absolute inset-[var(--frame-inset)] border border-[var(--close-cta)] opacity-80" />
            <span aria-hidden className="grain pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply" />

            <div className="relative px-6 pb-6 pt-6 sm:px-8 sm:pt-7">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-b-2 border-[var(--close-card-ink)] pb-3">
                <p className="kicker flex items-center gap-2 text-[var(--close-card-ink)]">
                  <IceMark size={18} />
                  <span className="font-bold">Acceptance slip</span>
                  <span aria-hidden className="h-3 w-px bg-current opacity-50" />
                  <span>{P.client.programmeNo}</span>
                </p>
                <p className="kicker text-[var(--close-card-ink)] opacity-70">{P.client.date}</p>
              </div>

              <p className="display mt-6 text-[clamp(1.75rem,1.2rem+2vw,2.5rem)] leading-none text-[var(--close-card-ink)]">Signed for</p>

              {/* the signature line: "X ______" until the slip is accepted */}
              <p className="mt-5 flex min-h-[2.75rem] items-end gap-3 border-b border-[var(--close-card-ink)] pb-1" aria-live="polite">
                <span className="display-italic text-[1.5rem] leading-none opacity-70">X</span>
                <span className="relative min-w-0 flex-1 leading-none">
                  <AnimatePresence initial={false}>
                    {accepted && (
                      <motion.span
                        key="name"
                        initial={reduced ? false : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: SETTLE, delay: reduced ? 0 : 0.08 }}
                        className="display-italic block text-[clamp(1.3rem,0.9rem+1.4vw,2rem)] leading-[1.05] text-[var(--close-card-ink)]"
                      >
                        {P.client.contact} <span className="text-[var(--close-cta)]">·</span> accepts the report
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!accepted && <span className="sr-only">Not yet signed</span>}
                </span>
              </p>

              <p className="kicker mt-6 flex items-center justify-between gap-3 text-[var(--close-card-ink)] opacity-70" aria-hidden>
                <span>Fields of the report</span>
                <span>{MILESTONES.length} fields</span>
              </p>
              <ol className="mt-1 border-t border-[var(--close-rule)]" aria-label="The fields of the report, ticked off as accepted">
                {MILESTONES.map((m, i) => (
                  <Line key={m.id} m={m} i={i} ticked={accepted} reduced={reduced} />
                ))}
              </ol>

              {/* the footer row: the quiet figures and the space the seal lands in (nothing with text sits under it) */}
              <div className="mt-4 grid min-h-[5.5rem] grid-cols-[minmax(0,1fr)_5.5rem] items-end gap-4 border-t border-[var(--close-rule)] pt-3">
                <p className="struck text-[0.72rem] leading-relaxed text-[var(--close-card-ink)] opacity-70">
                  <span className="whitespace-nowrap">
                    {formatMoney(TOTAL_COST)} · {MILESTONES.length} fields · {timelineLabel}
                  </span>
                  <br />
                  <span className="whitespace-nowrap">{P.client.eventName}</span>
                </p>
                <span className="relative grid h-[5.5rem] w-[5.5rem] place-items-center justify-self-end">
                  {/* where the seal will be pressed: a faint ring until it lands */}
                  <AnimatePresence>
                    {!accepted && (
                      <motion.span
                        key="ring"
                        aria-hidden
                        className="absolute inset-1 rounded-[var(--r-seal)] border border-dashed border-[var(--close-card-ink)] opacity-30"
                        initial={false}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                      />
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {accepted && (
                      <motion.span
                        key="seal"
                        initial={reduced ? false : { scale: 1.7, opacity: 0, rotate: 6 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 540, damping: 24, delay: sealDelay }}
                        className="inline-block"
                      >
                        <Seal tone="card" size={88} play={false} rotate={-9}>
                          Accepted
                        </Seal>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <p className={cn('mt-16 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--band-rule)] pt-5 text-[var(--fs-small)] text-[var(--close-ink-2)] lg:mt-24')}>
          <span>Proposal for {P.client.contact}</span>
          <span aria-hidden>·</span>
          <span className="text-[var(--close-ink)]">{P.client.product}</span>
          <span aria-hidden>·</span>
          <span>{P.client.markets}</span>
          <span aria-hidden>·</span>
          <span className="struck text-[0.8rem]">{P.client.programmeNo}</span>
        </p>
      </div>
    </section>
  )
}
