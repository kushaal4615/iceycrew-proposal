/* Archetype: LAYERED DEPTH SCENE. Field 09 on the report, "A later report".
   Four planes move at different parallax rates as the section scrolls: (1) the store's shelves,
   slowest, far behind; (2) a gold pendant, closer, drifting the other way; (3) a plane of the report's
   plotting grid the cards are laid on; (4) the two cards in front, the nearest plane and the fastest.
   The lead card is the monetisation: one VIP level billed by the store, with the CRM adapter line
   crossed out under a gold stamp WRITTEN IN PHASE 2. The second, quieter card is the numbered list of
   what sits outside Version 1. Reduced motion: every plane is static. */
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { IMG, P } from '../../data/proposal'
import { useMedia } from '../../hooks/useMedia'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { Item, Photo, Stamp } from '../ui/bits'
import { SETTLE } from '../ui/motion'

const LATER = P.integrations.find((i) => i.status === 'LATER PHASE') ?? P.integrations[P.integrations.length - 1]

export function Later() {
  const reduced = useReducedMotion()
  const wide = useMedia('(min-width: 1024px)')
  const scene = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: scene, offset: ['start end', 'end start'] })
  const k = reduced ? 0 : wide ? 1 : 0.45
  const yFar = useTransform(scrollYProgress, [0, 1], [120 * k, -120 * k])
  const yMid = useTransform(scrollYProgress, [0, 1], [-70 * k, 120 * k])
  const yPaper = useTransform(scrollYProgress, [0, 1], [50 * k, -50 * k])
  const yCards = useTransform(scrollYProgress, [0, 1], [40 * k, -110 * k])

  return (
    <section id="later" aria-labelledby="later-h" className="section-y relative [overflow-x:clip]">
      <div className="shell">
        <Item
          no="09"
          time="F-09"
          name="A later report"
          id="later-h"
          lines={[
            'One level now,',
            <span key="e">
              three <em>later.</em>
            </span>,
          ]}
          aside={`${P.future.length} features outside Version 1`}
        />

        <div ref={scene} className="relative mt-12 min-h-[36rem] overflow-clip pb-8 lg:mt-16 lg:min-h-[40rem]">
          {/* plane 1: the store's shelves, farthest and slowest */}
          <motion.div aria-hidden style={{ y: yFar }} className="pointer-events-none absolute -left-[8%] top-0 z-0 w-[64%] lg:-left-[4%] lg:w-[46%]">
            <Photo img={IMG.store} className="aspect-[16/9]" sizes="(min-width: 1024px) 46vw, 64vw" />
          </motion.div>
          {/* plane 2: the pendant, closer, drifting the other way */}
          <motion.div aria-hidden style={{ y: yMid }} className="pointer-events-none absolute -right-[6%] top-[26%] z-[1] w-[48%] lg:-right-[3%] lg:top-[14%] lg:w-[34%]">
            <Photo img={IMG.necklace} className="aspect-[4/5]" sizes="(min-width: 1024px) 34vw, 48vw" />
          </motion.div>
          {/* plane 3: the report's plotting grid the cards lie on */}
          <motion.div aria-hidden style={{ y: yPaper }} className="plot pointer-events-none absolute inset-x-[4%] bottom-[4%] top-[12%] z-[2] bg-[var(--ground-2)] shadow-[inset_0_0_0_1px_var(--rule-strong)] lg:inset-x-[9%] lg:top-[18%]" />

          {/* plane 4: the two cards, nearest and fastest */}
          <motion.div style={{ y: yCards }} className="relative z-[3] grid gap-6 pt-[40%] sm:px-[5%] sm:pt-[26%] lg:grid-cols-12 lg:items-start lg:gap-8 lg:px-[11%] lg:pt-[20%]">
            {/* the lead card: the monetisation */}
            <motion.div
              className="min-w-0 lg:col-span-7"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.7, ease: SETTLE }}
            >
              <article className="card flex h-full flex-col p-6 sm:p-8">
                <p className="kicker flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--ink-3)]">
                  <span className="font-bold text-[var(--ink)]">Monetisation</span>
                  <span aria-hidden className="h-3 w-px bg-current opacity-50" />
                  <span className="normal-case">{P.client.markets}</span>
                </p>
                <h3 className="mt-5 text-[length:clamp(1.7rem,1.3rem+1.3vw,2.6rem)] leading-[0.95]">{P.monetisation.title}</h3>
                <p className="measure mt-5 text-[var(--ink-2)]">{P.monetisation.body}</p>

                {/* the CRM adapter line, crossed out, with the stamp over it */}
                <div className="relative mt-8 border-t border-[var(--rule-strong)] pt-5">
                  <p className="kicker text-[var(--ink-3)]">Prepared in the build, written later</p>
                  <div className="mt-3 flex flex-wrap items-start gap-x-6 gap-y-3">
                    <p className="relative min-w-0 flex-1 basis-[16rem]">
                      <span className="display block text-[length:clamp(1.3rem,1.1rem+0.7vw,1.7rem)] leading-tight text-[var(--ink-3)] line-through decoration-[var(--money)] decoration-2">{LATER.name}</span>
                      <span className="mt-2 block text-[length:var(--fs-small)] text-[var(--ink-3)]">{LATER.body}</span>
                    </p>
                    <Stamp tone="money" rotate={-4} className="mt-1 shrink-0">
                      Written in Phase 2
                    </Stamp>
                  </div>
                </div>
              </article>
            </motion.div>

            {/* the quieter card: outside Version 1 */}
            <motion.div
              className="min-w-0 lg:col-span-5"
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.7, ease: SETTLE, delay: 0.08 }}
            >
              <article className="card flex h-full flex-col p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="kicker text-[var(--ink-3)]">
                    <span className="font-bold text-[var(--ink)]">Outside Version 1</span>
                  </p>
                  <Stamp tone="ink" rotate={-2} className="text-[0.62rem]">
                    Later phase
                  </Stamp>
                </div>
                <ol className="m-0 mt-5 list-none border-t border-[var(--rule-strong)] p-0">
                  {P.future.map((f, i) => (
                    <li key={f.title} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 border-b border-dashed border-[var(--rule-strong)] py-3.5">
                      <span className="struck pt-[0.25em] text-[length:var(--fs-micro)] text-[var(--ink-3)]">{String(i + 1).padStart(2, '0')}</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-[var(--ink-2)]">{f.title}</p>
                        <p className="mt-0.5 text-[length:var(--fs-small)] text-[var(--ink-3)]">{f.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
