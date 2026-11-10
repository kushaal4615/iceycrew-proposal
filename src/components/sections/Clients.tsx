/* 10 · CLIENTS · Archetype: marquee band. The only marquee on the page. Field 10, "Prior reports": the
   people we have built for roll past on the ink band like the register of earlier certificates, each
   mark typeset in its own treatment (never an image), each a link that lifts and prints its address on
   hover. Below the band, "Why us" is set as a ruled, numbered printout on report stock, with three of
   its lines pulled into the margin as larger display notes on lg. */
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { P, type ClientMark } from '../../data/proposal'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/format'
import { Item, Marquee } from '../ui/bits'
import { Reveal } from '../ui/motion'

const pad2 = (n: number) => String(n).padStart(2, '0')
const host = (url: string) => url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')

/** The typeset treatment for each mark: Outfit weights, Playfair italic, JetBrains mono. */
function MarkText({ c }: { c: ClientMark }) {
  switch (c.set) {
    case 'heavy':
      return (
        <span className="whitespace-nowrap text-[2.1rem] leading-none tracking-[-0.045em] sm:text-[2.6rem]" style={{ fontFamily: 'var(--font-body)', fontWeight: 800 }}>
          {c.name}
        </span>
      )
    case 'wide':
      return (
        <span className="whitespace-nowrap pl-[0.32em] text-[1.1rem] uppercase leading-none tracking-[0.32em] sm:text-[1.3rem]" style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}>
          {c.name}
        </span>
      )
    case 'stack': {
      const [first, ...rest] = c.name.split(' ')
      return (
        <span className="flex flex-col whitespace-nowrap text-[1.3rem] uppercase leading-[0.92] tracking-[-0.01em] sm:text-[1.55rem]" style={{ fontFamily: 'var(--font-body)', fontWeight: 700 }}>
          <span>{first}</span>
          <span className="tracking-[0.1em]" style={{ fontWeight: 400 }}>
            {rest.join(' ')}
          </span>
        </span>
      )
    }
    case 'italic':
      return <span className="display-italic whitespace-nowrap text-[2.3rem] leading-none sm:text-[2.8rem]">{c.name}</span>
    case 'light':
      return (
        <span className="whitespace-nowrap text-[2rem] leading-none tracking-[-0.03em] sm:text-[2.45rem]" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
          {c.name}
        </span>
      )
    case 'mono':
    default:
      return (
        <span className="mono whitespace-nowrap text-[1.3rem] leading-none sm:text-[1.5rem]" style={{ fontWeight: 500 }}>
          {c.name}
        </span>
      )
  }
}

