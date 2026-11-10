/* CONSTRAINTS · Archetype 02: editorial split. Field 03, "Conditions". Giant display type on the
   left (the six conditions of the brief, the active one in ink, the rest receding), dense small text
   on the right on an offset baseline: the active condition's body, the drawing the report would make
   of it, and how it shapes the build. Two small plates of the product's world under it. */
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { IMG, P } from '../../data/proposal'
import { useMedia } from '../../hooks/useMedia'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/format'
import { Grade, Item, Photo, Stamp } from '../ui/bits'
import { Draw, Reveal, SETTLE } from '../ui/motion'

function Chip({ children, on = false }: { children: string; on?: boolean }) {
  return (
    <span className={cn('kicker inline-flex min-h-7 items-center whitespace-nowrap rounded-[var(--r-card)] px-2.5 font-semibold', on ? 'bg-[var(--primary)] text-[var(--on-primary)]' : 'text-[var(--ink)] shadow-[inset_0_0_0_1px_var(--rule-strong)]')}>{children}</span>
  )
}

/** The app asks the membership layer; the layer asks Shopify. Drawn as two arrows and a box. */
function ShopifyBank() {
  return (
    <div role="img" aria-label="The app asks the membership layer, the membership layer asks the Shopify Admin API and webhooks; the app never talks to Shopify" className="grid grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto] items-center gap-2">
      <Chip>App</Chip>
      <svg aria-hidden viewBox="0 0 60 16" className="h-4 w-full text-[var(--primary)]">
        <Draw d="M2 8 H52 M46 3 L53 8 L46 13" strokeWidth={1.8} />
      </svg>
      <Chip on>Membership layer</Chip>
      <svg aria-hidden viewBox="0 0 60 16" className="h-4 w-full text-[var(--primary)]">
        <Draw d="M2 8 H52 M46 3 L53 8 L46 13" strokeWidth={1.8} delay={0.15} />
      </svg>
      <Chip>Shopify</Chip>
    </div>
  )
}

/** One record, two adapters: Shopify live, CRM staged. */
function Adapters() {
  return (
    <div role="img" aria-label="One provider-neutral membership record with a Shopify adapter switched on and a CRM adapter staged for later" className="grid gap-2">
      <div className="card px-4 py-3">
        <p className="kicker text-[var(--ink-3)]">Membership record · provider-neutral</p>
        <p className="mono mt-1 text-[0.75rem] text-[var(--ink)]">status · paid_until · level · provider · customer_id · subscription_id · order_id · crm_id</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center justify-between rounded-[var(--r-card)] px-3 py-2 shadow-[inset_0_0_0_1px_var(--rule-strong)]">
          <span className="text-[0.8125rem] font-semibold">Shopify adapter</span>
          <Stamp tone="verified" rotate={-3} play={false} className="text-[0.6rem]">
            Live
          </Stamp>
        </div>
        <div className="flex items-center justify-between rounded-[var(--r-card)] px-3 py-2 shadow-[inset_0_0_0_1px_var(--rule-strong)]">
          <span className="text-[0.8125rem] font-semibold">CRM adapter</span>
          <Stamp tone="ink" rotate={-3} play={false} className="text-[0.6rem]">
            Later
          </Stamp>
        </div>
      </div>
    </div>
  )
}

/** One level now, three later: the tiers as a row of chips, the later two dashed. */
function Tiers() {
  return (
    <div role="img" aria-label="One VIP level in Version 1; basic, premium and gold tiers in Phase 2" className="flex flex-wrap items-center gap-2">
      <Chip on>VIP · v1</Chip>
      <span aria-hidden className="kicker text-[var(--ink-3)]">then</span>
      {['Basic', 'Premium', 'Gold'].map((t) => (
        <span key={t} className="kicker inline-flex min-h-7 items-center rounded-[var(--r-card)] border border-dashed border-[var(--rule-strong)] px-2.5 text-[var(--ink-3)]">
          {t}
        </span>
      ))}
    </div>
  )
}

