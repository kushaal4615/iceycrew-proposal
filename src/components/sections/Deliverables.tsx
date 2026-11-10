/* Archetype: OVERSIZED-NUMERAL INDEX. Field 08 on the report, "What is handed over".
   The seven deliverables as the index printed on the back of the report. Each entry sits under a
   numeral at --fs-numeral, foil-struck, left-set and bleeding past the shell edge, that rises out of
   its own ruled slot; beside the title a tick is drawn by hand into the printed box in gold, and the
   entry is stamped INCLUDED in inscription blue. Entries that are an app show the real product, small,
   in the outer column (a phone for the app, a laptop for the panel). */
import { motion } from 'framer-motion'
import { P, WEB_SCREENS } from '../../data/proposal'
import { Item, Stamp } from '../ui/bits'
import { Draw, Reveal, SETTLE } from '../ui/motion'
import { ProductMock } from '../ui/ProductMock'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/format'

const pad = (n: number) => String(n).padStart(2, '0')
const TOTAL = pad(P.deliverables.length)

function Tick({ delay = 0 }: { delay?: number }) {
  return (
    <svg viewBox="0 0 32 32" className="mt-1 h-8 w-8 shrink-0 text-[var(--primary)]" aria-hidden>
      <rect x="1.5" y="1.5" width="29" height="29" fill="none" stroke="var(--frame)" strokeWidth="1" />
      <rect x="4.5" y="4.5" width="23" height="23" fill="none" stroke="var(--frame)" strokeWidth="0.75" />
      <Draw d="M9.5 16.5 L14 21 L23 10.5" strokeWidth={2.4} delay={delay} />
    </svg>
  )
}

export function Deliverables() {
  const reduced = useReducedMotion()
  return (
    <section id="deliverables" aria-labelledby="deliverables-h" className="section-y relative [overflow-x:clip] bg-[var(--ground-2)]">
      <div className="shell">
        <Item
          no="08"
          time="F-08"
          name="What is handed over"
          id="deliverables-h"
          lines={[
            'Seven things',
            <span key="e">
              you <em>keep.</em>
            </span>,
          ]}
          aside={`${TOTAL} items · all included`}
        />

        <ol className="m-0 mt-14 list-none border-t-2 border-[var(--ink)] p-0 lg:mt-20">
          {P.deliverables.map((d, i) => {
            const no = pad(i + 1)
            const web = d.screen ? WEB_SCREENS.includes(d.screen) : false
            return (
              <li key={d.title} className="grid min-w-0 grid-cols-1 gap-y-6 border-b border-[var(--rule-strong)] py-10 md:grid-cols-[minmax(0,auto)_minmax(0,1fr)] md:gap-x-10 lg:grid-cols-12 lg:gap-x-8 lg:py-14">
                {/* the numeral rises out of its own slot and bleeds past the shell edge */}
                <motion.span
                  aria-hidden
                  className="block min-w-0 overflow-hidden lg:col-span-4"
                  initial={reduced ? false : 'hide'}
                  whileInView="show"
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                >
                  <motion.span
                    className="foil display block pt-[0.05em] leading-[0.8]"
                    style={{ fontSize: 'var(--fs-numeral)', marginLeft: 'calc(var(--gutter) * -0.5)' }}
                    variants={{ hide: { y: '104%' }, show: { y: 0, transition: { duration: 0.85, ease: SETTLE } } }}
                  >
                    {no}
                  </motion.span>
                </motion.span>

                <div className={cn('min-w-0 lg:pt-4', d.screen ? (web ? 'lg:col-span-4' : 'lg:col-span-5') : 'lg:col-span-8')}>
                  <p className="kicker flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--ink-3)]">
                    <span>
                      Deliverable {no} of {TOTAL}
                    </span>
                  </p>
                  <div className="mt-5 flex items-start gap-4">
                    <Tick delay={0.35} />
                    <h3 className="min-w-0 text-[length:clamp(1.7rem,1.25rem+1.3vw,2.7rem)] leading-[0.95]">
                      <span className="sr-only">{no}. </span>
                      {d.title}
                    </h3>
                  </div>
                  <p className="mt-4 max-w-[40ch] pl-12 text-[length:1.125rem] text-[var(--ink-2)]">{d.body}</p>
                  <div className="mt-6 pl-12">
                    <Stamp tone="verified" rotate={-2} play={i === 0}>
                      Included
                    </Stamp>
                  </div>
                </div>

                {d.screen && (
                  <Reveal delay={0.15} className={cn('min-w-0 md:col-start-2 lg:col-start-auto lg:justify-self-end', web ? 'lg:col-span-4' : 'lg:col-span-3')}>
                    <ProductMock screen={d.screen} tilt="none" size="sm" />
                  </Reveal>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