function MarkLink({ c, copy }: { c: ClientMark; copy?: boolean }) {
  const reduced = useReducedMotion()
  return (
    <motion.a
      href={c.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={copy ? -1 : undefined}
      data-intent="open_client_site"
      data-value={c.name}
      whileHover={reduced ? undefined : { y: -5 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className="mark relative mx-2 flex min-h-[6.5rem] shrink-0 flex-col items-start justify-center rounded-[var(--r-card)] px-6 py-4 text-[var(--on-band)] sm:mx-4 sm:px-9"
    >
      <MarkText c={c} />
      <span className="mark-host mono mt-2 inline-flex items-center gap-1 whitespace-nowrap text-[0.72rem] text-[var(--on-band-2)]">
        {host(c.url)}
        <ArrowUpRight size={12} aria-hidden />
      </span>
      <span className="sr-only">Opens {c.name} in a new tab</span>
    </motion.a>
  )
}

/** Why-us lines pulled into the margin on lg: the team, the architecture, the ninety days of fixes. */
const PULLED = new Set([1, 5, 6])

export function Clients() {
  const marks = P.clients
  return (
    <section id="clients" aria-labelledby="clients-h" className="relative overflow-x-clip">
      <style>{`
        #clients .mark-host { opacity: 0; transform: translateY(4px); transition: opacity 180ms var(--ease-turn), transform 180ms var(--ease-turn); }
        #clients .mark:hover .mark-host, #clients .mark:focus-visible .mark-host { opacity: 1; transform: translateY(0); }
        #clients .mark:hover, #clients .mark:focus-visible { background: color-mix(in srgb, var(--on-band) 7%, transparent); }
        @media (prefers-reduced-motion: reduce) { #clients .mark-host { opacity: 1; transform: none; } }
      `}</style>

      {/* the band: the register of prior reports, printed on ink */}
      <div className="bg-[var(--ink-band)] pb-14 pt-[var(--section-y)] text-[var(--on-band)] sm:pb-20">
        <div className="shell">
          <Item
            no="10"
            time="F-10"
            name="Prior reports"
            id="clients-h"
            tone="close"
            aside={`${pad2(marks.length)} marks`}
            lines={['The reports that', 'came before yours.']}
          />
          <Reveal delay={0.15}>
            <p className="measure mt-6 text-[var(--on-band-2)]">SaaS platforms, marketplaces and AI products we have built and shipped. Each mark opens the client&rsquo;s own site in a new tab.</p>
          </Reveal>
        </div>
        <div className="mt-10 border-y border-[var(--band-rule)] py-3 sm:mt-14">
          <Marquee speed={52} copy={marks.map((c) => <MarkLink key={`c-${c.name}`} c={c} copy />)}>
            {marks.map((c) => (
              <MarkLink key={c.name} c={c} />
            ))}
          </Marquee>
        </div>
        <p className="shell mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[var(--fs-small)] text-[var(--on-band-2)]">
          <span className="kicker">Hover a mark to read its address</span>
          <span aria-hidden className="h-3 w-px bg-current opacity-50" />
          <span className="kicker">{P.client.markets}</span>
        </p>
      </div>

      {/* why us: the printout */}
      <div className="bg-[var(--ground-2)] py-[var(--section-y)] text-[var(--ink)]">
        <div className="shell">
          <div className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-10">
            <Reveal className="min-w-0 lg:col-span-8">
              <p className="kicker flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--ink-3)]">
                <span className="font-bold text-[var(--ink)]">Why us</span>
                <span aria-hidden className="h-3 w-px bg-current opacity-50" />
                <span>{pad2(P.whyUs.length)} reasons, printed in full</span>
              </p>
              <h3 className="mt-4" style={{ fontSize: 'var(--fs-h3)' }}>
                What we bring to the <em>report</em>
              </h3>
            </Reveal>
          </div>

          <ol className="mt-8 border-t-2 border-[var(--ink)] lg:mt-10">
            {P.whyUs.map((w, i) => {
              const pulled = PULLED.has(i)
              return (
                <li key={w.title} className="grid min-w-0 grid-cols-1 border-b border-[var(--rule-row)] lg:grid-cols-12 lg:gap-x-10">
                  <Reveal className="min-w-0 lg:col-span-8" y={10} delay={0.03 * (i % 3)}>
                    <p className="grid min-w-0 grid-cols-[2.6rem_minmax(0,1fr)] gap-x-3 py-5 leading-relaxed sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-5">
                      <span className="struck pt-[0.2em] text-[0.8rem] text-[var(--money)]">{pad2(i + 1)}</span>
                      <span className="min-w-0">
                        <span className={cn('font-semibold text-[var(--ink)]', pulled && 'lg:sr-only')}>{w.title}</span>
                        <span className={cn('text-[var(--ink-3)]', pulled && 'lg:hidden')} aria-hidden>
                          {' · '}
                        </span>
                        <span className="text-[var(--ink-2)]">{w.body}</span>
                      </span>
                    </p>
                  </Reveal>
                  {pulled && (
                    <Reveal className="hidden min-w-0 lg:col-span-4 lg:block" delay={0.12}>
                      <p aria-hidden className="relative -mt-px py-5">
                        <span className="rule-foil block w-16" />
                        <span className="display mt-3 block max-w-[14ch] text-[var(--ink)]" style={{ fontSize: 'clamp(1.6rem, 1rem + 1.3vw, 2.4rem)', lineHeight: 1.02 }}>
                          {w.title}
                        </span>
                        <span className="struck mt-2 block text-[0.72rem] text-[var(--ink-3)]">line {pad2(i + 1)}</span>
                      </p>
                    </Reveal>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