/** English first: the four markets with their formats. */
function Markets() {
  const rows: [string, string][] = [
    ['US', '°F · MM/DD · color'],
    ['CA', '°C · DD/MM · colour'],
    ['UK', '°C · DD/MM · colour'],
    ['AU', '°C · DD/MM · colour'],
  ]
  return (
    <div role="img" aria-label="Four launch markets with regional formats: the US in Fahrenheit, month first and American spelling; Canada, the UK and Australia in Celsius, day first and British spelling" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {rows.map(([c, f]) => (
        <span key={c} className="rounded-[var(--r-card)] px-2.5 py-2 shadow-[inset_0_0_0_1px_var(--rule-strong)]">
          <span className="kicker block font-bold text-[var(--ink)]">{c}</span>
          <span className="mono mt-1 block text-[0.7rem] text-[var(--ink-2)]">{f}</span>
        </span>
      ))}
    </div>
  )
}

/** Ten scans a day: ten cells, seven used; the cap as a struck figure. */
function Limits() {
  return (
    <div role="img" aria-label="Ten analyses per member per day, seven used in the example, and a global AI spend cap with an alert at eighty percent">
      <div className="flex items-center gap-3">
        <span className="grid flex-1 grid-cols-10 gap-1" aria-hidden>
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className={cn('block h-3 rounded-[1px]', i < 7 ? 'bg-[var(--cta)]' : 'bg-[var(--grade-off)]')} />
          ))}
        </span>
        <span className="struck shrink-0 text-[0.8rem] text-[var(--ink)]">7 / 10 today</span>
      </div>
      <p className="kicker mt-2 flex flex-wrap items-center gap-x-3 text-[var(--ink-3)]" aria-hidden>
        <span>30 / hour anti-abuse cap</span>
        <span className="h-3 w-px bg-current opacity-50" />
        <span>spend cap · alert at 80%</span>
      </p>
    </div>
  )
}

/** Photos: a twelve-month strip, the retention mark, and the laws in a row. */
function Privacy() {
  return (
    <div role="img" aria-label="Outfit photos are kept encrypted for twelve months then deleted unless the member keeps them; four privacy laws apply">
      <div className="grid grid-cols-12 gap-1" aria-hidden>
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className={cn('block h-3 rounded-[1px]', i < 11 ? 'bg-[var(--grade-good)]' : 'bg-[var(--cta)]')} />
        ))}
      </div>
      <p className="kicker mt-2 flex flex-wrap items-center gap-x-3 text-[var(--ink-3)]" aria-hidden>
        <span>12 months, then deleted</span>
        <span className="h-3 w-px bg-current opacity-50" />
        <span>CCPA · PIPEDA · UK GDPR · Privacy Act 1988</span>
      </p>
    </div>
  )
}

const DRAWINGS = [ShopifyBank, Adapters, Tiers, Markets, Limits, Privacy]

