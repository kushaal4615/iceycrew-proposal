/* ARCHITECTURE · Archetype: exploded isometric stack. Field 06 on the report, "The setting".
   Five layers of the build stacked as plates in preserve-3d at rotateX(55deg) rotateZ(-45deg) and
   spaced by translateZ, each carrying only its L-code and the brand marks (counter-scaled so they never
   foreshorten); the layer names are flat callouts aligned to each plate's resting position on desktop
   and a plain index below lg, and they never move when a plate lifts. Click a plate and it lifts while
   the detail opens; the gold marker shares a layoutId with the callouts. Beside it, the
   integrations print as report rows with stamps. */
import { AnimatePresence, motion } from 'framer-motion'
import { useState, type CSSProperties } from 'react'
import { P, type Layer } from '../../data/proposal'
import { useMedia } from '../../hooks/useMedia'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/format'
import { BrandMark } from '../ui/BrandMark'
import { Item, Stamp } from '../ui/bits'
import { Reveal, SETTLE } from '../ui/motion'

/* the geometry of the stack, in px before the responsive scale */
const PLATE = 220 // plate side
const GAP = 114 // translateZ between plates: its screen rise (GAP·sin55 ≈ 93px) exceeds a plate's half-height, so every plate's own centre is hit-testable
const LIFT = 60 // extra translateZ for the selected plate and those above it
const TILT = (55 * Math.PI) / 180
const RISE = Math.sin(TILT) // screen rise per px of translateZ at rotateX(55deg)
const SQUASH = Math.cos(TILT) // how much rotateX(55deg) flattens the plate's vertical axis
const RHOMB_W = Math.round(PLATE * Math.SQRT2) // 311
const BASE_Y = 530 // screen y of the bottom plate's centre inside the stage
const STAGE_H = 640
const STAGE_W = RHOMB_W + 32

const plateY = (i: number) => BASE_Y - i * GAP * RISE

