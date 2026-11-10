import { animate, motion, useInView, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/format'

/** A trolley rolling to a stop: fast out, long soft settle. */
export const SETTLE = [0.2, 0.9, 0.1, 1] as const
const PEN = SETTLE

/** Fade-and-rise when scrolled into view. One of several motion types, not the only one. */
export function Reveal({ children, delay = 0, className = '', y = 18 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.75, ease: PEN, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Headline lines that clip and slide up, 60ms apart. The heading itself watches the viewport,
 *  because a line hidden below its own clip never intersects and would never be revealed. */
export function LineMask({ lines, className = '', delay = 0, as = 'h2', style, id }: { lines: ReactNode[]; className?: string; delay?: number; as?: 'h1' | 'h2'; style?: React.CSSProperties; id?: string }) {
  const reduced = useReducedMotion()
  const Tag = as === 'h1' ? motion.h1 : motion.h2
  return (
    <Tag id={id} className={className} style={style} initial={reduced ? 'show' : 'hide'} whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            variants={{ hide: { y: '105%' }, show: { y: 0, transition: { duration: 0.8, ease: PEN, delay: delay + i * 0.06 } } }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/**
 * The log's counter wheels for money and metrics: each digit rolls in its own fixed slot, and unlit slots
 * show as ghost zeros, so a figure never reflows while it counts.
 */
export function RollingNumber({ value, prefix = '', suffix = '', className = '', slots, decimals = 0, cells = false }: { value: number; prefix?: string; suffix?: string; className?: string; slots?: number; decimals?: number; cells?: boolean }) {
  const reduced = useReducedMotion()
  const str = value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  const digitsOnly = str.replace(/\D/g, '')
  const pad = Math.max(0, (slots ?? digitsOnly.length) - digitsOnly.length)
  const ghosts = Array.from({ length: pad }, () => '0')
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true })
  return (
    <span ref={ref} className={cn('mono inline-flex items-baseline whitespace-nowrap', className)}>
      <span className="sr-only">{`${prefix}${str}${suffix}`}</span>
      <span aria-hidden data-figure={`${prefix}${str}${suffix}`} className={cn('inline-flex items-baseline', cells && 'items-center gap-[0.06em]')}>
        {prefix && <span className="mr-[0.04em] text-[0.55em] opacity-80">{prefix}</span>}
        {ghosts.map((_, i) => (
          <span key={`g${i}`} className="opacity-[0.12]">
            0
          </span>
        ))}
        {str.split('').map((ch, i) =>
          /\d/.test(ch) ? (
            cells ? (
              <span key={`${i}-${str.length}`} className="wheel px-[0.08em] py-[0.12em]">
                <Digit d={Number(ch)} run={seen} still={reduced} delay={i * 0.05} />
              </span>
            ) : (
              <Digit key={`${i}-${str.length}`} d={Number(ch)} run={seen} still={reduced} delay={i * 0.05} />
            )
          ) : (
            <span key={i}>{ch}</span>
          ),
        )}
        {suffix && <span className="ml-[0.08em] text-[0.5em] opacity-80">{suffix}</span>}
      </span>
    </span>
  )
}

/** One wheel digit: waits at 0 until its figure is in view, then rolls to its value (static under reduced motion). */
function Digit({ d, run, still, delay }: { d: number; run: boolean; still: boolean; delay: number }) {
  const y = useMotionValue(still ? -d : 0)
  useEffect(() => {
    if (still) {
      y.set(-d)
      return
    }
    if (!run) return
    const c = animate(y, -d, { type: 'spring', stiffness: 120, damping: 20, delay })
    return () => c.stop()
  }, [d, run, still, delay, y])
  const t = useTransform(y, (v) => `${v * 10}%`)
  return (
    <span className="relative inline-block h-[1em] overflow-hidden leading-none" style={{ width: '0.62em' }}>
      <motion.span className="absolute left-0 top-0 flex flex-col leading-none" style={{ y: t }}>
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="block h-[1em] leading-none">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

/** Counter that tweens a plain number (used where rolling digits would be too loud). */
export function Counter({ to, className = '' }: { to: number; className?: string }) {
  const reduced = useReducedMotion()
  const [v, setV] = useState(reduced ? to : 0)
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true })
  useEffect(() => {
    if (!seen || reduced) return setV(to)
    const c = animate(0, to, { duration: 1.1, ease: PEN, onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [seen, to, reduced])
  return (
    <span ref={ref} className={cn('mono', className)}>
      {v}
    </span>
  )
}

/** A button that leans toward the pointer inside a radius and springs back. */
export function Magnetic({ children, strength = 0.28, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const reduced = useReducedMotion()
  const x = useSpring(0, { stiffness: 400, damping: 28 })
  const y = useSpring(0, { stiffness: 400, damping: 28 })
  return (
    <motion.span
      className={cn('inline-block', className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.span>
  )
}

/** Pointer tilt with a moving specular highlight, for the plate family. */
export function Tilt3D({ children, className = '', max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const reduced = useReducedMotion()
  const rx = useSpring(0, { stiffness: 300, damping: 26 })
  const ry = useSpring(0, { stiffness: 300, damping: 26 })
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const glare = useTransform([gx, gy] as MotionValue<number>[], ([a, b]) => `radial-gradient(circle at ${a}% ${b}%, rgb(255 255 255 / 0.28), transparent 55%)`)
  return (
    <motion.div
      className={cn('relative [transform-style:preserve-3d]', className)}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        ry.set((px - 0.5) * max * 2)
        rx.set((0.5 - py) * max * 2)
        gx.set(px * 100)
        gy.set(py * 100)
      }}
      onPointerLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
    >
      {children}
      {!reduced && <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[var(--r-plate)]" style={{ background: glare }} />}
    </motion.div>
  )
}

/** A pointer-following radial light for dark surfaces. */
export function Spotlight({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion()
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const bg = useTransform([x, y] as MotionValue<number>[], ([a, b]) => `radial-gradient(420px circle at ${a}px ${b}px, var(--close-glow), transparent 70%)`)
  if (reduced) return null
  return (
    <motion.div
      aria-hidden
      className={cn('absolute inset-0', className)}
      style={{ background: bg }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set(e.clientX - r.left)
        y.set(e.clientY - r.top)
      }}
    />
  )
}

/** An SVG path that draws itself like a pen stroke. */
export function Draw({ d, className = '', delay = 0, strokeWidth = 1.5 }: { d: string; className?: string; delay?: number; strokeWidth?: number }) {
  const reduced = useReducedMotion()
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease: PEN, delay }}
    />
  )
}
