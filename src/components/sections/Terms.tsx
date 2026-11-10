/* 11 · TERMS · Archetype: ruled ledger / table-as-design. Field 11, "The fine print" of the report: the
   support terms as entries on ledger ruling (FIXED struck in gold, INCLUDED under the gold seal, OPT-IN
   in ink), the figure column struck in mono, then the three things we need to start as short rows, then
   the questions Hazel is likely to ask as an accordion with a struck Q-number index. Below xl everything stacks. */
import { motion } from 'framer-motion'
import { MILESTONES, P, TOTAL_COST, timelineLabel, type SupportLine } from '../../data/proposal'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn, formatMoney } from '../../lib/format'
import { Accordion, Item, Seal, Stamp } from '../ui/bits'
import { Reveal, SETTLE } from '../ui/motion'

const pad2 = (n: number) => String(n).padStart(2, '0')

/** The ledger's columns: number, item, figure, status. Mobile keeps number + item, with figure and status folded under. */
const COLS = 'sm:grid-cols-[3rem_minmax(0,1fr)_9rem_7.5rem]'

function SupportRow({ s, i }: { s: SupportLine; i: number }) {
  const reduced = useReducedMotion()
  const fixed = s.status === 'FIXED'
  const included = s.status === 'INCLUDED'
  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.6, ease: SETTLE, delay: i * 0.06 }}
      className={cn('ruled-row ledger-row grid min-w-0 grid-cols-[2.6rem_minmax(0,1fr)] gap-x-3 border-b border-[var(--rule-strong)] py-3 sm:items-start sm:gap-x-5', COLS)}
    >
      <span className="struck text-[0.8rem] leading-6 text-[var(--ink-3)]">{pad2(i + 1)}</span>
      <div className="min-w-0">
        <p className="text-[1.125rem] font-semibold leading-6 tracking-[-0.01em] text-[var(--ink)]">{s.item}</p>
        <p className="measure text-[var(--fs-small)] leading-6 text-[var(--ink-2)]">{s.detail}</p>
      </div>
      <span className={cn('struck col-start-2 text-[1rem] font-bold leading-6 sm:col-start-3', fixed ? 'text-[var(--money)]' : included ? 'text-[var(--ink)]' : 'text-[var(--ink-2)]')}>{s.figure}</span>
      <span className="col-start-2 flex h-6 items-center sm:col-start-4 sm:justify-self-end">
        {fixed ? (
          <Stamp tone="money" rotate={-3}>
            Fixed
          </Stamp>
        ) : included ? (
          <Seal size={44} rotate={-8} className="-my-2.5">
            Included
          </Seal>
        ) : (
          <Stamp tone="ink" rotate={-3}>
            Opt-in
          </Stamp>
        )}
      </span>
    </motion.li>
  )
}

export function Terms() {
  return (
    <section id="terms" aria-labelledby="terms-h" className="section-y relative overflow-x-clip bg-[var(--ground)]">
      <style>{`
        /* ledger ruling every 1.5rem, so each line of the entry sits between two rules */
        #terms .ledger-row { background-size: 100% 1.5rem; background-position: 0 0.75rem; }
        /* an eight-letter word on a small seal: tighter tracking, no side padding, a size that fits the seal */
        #terms [role="img"] > span.struck { padding-inline: 0; letter-spacing: 0.04em; }
        #terms .ledger-row [role="img"] > span.struck { font-size: 6.5px !important; }
      `}</style>
      <div className="shell">
        <Item no="11" time="F-11" name="The fine print" id="terms-h" seal="Included" lines={['A fixed price.', 'Ninety days of fixes.', 'Then your call.']} />

        <div className="mt-12 grid gap-14 xl:mt-16 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:gap-16">
          {/* the ledger */}
          <div className="min-w-0">
            <Reveal>
              <p className="measure text-[var(--ink-2)]">
                The investment is fixed at <span className="struck font-bold text-[var(--money)]">{formatMoney(TOTAL_COST)}</span>, paid in {MILESTONES.length} fields over {timelineLabel}, with nothing due between fields. Ninety days of free support and maintenance for bug fixes are included from the day the source code is handed over. After that, support is completely optional: no lock-in, no auto-renew, and nothing happens unless you ask for it.
              </p>
            </Reveal>

            <div className={cn('kicker mt-10 hidden gap-x-5 border-b-2 border-[var(--ink)] pb-2 text-[var(--ink-3)] sm:grid', COLS)} aria-hidden>
              <span>No.</span>
              <span>Item</span>
              <span>Figure</span>
              <span className="justify-self-end">Status</span>
            </div>
            <ol className="mt-10 border-t-2 border-[var(--ink)] sm:mt-0 sm:border-t-0" aria-label="Support terms">
              {P.support.map((s, i) => (
                <SupportRow key={s.item} s={s} i={i} />
              ))}
            </ol>

            {/* to start */}
            <Reveal className="mt-14" delay={0.05}>
              <p className="kicker flex flex-wrap items-center gap-x-3 gap-y-1 border-b-2 border-[var(--ink)] pb-2 text-[var(--ink)]">
                <span className="font-bold">To start the project</span>
                <span aria-hidden className="h-3 w-px bg-current opacity-50" />
                <span className="text-[var(--ink-3)]">{pad2(P.startNeeds.length)} things we need from you</span>
              </p>
              <ol aria-label="To start the project">
                {P.startNeeds.map((n, i) => (
                  <li key={n.title} className="grid min-w-0 grid-cols-[2.6rem_minmax(0,1fr)] gap-x-3 border-b border-[var(--rule-row)] py-3 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-5">
                    <span className="struck pt-[0.2em] text-[0.8rem] text-[var(--ink-3)]">{pad2(i + 1)}</span>
                    <div className="min-w-0">
                      <p className="font-semibold leading-snug text-[var(--ink)]">{n.title}</p>
                      <p className="measure mt-0.5 text-[var(--fs-small)] text-[var(--ink-2)]">{n.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          {/* the questions */}
          <div className="min-w-0">
            <Reveal delay={0.1}>
              <p className="kicker flex flex-wrap items-center gap-x-3 gap-y-1 pb-3 text-[var(--ink)]">
                <span className="font-bold">Questions you may have</span>
                <span aria-hidden className="h-3 w-px bg-current opacity-50" />
                <span className="text-[var(--ink-3)]">{pad2(P.faq.length)} answered</span>
              </p>
              <Accordion
                items={P.faq}
                renderIndex={(i, open) => <span className={cn('struck w-10 shrink-0 text-[0.8rem]', open ? 'text-[var(--money)]' : 'text-[var(--ink-3)]')}>Q{pad2(i + 1)}</span>}
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