export function Architecture() {
  const reduced = useReducedMotion()
  const lg = useMedia('(min-width: 1024px)')
  const sm = useMedia('(min-width: 640px)')
  const [sel, setSel] = useState(P.layers.length - 1)
  const layer = P.layers[sel]
  const scale = sm ? 1 : 0.8
  const marker = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 420, damping: 32 }

  return (
    <section id="architecture" className="section-y relative bg-[var(--ground-2)] [overflow-x:clip]" aria-labelledby="architecture-h">
      <div className="shell">
        <Item no="06" time="F-06" name="The setting" id="architecture-h" lines={['Five layers', 'under the', <><em>stone.</em></>]} aside={`${P.layers.length} layers · hosted in North America`} />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          {/* the stack and, on desktop, its callouts */}
          <div className="min-w-0">
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-0">
              <div className="relative shrink-0" style={{ width: STAGE_W * scale, height: STAGE_H * scale }}>
                <div className="absolute left-0 top-0 origin-top-left" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
                  <div className="absolute left-1/2 [transform-style:preserve-3d]" style={{ top: BASE_Y, transform: 'translateX(-50%) rotateX(55deg) rotateZ(-45deg)', width: 0, height: 0, perspective: 'none' }}>
                    {P.layers.map((l, i) => (
                      <Plate key={l.id} layer={l} i={i} on={i === sel} raised={i >= sel} onPick={() => setSel(i)} reduced={reduced} />
                    ))}
                  </div>
                </div>
              </div>

              {/* flat callouts, aligned to each plate's resting position; they never move */}
              {lg && (
                <ol className="relative hidden min-w-0 flex-1 lg:block" style={{ height: STAGE_H }} aria-label="Layers">
                  {P.layers.map((l, i) => {
                    const on = i === sel
                    return (
                      <li key={l.id} className="absolute left-0 right-0 flex items-center" style={{ top: plateY(i) - 16, height: 32 }}>
                        <span aria-hidden className="block h-px w-10 shrink-0 transition-colors duration-200" style={{ background: on ? 'var(--primary)' : 'var(--rule-strong)' }} />
                        <span aria-hidden className="relative -ml-px block h-2.5 w-2.5 shrink-0 rounded-[1px]" style={{ boxShadow: 'inset 0 0 0 1px var(--rule-strong)' }}>
                          {on && <motion.span layoutId="arch-marker" className="absolute inset-0 block rounded-[1px] bg-[var(--primary)]" transition={marker} />}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSel(i)}
                          aria-pressed={on}
                          aria-controls="arch-detail"
                          data-intent="open_layer"
                          data-value={`${l.code} ${l.name}`}
                          className={cn('ml-3 flex min-h-8 min-w-0 items-baseline gap-3 text-left transition-colors duration-200', on ? 'text-[var(--ink)]' : 'text-[var(--ink-3)] hover:text-[var(--ink)]')}
                        >
                          <span className="struck text-[0.8rem]">{l.code}</span>
                          <span className="display text-[1.4rem] leading-none">{l.name}</span>
                        </button>
                      </li>
                    )
                  })}
                </ol>
              )}
            </div>

            {/* below lg: the plain index */}
            {!lg && (
              <ol className="mt-2 border-t-2 border-[var(--ink)]" aria-label="Layers">
                {P.layers.map((l, i) => {
                  const on = i === sel
                  return (
                    <li key={l.id} className="border-b border-[var(--rule-strong)]">
                      <button type="button" onClick={() => setSel(i)} aria-pressed={on} aria-controls="arch-detail" data-intent="open_layer" data-value={`${l.code} ${l.name}`} className={cn('flex min-h-12 w-full items-center gap-4 py-2 text-left', on ? 'text-[var(--ink)]' : 'text-[var(--ink-3)]')}>
                        <span aria-hidden className="relative block h-2.5 w-2.5 shrink-0 rounded-[1px]" style={{ boxShadow: 'inset 0 0 0 1px var(--rule-strong)' }}>
                          {on && <motion.span layoutId="arch-marker" className="absolute inset-0 block rounded-[1px] bg-[var(--primary)]" transition={marker} />}
                        </span>
                        <span className="struck text-[0.8rem]">{l.code}</span>
                        <span className="display min-w-0 flex-1 text-[1.4rem] leading-none">{l.name}</span>
                        <span className="flex shrink-0 gap-2">
                          {l.tech.map((t) => (
                            <BrandMark key={t.name} icon={t.icon} name={t.name} size={16} />
                          ))}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            )}
          </div>

          {/* the detail of the selected plate, and the integrations */}
          <div className="min-w-0">
            <motion.div layout id="arch-detail" aria-live="polite" className="card px-5 py-6 sm:px-10 sm:py-8" transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={layer.id} initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={{ duration: 0.4, ease: SETTLE }}>
                  <p className="kicker flex flex-wrap items-center gap-x-3 gap-y-2 border-b-2 border-[var(--ink)] pb-2 text-[var(--ink)]">
                    <span className="struck text-[var(--primary-ink)]">{layer.code}</span>
                    <span>
                      Layer {sel + 1} of {P.layers.length}
                    </span>
                    <span className="struck ml-auto text-[var(--ink-3)]">{layer.carries.length} lines</span>
                  </p>
                  <h3 className="mt-5 text-[clamp(1.9rem,1.4rem+1.8vw,2.8rem)]">{layer.name}</h3>
                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2" aria-label="Technologies">
                    {layer.tech.map((t) => (
                      <li key={t.name} className="flex items-center gap-2 text-[length:var(--fs-small)] font-medium">
                        <BrandMark icon={t.icon} name={t.name} size={18} />
                        {t.name}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-[var(--ink-2)]">{layer.detail}</p>
                  <ol className="mt-5 border-t border-[var(--rule-strong)]">
                    {layer.carries.map((c, i) => (
                      <li key={c} className="flex items-baseline gap-3 border-b border-[var(--rule)] py-2 text-[length:var(--fs-small)]">
                        <span className="struck text-[0.75rem] text-[var(--ink-3)]">{String(i + 1).padStart(2, '0')}</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* the integrations, printed as rows of the report */}
            <Reveal className="mt-10">
              <p className="kicker flex flex-wrap items-center gap-x-4 gap-y-1 border-b-2 border-[var(--ink)] pb-2 text-[var(--ink)]">
                <span className="font-bold">Integrations</span>
                <span className="normal-case text-[var(--ink-3)]">the services the build talks to</span>
                <span className="struck ml-auto text-[var(--ink-3)]">{P.integrations.length}</span>
              </p>
              <ol>
                {P.integrations.map((it) => (
                  <li key={it.name} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-b border-[var(--rule-strong)] py-4">
                    <span className="font-semibold leading-snug text-[var(--ink)]">{it.name}</span>
                    <span className="row-span-2 self-start">
                      <Stamp tone={it.status === 'IN SCOPE' ? 'verified' : 'ink'} rotate={-3} play={false}>
                        {it.status}
                      </Stamp>
                    </span>
                    <span className="text-[length:var(--fs-small)] leading-snug text-[var(--ink-2)]">{it.body}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * One plate: a layer of the build in the stack. The selected plate and every plate above it lift
 * together, opening a gap beneath the selection; inactive plates are dimmed with a fill and an ink
 * token, never opacity. The code and the marks sit at the plate's centre and are counter-rotated and
 * counter-scaled so they read upright and undistorted on screen.
 */
function Plate({ layer, i, on, raised, onPick, reduced }: { layer: Layer; i: number; on: boolean; raised: boolean; onPick: () => void; reduced: boolean }) {
  const z = i * GAP + (raised ? LIFT : 0)
  const style: CSSProperties = {
    width: PLATE,
    height: PLATE,
    left: -PLATE / 2,
    top: -PLATE / 2,
    background: on ? 'var(--card-hi)' : 'var(--card)',
    boxShadow: on ? 'inset 0 0 0 2px var(--primary), var(--card-shadow-lift)' : 'var(--card-border), var(--card-shadow)',
    color: on ? 'var(--ink)' : 'var(--ink-3)',
  }
  return (
    <motion.button
      type="button"
      onClick={onPick}
      aria-pressed={on}
      aria-controls="arch-detail"
      data-intent="open_layer"
      data-value={`${layer.code} ${layer.name}`}
      className="card absolute text-left [backface-visibility:hidden]"
      style={style}
      initial={false}
      animate={{ z }}
      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 28 }}
      whileTap={{ scale: 0.985 }}
    >
      <span className="sr-only">
        {layer.code} {layer.name}
      </span>
      {/* the plate's own ruling, lying flat on the page */}
      <span aria-hidden className="ruled pointer-events-none absolute inset-4 opacity-60" />
      {/* the code and the marks: undo the stack's rotation and its foreshortening so they stay upright */}
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 flex items-center gap-4 whitespace-nowrap"
        style={{ transform: `translate(-50%, -50%) rotate(45deg) scaleY(${(1 / SQUASH).toFixed(3)})`, transformOrigin: 'center' }}
      >
        <span className={cn('struck text-[1.15rem] font-bold', on ? 'text-[var(--primary-ink)]' : 'text-[var(--ink-3)]')}>{layer.code}</span>
        <span className="h-4 w-px bg-current opacity-40" />
        <span className="flex items-center gap-3">
          {layer.tech.map((t) => (
            <BrandMark key={t.name} icon={t.icon} name={t.name} size={22} />
          ))}
        </span>
      </span>
    </motion.button>
  )
}