export function Constraints() {
  const reduced = useReducedMotion()
  const lg = useMedia('(min-width: 1024px)')
  const [active, setActive] = useState(0)
  const c = P.constraints[active]
  const Drawing = DRAWINGS[active] ?? DRAWINGS[0]

  return (
    <section id="constraints" aria-labelledby="constraints-h" className="section-y relative overflow-x-clip bg-[var(--ground)]">
      <div className="shell">
        <Item no="03" time="F-03" name="Conditions" id="constraints-h" lines={['Six conditions', 'the brief sets.']} aside={`${P.constraints.length} conditions · every one shapes the build`} />

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-x-10">
          {/* the giant index on the left */}
          <ol className="min-w-0 lg:col-span-6" aria-label="The conditions">
            {P.constraints.map((k, i) => {
              const on = i === active
              return (
                <li key={k.title} className="border-b border-[var(--rule-strong)] last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    aria-controls="constraint-detail"
                    data-intent="flip_constraint"
                    data-value={k.title}
                    className={cn('group flex w-full items-baseline gap-4 py-4 text-left transition-colors duration-300 lg:py-5', on ? 'text-[var(--ink)]' : 'text-[var(--ink-3)] hover:text-[var(--ink)]')}
                  >
                    <span className={cn('struck shrink-0 text-[0.8rem]', on ? 'text-[var(--money)]' : '')}>{String(i + 1).padStart(2, '0')}</span>
                    <span className="display min-w-0 text-[clamp(1.6rem,1rem+2.4vw,3.2rem)] leading-[0.98] transition-transform duration-300 ease-[var(--ease-turn)] group-hover:translate-x-1">{k.title}</span>
                  </button>
                  {/* below lg the detail opens inline under the active title */}
                  {!lg && on && <Detail c={c} Drawing={Drawing} reduced={reduced} inline />}
                </li>
              )
            })}
          </ol>

          {/* the dense column on the right, offset baseline */}
          {lg && (
            <div className="min-w-0 lg:col-span-6 lg:pt-16">
              <Detail c={c} Drawing={Drawing} reduced={reduced} />
            </div>
          )}
        </div>

        {/* two plates of the product's world */}
        <div className="mt-14 grid grid-cols-2 gap-4 lg:mt-20 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-5">
            <figure>
              <Photo img={IMG.pendants} className="aspect-[4/3] w-full [&_img]:object-[50%_40%]" sizes="(min-width:1024px) 40vw, 50vw" />
              <figcaption className="kicker mt-2 text-[var(--ink-3)]">Gold first: the store’s own world, and the metal the colour quiz leads with</figcaption>
            </figure>
          </Reveal>
          <Reveal className="min-w-0 lg:col-span-4" delay={0.1}>
            <figure>
              <Photo img={IMG.hoodie} className="aspect-[4/3] w-full [&_img]:object-[50%_30%]" sizes="(min-width:1024px) 33vw, 50vw" />
              <figcaption className="kicker mt-2 text-[var(--ink-3)]">A streetwear card from the swipe deck: licensed, tagged, editable in the admin</figcaption>
            </figure>
          </Reveal>
          <Reveal className="col-span-2 min-w-0 lg:col-span-3" delay={0.15}>
            <div className="card flex h-full flex-col justify-between p-5">
              <p className="kicker text-[var(--ink-3)]">The grade a condition earns</p>
              <p className="display mt-3 text-[1.5rem] text-[var(--ink)]">Every condition is a field, and every field is scored before we move on.</p>
              <div className="mt-5">
                <Grade scores={[100, 100, 100, 100]} labels={false} height={6} />
                <p className="kicker mt-2 text-[var(--ink-3)]">Fit · Colour · Cohesion · Occasion</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Detail({ c, Drawing, reduced, inline = false }: { c: (typeof P.constraints)[number]; Drawing: () => JSX.Element; reduced: boolean; inline?: boolean }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={c.title}
        id="constraint-detail"
        aria-live="polite"
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.12 } }}
        transition={{ duration: 0.4, ease: SETTLE }}
        className={cn('min-w-0', inline && 'pb-6 pl-10')}
      >
        <p className="kicker flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--ink-3)]">
          <span className="font-bold text-[var(--ink)]">The condition</span>
          <span aria-hidden className="h-3 w-px bg-current opacity-50" />
          <span className="normal-case">from the brief and the call</span>
        </p>
        <p className="mt-3 text-[length:var(--fs-body)] text-[var(--ink-2)]">{c.body}</p>
        <div className="mt-6 border-t border-[var(--rule-strong)] pt-5">
          <Drawing />
        </div>
        <p className="kicker mt-6 text-[var(--ink-3)]">
          <span className="font-bold text-[var(--ink)]">How it shapes the build</span>
        </p>
        <p className="mt-2 text-[length:var(--fs-small)] leading-relaxed text-[var(--ink-2)]">{c.shapes}</p>
      </motion.div>
    </AnimatePresence>
  )
}
