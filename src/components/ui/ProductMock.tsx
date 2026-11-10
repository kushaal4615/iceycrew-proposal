/* ProductMock: the real AI Style Assistant, drawn in code. The clickable prototype's Gallery Gold look
   (off-white ground, near-black ink, the IceyCrew gold for the camera button, the score ring and every
   accent) inside a CSS phone (the member app) or a CSS laptop (the admin panel).

   Every screen is laid out once at a fixed logical size (phone 360 x 780, laptop 1040 x 650) and the whole
   device is scaled with transform: scale() inside a fixed-aspect box, so text never reflows between sizes.
   The frame stays fluid: it never exceeds its parent and a ResizeObserver rescales it below the frame width.
   Colours: only --scr-* (the product, never theme-inverted) and --device-* (the hardware). */

import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  BrainCircuit,
  Camera,
  ChartColumn,
  Check,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Hash,
  Heart,
  House,
  Images,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Mail,
  MapPin,
  Palette,
  Play,
  RefreshCw,
  Save,
  Search,
  Settings2,
  Share,
  Shirt,
  Signal,
  Sparkles,
  Star,
  TriangleAlert,
  Users,
  Wifi,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { IMG, SCREEN_INK, SEASON, WEB_SCREENS, type Screen } from '../../data/proposal'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/format'
import { SETTLE } from './motion'

/* ------------------------------------------------------------------ constants */

const PHONE = { w: 380, h: 800, sw: 360, sh: 780, bezel: 10 } as const
const LAPTOP = { w: 1180, h: 704, lidW: 1068, lidH: 678, sw: 1040, sh: 650, bezel: 14, baseH: 26 } as const
const FRAME_W = { phone: { lg: 300, md: 240, sm: 170 }, laptop: { lg: 720, md: 560, sm: 400 } } as const

const S = {
  bg: 'var(--scr-bg)',
  surface: 'var(--scr-surface)',
  raised: 'var(--scr-raised)',
  high: 'var(--scr-high)',
  rule: 'var(--scr-rule)',
  ink: 'var(--scr-ink)',
  ink2: 'var(--scr-ink-2)',
  ink3: 'var(--scr-ink-3)',
  night: 'var(--scr-night)',
  night2: 'var(--scr-night-2)',
  onNight: 'var(--scr-on-night)',
  onNight2: 'var(--scr-on-night-2)',
  gold: 'var(--scr-gold)',
  onGold: 'var(--scr-on-gold)',
  goldText: 'var(--scr-gold-text)',
  goldLight: 'var(--scr-gold-light)',
  goldSoft: 'var(--scr-gold-soft)',
  strong: 'var(--scr-strong)',
  good: 'var(--scr-good)',
  work: 'var(--scr-work)',
  success: 'var(--scr-success)',
  successSoft: 'var(--scr-success-soft)',
  dangerSoft: 'var(--scr-danger-soft)',
} as const

const mix = (c: string, pct: number) => `color-mix(in srgb, ${c} ${pct}%, transparent)`

const DISPLAY: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 0.95 }
const NUM: CSSProperties = { ...DISPLAY, fontVariantNumeric: 'lining-nums tabular-nums', letterSpacing: '-0.03em' }
const MONO: CSSProperties = { fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }
const KICKER: CSSProperties = { fontSize: 9.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: S.ink3 }
const CARD_SHADOW = `0 1px 2px ${mix(S.ink, 5)}, 0 10px 24px -14px ${mix(S.ink, 20)}`

const ARIA: Record<Screen, string> = {
  verify: 'Style Assistant member app, verify your VIP order: checkout email maya.delgado@demo-iceycrew.app and order number #IC-48213 filled in, the five checks the backend makes with the Shopify Admin API, and the Verify my order button.',
  swipe: 'Style Assistant onboarding, the swipe deck: card 15 of 20, a blue check three-piece suit tagged Classic, 8 liked so far, with pass, undo and like buttons.',
  home: 'Style Assistant home: good morning Maya, the elevated streetwear style summary, the gold Scan today’s outfit button with 41°F light rain, your last fit scored 72 with Try again, 3 of 10 scans today, My Colours Deep Autumn, and the newsletter The Edit week of November 8 with a card from Elle; tabs Home, Camera, My Style.',
  camera: 'Style Assistant camera: the live viewfinder with a full-body guide, the weather chip 41°F light rain 14 mph, occasion chips Work selected, Casual, Date, Night out, the gallery button and the gold shutter.',
  analysis: 'Style Assistant analysis: a burgundy wool coat, camel knit and black trousers, Work, Chicago 41°F light rain; overall 84 out of 100, Strong; Fit 88, Colour 91, Cohesion 82, Occasion 74; what’s working, what could be better, and the first tip to level up the fit.',
  colours: 'Style Assistant My Colours: Deep Autumn, warm undertone, deep, best metals gold, bronze and copper, a palette of fourteen best colours and four to avoid, saved to the profile.',
  adminMembers: 'Style Assistant admin panel, members and status: 20 active, 1 cancelled, 2 lapsed, 1 refunded; a table of members with status, paid until, provider IDs, scans and average score, and Maya Delgado’s provider-neutral membership record open in the inspector.',
  adminAi: 'Style Assistant admin panel, AI prompts and criteria: the system prompt v14, the four rating criteria with weights Fit 30, Colour 25, Cohesion 25, Occasion 20, the vision provider, and the structured JSON schema the backend validates.',
}

/* ------------------------------------------------------------------ the component */

export function ProductMock({ screen, tilt = 'pointer', size = 'lg', className = '' }: { screen: Screen; tilt?: 'pointer' | 'none'; size?: 'lg' | 'md' | 'sm'; className?: string }) {
  const reduced = useReducedMotion()
  const web = WEB_SCREENS.includes(screen)
  const D = web ? { w: LAPTOP.w, h: LAPTOP.h } : { w: PHONE.w, h: PHONE.h }
  const W = web ? FRAME_W.laptop[size] : FRAME_W.phone[size]
  const live = tilt === 'pointer' && !reduced

  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(W / D.w)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const apply = () => setScale(Math.max(0.05, el.getBoundingClientRect().width / D.w))
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [D.w])

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 170, damping: 22, mass: 0.7 })
  const sy = useSpring(py, { stiffness: 170, damping: 22, mass: 0.7 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const flat = useTransform(scrollYProgress, [0.5, 0.88], [1, 0], { clamp: true })
  const MAX = 8
  const rotateY = useTransform([sx, flat] as MotionValue<number>[], ([x, a]: number[]) => (-3 + x * MAX) * a)
  const rotateX = useTransform([sy, flat] as MotionValue<number>[], ([y, a]: number[]) => (2 - y * MAX) * a)
  const hx = useTransform(sx, [-1, 1], [20, 80])
  const hy = useTransform(sy, [-1, 1], [15, 75])
  const glare = useMotionTemplate`radial-gradient(55% 40% at ${hx}% ${hy}%, ${mix(S.surface, 34)}, transparent 70%)`

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!live || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set(Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1)))
    py.set(Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1)))
  }
  const onLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <div
      ref={ref}
      data-mock
      data-size={size}
      data-screen={screen}
      role="img"
      aria-label={ARIA[screen]}
      className={cn('relative select-none', className)}
      style={{ width: `min(${W}px, 100vw - 2rem)`, maxWidth: '100%', perspective: live ? 1400 : undefined }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <motion.div aria-hidden className="relative" style={live ? { rotateX, rotateY, transformPerspective: 1400, transformStyle: 'preserve-3d' } : undefined}>
        <div className="relative w-full" style={{ aspectRatio: `${D.w} / ${D.h}` }}>
          <div className="absolute left-0 top-0" style={{ width: D.w, height: D.h, transform: `scale(${scale})`, transformOrigin: '0 0', fontFamily: 'var(--font-body)', color: S.ink, lineHeight: 1.3 }}>
            {web ? <Laptop screen={screen} reduced={reduced} glare={live ? glare : null} /> : <Phone screen={screen} reduced={reduced} glare={live ? glare : null} />}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function Swap({ screen, reduced, children }: { screen: Screen; reduced: boolean; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={screen}
        className="absolute inset-0"
        initial={reduced ? { opacity: 1 } : { opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, x: -24, transition: { duration: 0.2 } }}
        transition={{ duration: 0.5, ease: SETTLE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ hardware */

const DARK_TOP: Screen[] = ['camera', 'analysis', 'colours']

function Phone({ screen, reduced, glare }: { screen: Screen; reduced: boolean; glare: MotionValue<string> | null }) {
  const dark = DARK_TOP.includes(screen)
  const r = 'var(--r-device)'
  return (
    <div
      className="relative"
      style={{
        width: PHONE.w,
        height: PHONE.h,
        borderRadius: r,
        background: 'var(--device-body)',
        padding: PHONE.bezel,
        boxShadow: `inset 0 0 0 1.5px var(--device-edge), inset 0 0 0 3px var(--device-body), 0 40px 70px -30px ${mix('var(--device-body)', 60)}, 0 12px 24px -10px ${mix('var(--device-body)', 45)}`,
      }}
    >
      <span className="absolute rounded-l-[2px]" style={{ left: -3, top: 150, width: 3, height: 32, background: 'var(--device-edge)' }} />
      <span className="absolute rounded-l-[2px]" style={{ left: -3, top: 200, width: 3, height: 58, background: 'var(--device-edge)' }} />
      <span className="absolute rounded-l-[2px]" style={{ left: -3, top: 268, width: 3, height: 58, background: 'var(--device-edge)' }} />
      <span className="absolute rounded-r-[2px]" style={{ right: -3, top: 220, width: 3, height: 84, background: 'var(--device-edge)' }} />
      <div className="relative overflow-hidden" style={{ width: PHONE.sw, height: PHONE.sh, borderRadius: `calc(${r} - ${PHONE.bezel}px)`, background: screen === 'camera' ? S.night : S.bg, isolation: 'isolate' }}>
        <Swap screen={screen} reduced={reduced}>
          <PhoneScreen screen={screen} reduced={reduced} />
        </Swap>
        <StatusBar dark={dark} />
        <span className="absolute left-1/2 z-20 -translate-x-1/2 rounded-full" style={{ bottom: 8, width: 120, height: 4, background: screen === 'camera' ? S.onNight : S.ink }} />
        {glare && <motion.div className="pointer-events-none absolute inset-0 z-30" style={{ background: glare, mixBlendMode: 'soft-light' }} />}
      </div>
    </div>
  )
}

function StatusBar({ dark }: { dark: boolean }) {
  const ink = dark ? S.onNight : S.ink
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between" style={{ height: 44, padding: '0 24px', color: ink }}>
      <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em', ...MONO }}>08:14</span>
      <span className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ top: 9, width: 98, height: 28, background: 'var(--device-body)' }} />
      <span className="flex items-center" style={{ gap: 5 }}>
        <Signal size={12} strokeWidth={2.4} />
        <Wifi size={12} strokeWidth={2.4} />
        <span className="relative flex items-center rounded-[3px]" style={{ width: 22, height: 11, padding: 1.5, boxShadow: `inset 0 0 0 1px ${mix(ink, 45)}` }}>
          <span className="h-full rounded-[1.5px]" style={{ width: '82%', background: ink }} />
        </span>
      </span>
    </div>
  )
}

function Laptop({ screen, reduced, glare }: { screen: Screen; reduced: boolean; glare: MotionValue<string> | null }) {
  return (
    <div className="relative" style={{ width: LAPTOP.w, height: LAPTOP.h }}>
      <div
        className="relative mx-auto"
        style={{
          width: LAPTOP.lidW,
          height: LAPTOP.lidH,
          borderRadius: '18px 18px 4px 4px',
          background: 'var(--device-body)',
          padding: LAPTOP.bezel,
          boxShadow: `inset 0 0 0 1.5px var(--device-edge), 0 36px 60px -30px ${mix('var(--device-body)', 55)}`,
        }}
      >
        <span className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ top: 5, width: 5, height: 5, background: 'var(--device-edge)' }} />
        <div className="relative overflow-hidden" style={{ width: LAPTOP.sw, height: LAPTOP.sh, borderRadius: 5, background: S.bg, isolation: 'isolate' }}>
          <Swap screen={screen} reduced={reduced}>
            <WebScreen screen={screen} />
          </Swap>
          {glare && <motion.div className="pointer-events-none absolute inset-0 z-30" style={{ background: glare, mixBlendMode: 'soft-light' }} />}
        </div>
      </div>
      <div
        className="relative"
        style={{
          width: LAPTOP.w,
          height: LAPTOP.baseH,
          marginTop: -2,
          borderRadius: '3px 3px 14px 14px',
          background: 'linear-gradient(to bottom, var(--device-base), var(--device-base-2))',
          boxShadow: `0 22px 30px -16px ${mix('var(--device-body)', 50)}`,
        }}
      >
        <span className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-[8px]" style={{ width: 150, height: 7, background: 'var(--device-base-2)' }} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ shared drawings */

type Sub = { fit: number; colour: number; cohesion: number; occasion: number }
const TODAY: Sub = { fit: 88, colour: 91, cohesion: 82, occasion: 74 }
const bandOf = (v: number) => (v >= 80 ? S.strong : v >= 60 ? S.good : S.work)

/** The product's signature: the Ice Ring. A score in a thin gold ring with a diamond marker at its angle. */
function Ring({ value, size = 96, stroke = 7, dark = false, label, children }: { value: number; size?: number; stroke?: number; dark?: boolean; label?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2 - 2
  const c = 2 * Math.PI * r
  const angle = (value / 100) * 360 - 90
  const cx = size / 2 + r * Math.cos((angle * Math.PI) / 180)
  const cy = size / 2 + r * Math.sin((angle * Math.PI) / 180)
  const gem = Math.max(5, stroke * 0.95)
  const fill = bandOf(value)
  return (
    <span className="relative inline-grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={dark ? 'rgb(255 255 255 / 0.14)' : S.high} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={fill} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
        <path d={`M${cx} ${cy - gem} L${cx + gem} ${cy} L${cx} ${cy + gem} L${cx - gem} ${cy} Z`} fill={fill} stroke={dark ? S.night : S.surface} strokeWidth={1.5} />
      </svg>
      <span className="relative flex flex-col items-center justify-center text-center">
        {children ?? (
          <>
            <span style={{ ...NUM, fontSize: size * 0.34, color: dark ? S.onNight : S.ink }}>{value}</span>
            {label && <span style={{ ...KICKER, marginTop: 2, color: dark ? S.onNight2 : S.ink3, fontSize: Math.max(8, size * 0.085) }}>{label}</span>}
          </>
        )}
      </span>
    </span>
  )
}

/** The scorecard strip: Fit · Colour · Cohesion · Occasion. */
function Strip({ s, dark = false, labels = true, h = 6 }: { s: Sub; dark?: boolean; labels?: boolean; h?: number }) {
  const rows: [string, number][] = [['Fit', s.fit], ['Colour', s.colour], ['Cohesion', s.cohesion], ['Occasion', s.occasion]]
  return (
    <div className="grid w-full" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6 }}>
      {rows.map(([n, v]) => (
        <span key={n} className="block min-w-0">
          {labels && (
            <span className="flex items-baseline justify-between" style={{ fontSize: 10, fontWeight: 700, color: dark ? S.onNight2 : S.ink3, marginBottom: 3 }}>
              <span className="truncate">{n}</span>
              <span style={{ ...MONO, color: dark ? S.onNight : S.ink }}>{v}</span>
            </span>
          )}
          <span className="relative block w-full overflow-hidden rounded-full" style={{ height: h, background: dark ? 'rgb(255 255 255 / 0.14)' : S.high }}>
            <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${v}%`, background: bandOf(v) }} />
          </span>
        </span>
      ))}
    </div>
  )
}

/** A photograph inside the product, plain (the product's own screens never duotone their photos). */
function Pic({ src, style, pos = 'center' }: { src: string; style?: CSSProperties; pos?: string }) {
  return <img src={src} alt="" draggable={false} className="block h-full w-full object-cover" style={{ objectPosition: pos, color: 'transparent', ...style }} />
}

function Chip({ children, on = false, dark = false }: { children: ReactNode; on?: boolean; dark?: boolean }) {
  return (
    <span className="inline-flex items-center whitespace-nowrap rounded-full" style={{ height: 24, padding: '0 10px', fontSize: 10.5, fontWeight: 700, background: on ? S.gold : dark ? 'rgb(255 255 255 / 0.16)' : S.high, color: on ? S.onGold : dark ? S.onNight : S.ink }}>
      {children}
    </span>
  )
}

function GoldBtn({ children, icon: Icon, dark = false, outline = false }: { children: ReactNode; icon?: LucideIcon; dark?: boolean; outline?: boolean }) {
  return (
    <span className="flex items-center justify-center gap-2 rounded-full" style={{ height: 50, fontSize: 14, fontWeight: 700, background: outline ? 'transparent' : S.gold, color: outline ? (dark ? S.onNight : S.ink) : S.onGold, boxShadow: outline ? `inset 0 0 0 1.5px ${dark ? 'rgb(255 255 255 / 0.3)' : S.rule}` : `0 12px 32px -12px ${mix(S.gold, 70)}` }}>
      {Icon && <Icon size={16} strokeWidth={2.4} />}
      {children}
    </span>
  )
}

/** The three-tab dock: Home · Camera (raised, gold) · My Style. */
function Dock({ active }: { active: 'home' | 'camera' | 'style' }) {
  const Tab = ({ icon: Icon, label, on }: { icon: LucideIcon; label: string; on: boolean }) => (
    <span className="relative flex flex-col items-center" style={{ gap: 3, width: 70, color: on ? S.ink : S.ink3 }}>
      <Icon size={21} strokeWidth={on ? 2.5 : 2} />
      <span style={{ fontSize: 10.5, fontWeight: 700 }}>{label}</span>
      {on && <span className="absolute rounded-full" style={{ bottom: -6, width: 18, height: 3, background: S.gold }} />}
    </span>
  )
  return (
    <div className="absolute z-20 flex items-center justify-between rounded-[22px]" style={{ left: 14, right: 14, bottom: 22, height: 64, padding: '0 20px', background: mix(S.surface, 82), backdropFilter: 'blur(18px)', boxShadow: `inset 0 1px 0 ${S.surface}, 0 12px 32px -14px ${mix(S.ink, 35)}` }}>
      <Tab icon={House} label="Home" on={active === 'home'} />
      <span className="relative flex flex-col items-center" style={{ marginTop: -34, gap: 4, width: 80 }}>
        <span className="grid place-items-center rounded-full" style={{ width: 62, height: 62, background: S.gold, color: S.onGold, boxShadow: `0 12px 32px -12px ${mix(S.gold, 70)}, 0 0 0 4px ${S.bg}` }}>
          <Camera size={28} strokeWidth={2.3} />
        </span>
        <span style={{ ...KICKER, color: S.ink, fontSize: 10 }}>Camera</span>
      </span>
      <Tab icon={Shirt} label="My Style" on={active === 'style'} />
    </div>
  )
}

function Top({ title, dark = false, back = true, right }: { title: string; dark?: boolean; back?: boolean; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '54px 12px 0', height: 100, color: dark ? S.onNight : S.ink }}>
      {back ? (
        <span className="flex items-center" style={{ fontSize: 14, fontWeight: 600 }}>
          <ChevronLeft size={24} /> Back
        </span>
      ) : (
        <span />
      )}
      <span style={{ fontSize: 16, fontWeight: 700 }}>{title}</span>
      <span style={{ minWidth: 60 }} className="flex justify-end">
        {right}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ phone screens */

function PhoneScreen({ screen, reduced }: { screen: Screen; reduced: boolean }) {
  switch (screen) {
    case 'verify':
      return <Verify />
    case 'swipe':
      return <Swipe />
    case 'home':
      return <Home />
    case 'camera':
      return <CameraScreen />
    case 'analysis':
      return <Analysis reduced={reduced} />
    case 'colours':
      return <Colours />
    default:
      return <Home />
  }
}

const CHECKS = ['Order exists on the IceyCrew store', 'Email matches the order', 'Order contains the VIP product', 'Subscription is active and paid', 'Not already linked to an account']

function Verify() {
  return (
    <div className="absolute inset-0" style={{ background: S.bg }}>
      <Top title="Verify your VIP order" />
      <div style={{ padding: '4px 20px 0' }}>
        <div className="flex items-center" style={{ gap: 6, color: S.goldText, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em' }}>
          <BadgeCheck size={13} strokeWidth={2.4} /> VIP <span style={{ ...MONO, color: S.ink3, fontWeight: 500, letterSpacing: 0, textTransform: 'none' }}>· monthly, billed by the store</span>
        </div>
        <p style={{ ...DISPLAY, fontSize: 30, marginTop: 8 }}>
          Two things from your <em style={{ fontStyle: 'italic', fontWeight: 400, color: S.goldText }}>checkout email.</em>
        </p>
        <p style={{ fontSize: 13, color: S.ink2, marginTop: 8, lineHeight: 1.35 }}>We check them with the store once. The app never talks to Shopify; it asks our membership layer.</p>
        {[
          ['Checkout email', 'maya.delgado@demo-iceycrew.app', Mail],
          ['Order number', '#IC-48213', Hash],
        ].map(([l, v, I]) => {
          const Icon = I as LucideIcon
          return (
            <div key={l as string} style={{ marginTop: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{l as string}</span>
              <span className="flex items-center" style={{ marginTop: 6, height: 46, padding: '0 14px', gap: 8, borderRadius: 12, background: S.raised, boxShadow: `inset 0 0 0 1px ${S.rule}`, fontSize: 14 }}>
                <Icon size={15} color={S.ink3} /> {v as string}
              </span>
            </div>
          )
        })}
        <div style={{ marginTop: 18, padding: 14, borderRadius: 16, background: S.surface, boxShadow: CARD_SHADOW }}>
          <span style={KICKER}>What we check</span>
          <ol style={{ marginTop: 10, display: 'grid', gap: 8 }}>
            {CHECKS.map((c, i) => (
              <li key={c} className="flex items-center" style={{ gap: 10, fontSize: 12.5 }}>
                <span className="grid place-items-center rounded-full" style={{ width: 22, height: 22, background: i < 2 ? S.gold : S.high, color: i < 2 ? S.onGold : S.ink3, ...MONO, fontSize: 10, fontWeight: 700 }}>{i < 2 ? <Check size={12} strokeWidth={3} /> : i + 1}</span>
                <span style={{ color: i < 2 ? S.ink : S.ink2, fontWeight: i < 2 ? 600 : 400 }}>{c}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="absolute" style={{ left: 16, right: 16, bottom: 28 }}>
        <GoldBtn icon={ArrowRight}>Verify my order</GoldBtn>
      </div>
    </div>
  )
}

function Swipe() {
  return (
    <div className="absolute inset-0" style={{ background: S.bg }}>
      <div style={{ padding: '54px 16px 0' }}>
        <div className="flex items-center" style={{ gap: 8 }}>
          <ChevronLeft size={22} />
          <span className="flex flex-1" style={{ gap: 4 }}>
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="flex-1 rounded-full" style={{ height: 5, background: S.gold }} />
            ))}
          </span>
          <span style={{ ...MONO, fontSize: 10, color: S.ink3 }}>8/8</span>
        </div>
        <p style={{ ...KICKER, color: S.goldText, marginTop: 10 }}>Swipe deck · card 15 of 20</p>
        <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: S.ink2 }}>Right for like, left for pass</span>
          <Chip>
            <Heart size={10} fill="currentColor" style={{ marginRight: 4 }} /> 8 liked
          </Chip>
        </div>
      </div>
      <div className="absolute overflow-hidden" style={{ left: 16, right: 16, top: 150, bottom: 150, borderRadius: 22, boxShadow: `0 18px 44px -14px ${mix(S.ink, 40)}` }}>
        <Pic src={IMG.beige.src} pos="top" />
        <span className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgb(10 10 10 / 0.9), rgb(10 10 10 / 0.5) 35%, transparent 70%)' }} />
        <span className="absolute" style={{ left: 14, top: 14 }}>
          <Chip>Minimalist</Chip>
        </span>
        <span className="absolute rounded-full" style={{ right: 14, top: 14, padding: '5px 10px', background: 'rgb(10 10 10 / 0.5)', color: S.onNight, ...MONO, fontSize: 10 }}>
          15 / 20
        </span>
        <span className="absolute" style={{ left: 16, bottom: 16, color: S.onNight }}>
          <span style={{ ...DISPLAY, fontSize: 24, display: 'block' }}>Pale shirt, wide trousers</span>
          <span style={{ ...MONO, fontSize: 10, color: S.onNight2, display: 'block', marginTop: 4 }}>Unsplash · Unsplash License</span>
        </span>
      </div>
      <div className="absolute flex items-center justify-center" style={{ left: 0, right: 0, bottom: 56, gap: 20 }}>
        <span className="grid place-items-center rounded-full" style={{ width: 62, height: 62, background: S.surface, boxShadow: CARD_SHADOW }}>
          <X size={26} strokeWidth={2.6} />
        </span>
        <span className="grid place-items-center rounded-full" style={{ width: 42, height: 42, background: S.high, color: S.ink3 }}>
          <RefreshCw size={16} />
        </span>
        <span className="grid place-items-center rounded-full" style={{ width: 62, height: 62, background: S.gold, color: S.onGold, boxShadow: `0 12px 32px -12px ${mix(S.gold, 70)}` }}>
          <Heart size={26} strokeWidth={2.6} />
        </span>
      </div>
    </div>
  )
}

function Home() {
  return (
    <div className="absolute inset-0" style={{ background: S.bg }}>
      <div style={{ padding: '56px 20px 0' }}>
        <div className="flex items-start justify-between">
          <span>
            <span style={{ ...KICKER, color: S.goldText }}>Tue, Nov 10, 2026 · Chicago, IL</span>
            <span className="flex items-center" style={{ gap: 4, marginTop: 4, color: S.goldText, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em' }}>
              <BadgeCheck size={13} strokeWidth={2.4} /> VIP MEMBER
            </span>
          </span>
          <span className="overflow-hidden rounded-full" style={{ width: 36, height: 36, boxShadow: `0 0 0 2px ${S.bg}, 0 0 0 4px ${S.gold}` }}>
            <Pic src={IMG.maya.src} pos="50% 20%" />
          </span>
        </div>
        <p style={{ ...DISPLAY, fontSize: 36, marginTop: 14 }}>
          Good morning, <em style={{ fontStyle: 'italic', fontWeight: 400, color: S.goldText }}>Maya.</em>
        </p>
        <p style={{ fontSize: 13, color: S.ink2, marginTop: 6, lineHeight: 1.35 }}>You lean elevated streetwear: neutral tones, relaxed fits, one gold piece that does the talking.</p>
        <div className="relative overflow-hidden" style={{ marginTop: 16, borderRadius: 22, background: S.night, color: S.onNight, boxShadow: CARD_SHADOW }}>
          <span className="absolute inset-0" style={{ opacity: 0.55 }}>
            <Pic src={IMG.plaid.src} pos="center 30%" />
          </span>
          <span className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgb(10 10 10 / 0.94) 0%, rgb(10 10 10 / 0.78) 45%, rgb(10 10 10 / 0.25) 100%)' }} />
          <div className="relative flex items-center" style={{ padding: 18, gap: 12 }}>
            <span className="min-w-0 flex-1">
              <span style={{ ...KICKER, color: S.goldLight }}>Style assistant</span>
              <span style={{ ...DISPLAY, fontSize: 24, display: 'block', marginTop: 4 }}>Scan today’s outfit</span>
              <span className="flex items-center" style={{ gap: 8, marginTop: 8 }}>
                <Chip dark>
                  <span style={MONO}>41°F</span>&nbsp;· Light rain · 14 mph
                </Chip>
                <span style={{ ...MONO, fontSize: 10, color: S.onNight2 }}>3 of 10 today</span>
              </span>
            </span>
            <span className="grid shrink-0 place-items-center rounded-full" style={{ width: 56, height: 56, background: S.gold, color: S.onGold, boxShadow: `0 12px 32px -12px ${mix(S.gold, 70)}` }}>
              <Camera size={26} strokeWidth={2.3} />
            </span>
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: 10, marginTop: 10 }}>
          <div className="flex min-w-0" style={{ gap: 10, padding: 10, borderRadius: 16, background: S.surface, boxShadow: CARD_SHADOW }}>
            <span className="shrink-0 overflow-hidden" style={{ width: 54, height: 72, borderRadius: 10 }}>
              <Pic src={IMG.yellow.src} pos="top" />
            </span>
            <span className="min-w-0">
              <span style={KICKER}>Your last fit</span>
              <span style={{ ...NUM, fontSize: 22, display: 'block', marginTop: 4 }}>
                72<span style={{ fontSize: 10, color: S.ink3, marginLeft: 2, fontFamily: 'var(--font-body)' }}>/100</span>
              </span>
              <span className="flex items-center" style={{ gap: 3, marginTop: 4, fontSize: 11, fontWeight: 700, color: S.goldText }}>
                Try again? <ArrowRight size={10} />
              </span>
            </span>
          </div>
          <div className="flex min-w-0 flex-col items-center justify-center" style={{ padding: 8, borderRadius: 16, background: S.surface, boxShadow: CARD_SHADOW }}>
            <Ring value={30} size={64} stroke={5}>
              <span style={{ ...MONO, fontSize: 16, fontWeight: 700 }}>
                3<span style={{ fontSize: 9, color: S.ink3 }}>/10</span>
              </span>
            </Ring>
            <span style={{ ...KICKER, marginTop: 4, fontSize: 8.5 }}>Scans today</span>
          </div>
        </div>
        <div className="flex items-center rounded-full" style={{ marginTop: 10, padding: '6px 12px 6px 6px', gap: 10, background: mix(S.gold, 10) }}>
          <span className="flex" style={{ marginLeft: 4 }}>
            {PALETTE.slice(0, 5).map((c, i) => (
              <span key={c} className="rounded-full" style={{ width: 22, height: 22, background: c, marginLeft: i ? -6 : 0, boxShadow: `0 0 0 2px ${S.bg}` }} />
            ))}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700 }}>
            My Colours · <span style={{ color: S.goldText }}>Deep Autumn</span> · gold first
          </span>
          <Palette size={14} color={S.ink3} style={{ marginLeft: 'auto' }} />
        </div>
        <div style={{ marginTop: 18, borderTop: `3px solid ${S.ink}`, paddingTop: 12 }}>
          <span style={{ ...KICKER, color: S.goldText }}>Style tips · from iceycrew.com</span>
          <span style={{ ...DISPLAY, fontSize: 26, display: 'block', marginTop: 4 }}>The Edit</span>
          <span style={{ ...MONO, fontSize: 10, color: S.ink3 }}>Week of November 8, 2026 · newest first</span>
        </div>
        <div className="overflow-hidden" style={{ marginTop: 12, borderRadius: 16, background: S.surface, boxShadow: CARD_SHADOW }}>
          <span className="relative block" style={{ height: 96 }}>
            <Pic src={IMG.rack.src} />
            <span className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgb(10 10 10 / 0.9), transparent 70%)' }} />
            <span className="absolute" style={{ left: 12, bottom: 10, color: S.onNight }}>
              <span style={{ ...KICKER, color: S.goldLight }}>Elle</span>
              <span style={{ ...DISPLAY, fontSize: 16, display: 'block' }}>Seven Ways to Wear Flats With Jeans This Fall</span>
            </span>
          </span>
        </div>
      </div>
      <Dock active="home" />
    </div>
  )
}

function CameraScreen() {
  return (
    <div className="absolute inset-0" style={{ background: S.night }}>
      <span className="absolute inset-0">
        <Pic src={IMG.coat.src} pos="center 30%" />
      </span>
      <span className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgb(10 10 10 / 0.7) 0%, transparent 22%, transparent 55%, rgb(10 10 10 / 0.88) 100%)' }} />
      <svg className="absolute" style={{ left: '50%', top: 130, transform: 'translateX(-50%)', height: 420 }} viewBox="0 0 120 300" fill="none">
        <circle cx="60" cy="34" r="22" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeDasharray="6 6" />
        <path d="M34 70h52c10 0 18 8 18 18v70c0 6-4 10-10 10h-6v110c0 6-4 10-10 10H42c-6 0-10-4-10-10V168h-6c-6 0-10-4-10-10V88c0-10 8-18 18-18Z" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeDasharray="6 6" />
      </svg>
      <div className="absolute flex items-center justify-between" style={{ left: 12, right: 12, top: 56, color: S.onNight }}>
        <span className="grid place-items-center rounded-full" style={{ width: 40, height: 40, background: 'rgb(10 10 10 / 0.5)' }}>
          <X size={20} />
        </span>
        <Chip dark>
          <span style={MONO}>41°F</span>&nbsp;· Light rain · 14 mph
        </Chip>
        <span className="flex" style={{ gap: 6 }}>
          <span className="grid place-items-center rounded-full" style={{ width: 40, height: 40, background: 'rgb(10 10 10 / 0.5)' }}>
            <Zap size={18} />
          </span>
          <span className="grid place-items-center rounded-full" style={{ width: 40, height: 40, background: 'rgb(10 10 10 / 0.5)' }}>
            <RefreshCw size={18} />
          </span>
        </span>
      </div>
      <span className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ top: 106, padding: '5px 12px', background: 'rgb(10 10 10 / 0.55)', color: S.onNight, ...KICKER, fontSize: 9 }}>
        Fit your whole body in the guide
      </span>
      <div className="absolute" style={{ left: 16, right: 16, bottom: 36 }}>
        <div className="flex" style={{ gap: 6, overflow: 'hidden' }}>
          {['Work', 'Casual', 'Date', 'Night out', 'Wedding'].map((o, i) => (
            <Chip key={o} on={i === 0} dark>
              {i === 0 && <Check size={11} strokeWidth={3} style={{ marginRight: 4 }} />}
              {o}
            </Chip>
          ))}
        </div>
        <div className="flex items-center justify-between" style={{ marginTop: 18, padding: '0 6px' }}>
          <span className="flex items-center rounded-full" style={{ height: 44, padding: '0 14px 0 6px', gap: 8, background: 'rgb(255 255 255 / 0.16)', color: S.onNight, fontSize: 12, fontWeight: 700 }}>
            <span className="overflow-hidden" style={{ width: 30, height: 30, borderRadius: 8 }}>
              <Pic src={IMG.plaid.src} pos="top" />
            </span>
            <Images size={14} /> Gallery
          </span>
          <span className="grid place-items-center rounded-full" style={{ width: 78, height: 78, border: '4px solid white' }}>
            <span className="block rounded-full" style={{ width: 60, height: 60, background: S.gold, boxShadow: `0 12px 32px -12px ${mix(S.gold, 70)}` }} />
          </span>
          <span style={{ ...MONO, fontSize: 9, color: S.onNight2, width: 96, textAlign: 'right' }}>Encrypted · deleted after 12 months unless kept</span>
        </div>
      </div>
    </div>
  )
}

function Analysis({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: S.bg }}>
      <div className="relative" style={{ height: 330 }}>
        <Pic src={IMG.coat.src} pos="center 25%" />
        <span className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgb(10 10 10 / 0.6), transparent 30%, transparent 50%, rgb(10 10 10 / 0.92) 100%)' }} />
        <div className="absolute flex items-center justify-between" style={{ left: 12, right: 12, top: 56, color: S.onNight }}>
          <span className="flex items-center rounded-full" style={{ height: 40, padding: '0 12px 0 4px', background: 'rgb(10 10 10 / 0.45)', fontSize: 13, fontWeight: 600 }}>
            <ChevronLeft size={22} /> Back
          </span>
          <span className="grid place-items-center rounded-full" style={{ width: 40, height: 40, background: 'rgb(10 10 10 / 0.45)' }}>
            <Share size={18} />
          </span>
        </div>
        <div className="absolute" style={{ left: 18, right: 18, bottom: 30, color: S.onNight }}>
          <span style={{ ...KICKER, color: S.goldLight }}>Just now · 08:14</span>
          <span style={{ ...DISPLAY, fontSize: 22, display: 'block', marginTop: 4 }}>Burgundy wool coat, camel knit, black trousers</span>
          <span className="flex" style={{ gap: 6, marginTop: 8 }}>
            <Chip>Work</Chip>
            <span className="inline-flex items-center rounded-full" style={{ height: 24, padding: '0 10px', gap: 4, background: S.night2, color: S.goldLight, ...KICKER, fontSize: 9 }}>
              <MapPin size={10} /> Chicago, IL · 41°F · Light rain
            </span>
          </span>
        </div>
      </div>
      <motion.div className="relative" style={{ margin: '-22px 16px 0', padding: 16, borderRadius: 22, background: S.surface, boxShadow: `0 18px 44px -14px ${mix(S.ink, 35)}` }} initial={reduced ? false : { y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: SETTLE, delay: 0.2 }}>
        <div className="flex items-center" style={{ gap: 16 }}>
          <Ring value={84} size={112} stroke={8} label="out of 100" />
          <span className="min-w-0 flex-1">
            <span style={KICKER}>Overall</span>
            <span style={{ ...DISPLAY, fontSize: 22, display: 'block', marginTop: 2 }}>Strong</span>
            <span style={{ fontSize: 11.5, color: S.ink2, display: 'block', marginTop: 6, lineHeight: 1.3 }}>Up 12 on your last fit. Scored on fashion conventions and your own profile: elevated streetwear, Deep Autumn.</span>
          </span>
        </div>
        <div style={{ marginTop: 14 }}>
          <Strip s={TODAY} />
        </div>
      </motion.div>
      <div style={{ padding: '18px 20px 0' }}>
        <span style={{ ...DISPLAY, fontSize: 20 }}>What’s working</span>
        {['Burgundy is squarely in your Deep Autumn palette.', 'The coat length balances your proportions.'].map((t) => (
          <span key={t} className="flex" style={{ gap: 10, marginTop: 10, fontSize: 12.5, lineHeight: 1.35 }}>
            <span className="grid shrink-0 place-items-center rounded-full" style={{ width: 20, height: 20, background: S.gold, color: S.onGold }}>
              <Check size={12} strokeWidth={3} />
            </span>
            {t}
          </span>
        ))}
        <span style={{ ...DISPLAY, fontSize: 20, display: 'block', marginTop: 16 }}>What could be better</span>
        <span className="flex" style={{ gap: 10, marginTop: 10, fontSize: 12.5, lineHeight: 1.35 }}>
          <span className="grid shrink-0 place-items-center rounded-full" style={{ width: 20, height: 20, background: S.ink, color: S.onNight }}>
            <TriangleAlert size={11} strokeWidth={2.6} />
          </span>
          With 70% rain forecast, the wool shoulders will soak through by the second block.
        </span>
      </div>
      <div className="absolute" style={{ left: 0, right: 0, bottom: 0, height: 120, background: `linear-gradient(to top, ${S.bg}, transparent)` }} />
      <Dock active="camera" />
    </div>
  )
}

const PALETTE = SEASON.palette
const PALETTE_NAMES = SEASON.names

function Colours() {
  return (
    <div className="absolute inset-0" style={{ background: S.bg }}>
      <div style={{ background: S.night, color: S.onNight, padding: '56px 20px 0' }}>
        <div className="flex items-center justify-between">
          <span className="flex items-center rounded-full" style={{ height: 36, padding: '0 12px 0 4px', background: 'rgb(255 255 255 / 0.12)', fontSize: 13, fontWeight: 600 }}>
            <ChevronLeft size={20} /> Back
          </span>
          <span className="rounded-full" style={{ padding: '6px 10px', background: 'rgb(255 255 255 / 0.12)', ...KICKER, color: S.onNight, fontSize: 9 }}>
            Saved to your profile
          </span>
        </div>
        <span style={{ ...KICKER, color: S.goldLight, display: 'block', marginTop: 20 }}>My Colours</span>
        <span style={{ ...DISPLAY, fontSize: 40, display: 'block', marginTop: 4 }}>Deep Autumn</span>
        <span style={{ fontSize: 12.5, color: S.onNight2, display: 'block', marginTop: 8, lineHeight: 1.35, paddingBottom: 18 }}>Warm undertone with depth. Rich, earthy colours with weight suit you best; pale, icy shades wash you out. Lead with gold.</span>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', margin: '0 -20px' }}>
          {PALETTE.map((c) => (
            <span key={c} style={{ height: 44, background: c }} />
          ))}
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10, padding: '14px 20px 0' }}>
        {[
          ['Undertone', 'Warm', 'Green veins, tans easily'],
          ['Depth', 'Deep', 'Dark hair and eyes'],
        ].map(([k, v, s]) => (
          <span key={k} style={{ padding: 12, borderRadius: 16, background: S.surface, boxShadow: CARD_SHADOW }}>
            <span style={KICKER}>{k}</span>
            <span style={{ ...DISPLAY, fontSize: 22, display: 'block', marginTop: 2 }}>{v}</span>
            <span style={{ fontSize: 11, color: S.ink2 }}>{s}</span>
          </span>
        ))}
        <span className="relative overflow-hidden" style={{ gridColumn: '1 / -1', padding: 14, borderRadius: 16, background: S.gold, color: S.onGold }}>
          <span style={{ ...KICKER, color: SCREEN_INK.onGoldSoft }}>Best metal tones</span>
          <span style={{ ...DISPLAY, fontSize: 22, display: 'block', marginTop: 2 }}>Gold · Bronze · Copper</span>
          <span style={{ fontSize: 11, color: SCREEN_INK.onGoldSoft, display: 'block', marginTop: 4, lineHeight: 1.3 }}>Yellow gold first; bronze and copper for texture. Keep silver to one piece.</span>
        </span>
      </div>
      <div style={{ padding: '16px 20px 0' }}>
        <span style={{ ...DISPLAY, fontSize: 20 }}>Your 14 best colours</span>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 10 }}>
          {PALETTE.slice(0, 10).map((c, i) => (
            <span key={c} className="flex flex-col items-center" style={{ gap: 4 }}>
              <span className="block rounded-[12px]" style={{ width: 52, height: 52, background: c, boxShadow: `inset 0 0 0 1px ${S.rule}` }} />
              <span style={{ fontSize: 9.5, fontWeight: 700, color: S.ink3 }}>{PALETTE_NAMES[i]}</span>
            </span>
          ))}
        </div>
      </div>
      <Dock active="style" />
    </div>
  )
}

/* ------------------------------------------------------------------ web screens */

function WebScreen({ screen }: { screen: Screen }) {
  const NAV: [LucideIcon, string, boolean][] = [
    [LayoutDashboard, 'Overview', false],
    [Users, 'Members & status', screen === 'adminMembers'],
    [ChartColumn, 'Usage & helpfulness', false],
    [ListChecks, 'Questions, quiz & deck', false],
    [BrainCircuit, 'AI prompts & criteria', screen === 'adminAi'],
    [Gauge, 'Limits & spend', false],
    [Inbox, 'Bug reports', false],
    [Settings2, 'Membership provider', false],
  ]
  return (
    <div className="absolute inset-0 flex" style={{ background: S.bg }}>
      <div className="flex shrink-0 flex-col" style={{ width: 200, background: S.ink, color: S.onNight, padding: '16px 10px' }}>
        <span className="flex items-center" style={{ gap: 8, padding: '0 8px 14px' }}>
          <svg width="22" height="22" viewBox="0 0 64 64">
            <path d="M32 8 56 28 32 58 8 28Z" fill={S.gold} />
            <path d="M8 28h48M32 8 22 28l10 30M32 8l10 20-10 30" stroke={S.ink} strokeWidth="2" fill="none" />
          </svg>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em' }}>
            ICEY<span style={{ color: S.goldLight }}>CREW</span>
          </span>
          <span style={{ ...KICKER, color: S.onNight2, fontSize: 8 }}>Admin</span>
        </span>
        {NAV.map(([Icon, l, on]) => (
          <span key={l} className="flex items-center rounded-[10px]" style={{ height: 32, padding: '0 10px', gap: 8, fontSize: 11.5, fontWeight: 600, background: on ? S.gold : 'transparent', color: on ? S.onGold : S.onNight, marginTop: 2 }}>
            <Icon size={14} /> <span className="truncate">{l}</span>
            {l === 'Bug reports' && <span className="ml-auto rounded-full" style={{ padding: '1px 6px', background: S.gold, color: S.onGold, ...MONO, fontSize: 9, fontWeight: 700 }}>6</span>}
          </span>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center" style={{ height: 50, padding: '0 20px', gap: 12, background: S.surface, borderBottom: `1px solid ${S.rule}` }}>
          <span className="flex items-center rounded-full" style={{ width: 240, height: 30, padding: '0 12px', gap: 8, background: S.raised, boxShadow: `inset 0 0 0 1px ${S.rule}`, fontSize: 11, color: S.ink2 }}>
            <Search size={12} /> Delgado
          </span>
          <span style={{ ...MONO, fontSize: 9.5, color: S.ink3 }}>Tue 10 Nov 2026 · 08:14 · Chicago · CST</span>
          <span className="ml-auto flex items-center rounded-full" style={{ height: 28, padding: '0 10px', gap: 6, background: S.ink, color: S.onNight, fontSize: 11, fontWeight: 700 }}>
            <Inbox size={12} /> Reports · 6
          </span>
          <span className="grid place-items-center" style={{ width: 28, height: 28 }}>
            <Bell size={15} />
          </span>
          <span className="flex items-center" style={{ gap: 6, fontSize: 11 }}>
            <span className="rounded-full" style={{ width: 24, height: 24, background: S.gold }} />
            <span>
              <span style={{ fontWeight: 700, display: 'block' }}>Hazel</span>
              <span style={{ color: S.ink3, fontSize: 9, display: 'block' }}>Owner · IceyCrew</span>
            </span>
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden" style={{ padding: 20 }}>{screen === 'adminAi' ? <AdminAi /> : <AdminMembers />}</div>
      </div>
    </div>
  )
}

const MEMBERS: [string, string, string, string, string, number, number, string][] = [
  ['Elena Russo', 'Miami, FL · US', 'Refunded', 'Oct 29', '#IC-52860 · sub_K14X8G', 2, 69, '—'],
  ['Omar Haddad', 'Dearborn, MI · US', 'Lapsed', 'Oct 31', '#IC-49800 · sub_Q76D1M', 1, 72, '—'],
  ['Marcus Bell', 'Houston, TX · US', 'Lapsed', 'Nov 4', '#IC-49311 · sub_D40Q1Z', 3, 79, 'Cool Winter'],
  ['Kai Tanaka', 'Seattle, WA · US', 'Active', 'Nov 12', '#IC-52150 · sub_O52B5K', 25, 79, 'Deep Winter'],
  ['Zoe Adeyemi', 'Birmingham · UK', 'Active', 'Nov 14', '#IC-48810 · sub_S90F7O', 13, 84, 'Deep Autumn'],
  ['Dev Patel', 'Vancouver, BC · CA', 'Active', 'Nov 15', '#IC-52233 · sub_I97V1E', 18, 78, 'Deep Autumn'],
  ['June Park', 'San Diego, CA · US', 'Active', 'Nov 16', '#IC-52300 · sub_W38J2S', 20, 80, 'Deep Winter'],
  ['Maya Delgado', 'Chicago, IL · US', 'Active', 'Dec 3', '#IC-48213 · sub_A91K2Q', 9, 80, 'Deep Autumn'],
]
const STATUS_BG: Record<string, [string, string]> = { Active: [S.successSoft, SCREEN_INK.onSuccess], Lapsed: [S.dangerSoft, SCREEN_INK.onDanger], Refunded: [S.high, S.ink], Cancelled: [S.goldSoft, SCREEN_INK.goldDeep] }

function AdminMembers() {
  return (
    <div className="flex h-full" style={{ gap: 16 }}>
      <div className="min-w-0 flex-1">
        <span style={{ ...DISPLAY, fontSize: 28 }}>Members & status</span>
        <span style={{ fontSize: 11, color: S.ink2, display: 'block', marginTop: 2 }}>24 shown of 1,284 · one provider-neutral record each · Shopify adapter</span>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 14 }}>
          {[
            ['Active', '20', 'renew automatically'],
            ['Cancelled', '1', 'access to month end'],
            ['Lapsed', '2', 'failed payment · locked'],
            ['Refunded', '1', 'removed at once'],
          ].map(([k, v, s]) => (
            <span key={k} style={{ padding: 12, borderRadius: 14, background: S.surface, boxShadow: CARD_SHADOW }}>
              <span style={KICKER}>{k}</span>
              <span style={{ ...NUM, fontSize: 26, display: 'block', marginTop: 2 }}>{v}</span>
              <span style={{ ...MONO, fontSize: 9, color: S.ink3 }}>{s}</span>
            </span>
          ))}
        </div>
        <div className="overflow-hidden" style={{ marginTop: 12, borderRadius: 14, background: S.surface, boxShadow: CARD_SHADOW }}>
          <div className="grid" style={{ gridTemplateColumns: '1.5fr 0.8fr 0.7fr 1.3fr 0.6fr 0.7fr', padding: '8px 14px', background: S.raised, ...KICKER, fontSize: 8.5 }}>
            <span>Member</span>
            <span>Status</span>
            <span>Paid until</span>
            <span>Provider IDs</span>
            <span>Scans 30d</span>
            <span>Avg score</span>
          </div>
          {MEMBERS.map(([n, c, st, d, ids, sc, avg]) => (
            <div key={n} className="grid items-center" style={{ gridTemplateColumns: '1.5fr 0.8fr 0.7fr 1.3fr 0.6fr 0.7fr', padding: '7px 14px', borderTop: `1px solid ${S.rule}`, fontSize: 11, background: n === 'Maya Delgado' ? mix(S.gold, 10) : 'transparent' }}>
              <span className="min-w-0">
                <span style={{ fontWeight: 700, display: 'block' }}>{n}</span>
                <span style={{ ...MONO, fontSize: 8.5, color: S.ink3 }}>{c}</span>
              </span>
              <span>
                <span className="rounded-full" style={{ padding: '3px 8px', ...KICKER, fontSize: 8, background: STATUS_BG[st][0], color: STATUS_BG[st][1] }}>{st}</span>
              </span>
              <span style={{ ...MONO, fontSize: 10, fontWeight: 600 }}>{d}</span>
              <span className="truncate" style={{ ...MONO, fontSize: 9, color: S.ink3 }}>{ids}</span>
              <span style={{ ...MONO, fontSize: 10, fontWeight: 600 }}>{sc}</span>
              <span className="inline-flex items-center rounded-full" style={{ padding: '2px 7px', gap: 4, ...MONO, fontSize: 9.5, fontWeight: 700, background: avg >= 80 ? S.goldSoft : S.high, color: avg >= 80 ? SCREEN_INK.goldDeep : S.ink, width: 'fit-content' }}>
                <span className="rotate-45" style={{ width: 6, height: 6, background: bandOf(avg), borderRadius: 1 }} /> {avg}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="shrink-0 overflow-hidden" style={{ width: 300, borderRadius: 14, background: S.surface, boxShadow: CARD_SHADOW, padding: 16 }}>
        <div className="flex items-center" style={{ gap: 10 }}>
          <span className="overflow-hidden rounded-full shrink-0" style={{ width: 44, height: 44, boxShadow: `0 0 0 2px ${S.surface}, 0 0 0 4px ${S.gold}` }}>
            <Pic src={IMG.maya.src} pos="50% 20%" />
          </span>
          <span className="min-w-0">
            <span style={{ ...DISPLAY, fontSize: 18, display: 'block' }}>Maya Delgado</span>
            <span className="truncate" style={{ ...MONO, fontSize: 9, color: S.ink3, display: 'block' }}>maya.delgado@demo-iceycrew.app</span>
          </span>
        </div>
        <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: S.ink, color: S.onNight }}>
          <span style={{ ...KICKER, color: S.goldLight }}>Membership record · provider-neutral</span>
          <dl className="grid" style={{ gridTemplateColumns: 'auto 1fr', gap: '4px 10px', marginTop: 8, fontSize: 10 }}>
            {[
              ['status', 'active'],
              ['paid_until', '2026-12-03'],
              ['level', 'VIP'],
              ['provider', 'shopify'],
              ['customer_id', 'gid://shopify/Customer/7731420'],
              ['subscription_id', 'sub_A91K2Q'],
              ['order_id', '#IC-48213'],
              ['crm_id', '— (matched by email on migration)'],
            ].map(([k, v]) => (
              <span key={k} className="contents">
                <dt style={{ color: S.onNight2 }}>{k}</dt>
                <dd className="truncate" style={{ ...MONO, fontSize: 9.5, fontWeight: 600 }}>{v}</dd>
              </span>
            ))}
          </dl>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 10 }}>
          {[
            ['80', 'Avg score'],
            ['9', 'Scans 30d'],
            ['4.3', 'Helpful'],
          ].map(([v, l]) => (
            <span key={l} className="flex flex-col items-center" style={{ padding: 8, borderRadius: 10, background: S.raised }}>
              <span style={{ ...NUM, fontSize: 20 }}>{v}</span>
              <span style={{ ...KICKER, fontSize: 8 }}>{l}</span>
            </span>
          ))}
        </div>
        <span className="flex items-center justify-center rounded-full" style={{ marginTop: 10, height: 32, gap: 6, background: S.ink, color: S.onNight, fontSize: 11, fontWeight: 700 }}>
          <Save size={12} /> Save note
        </span>
      </div>
    </div>
  )
}

const PROMPT = `You are a personal stylist for IceyCrew VIP members. Rate the outfit in the photo out of 100 overall and on four sub-scores (fit, colour, cohesion, occasion), each 0–100. Use the member's style profile and colour season when given. If an occasion or weather is given, the occasion score must reflect both; otherwise rate general suitability. Write positives first, then negatives phrased constructively, then 3–5 actionable tips. Each tip names an item type, suggested colour(s), material, fit and a priority. Use the member's regional spelling. Refuse nude or sexual images, unsuitable content, and photos that appear to show children. Return JSON only, matching the schema.`

function AdminAi() {
  return (
    <div className="flex h-full" style={{ gap: 16 }}>
      <div className="min-w-0 flex-1">
        <div className="flex items-end justify-between">
          <span>
            <span style={{ ...DISPLAY, fontSize: 28 }}>AI prompts & criteria</span>
            <span style={{ fontSize: 11, color: S.ink2, display: 'block', marginTop: 2 }}>OpenAI · GPT-5 Vision · ~$0.11 per analysis · prompt v14 · 6 Nov 2026</span>
          </span>
          <span className="flex" style={{ gap: 6 }}>
            <span className="flex items-center rounded-full" style={{ height: 28, padding: '0 10px', gap: 6, boxShadow: `inset 0 0 0 1px ${S.rule}`, fontSize: 11, fontWeight: 700 }}>
              <Play size={11} /> Test on a sample photo
            </span>
            <span className="flex items-center rounded-full" style={{ height: 28, padding: '0 10px', gap: 6, background: S.ink, color: S.onNight, fontSize: 11, fontWeight: 700 }}>
              <Save size={11} /> Save as v15
            </span>
          </span>
        </div>
        <div style={{ marginTop: 14, padding: 14, borderRadius: 14, background: S.surface, boxShadow: CARD_SHADOW }}>
          <div className="flex items-center justify-between">
            <span style={{ ...DISPLAY, fontSize: 18 }}>System prompt</span>
            <span className="rounded-full" style={{ padding: '3px 8px', ...KICKER, fontSize: 8, background: S.successSoft, color: SCREEN_INK.onSuccess }}>v14 live</span>
          </div>
          <p style={{ ...MONO, fontSize: 10, lineHeight: 1.5, marginTop: 8, padding: 12, borderRadius: 10, background: S.raised, boxShadow: `inset 0 0 0 1px ${S.rule}`, color: S.ink2, whiteSpace: 'pre-wrap' }}>{PROMPT}</p>
        </div>
        <div style={{ marginTop: 12, padding: 14, borderRadius: 14, background: S.surface, boxShadow: CARD_SHADOW }}>
          <div className="flex items-center justify-between">
            <span style={{ ...DISPLAY, fontSize: 18 }}>Rating criteria</span>
            <span style={{ ...MONO, fontSize: 9.5, color: S.ink3 }}>weights 100%</span>
          </div>
          {[
            ['Fit', 30, 'Proportion, length, where seams sit, ease vs. the member’s stated fit preference'],
            ['Colour', 25, 'Palette harmony; the member’s colour season when known; metals'],
            ['Cohesion', 25, 'Do the pieces belong together: formality, era, texture, one statement'],
            ['Occasion', 20, 'Suitability for the occasion chip and the weather; general suitability when none'],
          ].map(([n, w, note], i) => (
            <div key={n as string} className="grid items-center" style={{ gridTemplateColumns: '80px 1fr 120px', gap: 12, marginTop: 10, fontSize: 11 }}>
              <span>
                <span style={{ fontWeight: 700, display: 'block' }}>{n as string}</span>
                <span style={{ ...MONO, fontSize: 9.5, color: S.ink3 }}>{w as number}%</span>
              </span>
              <span style={{ fontSize: 10, color: S.ink2, lineHeight: 1.3 }}>{note as string}</span>
              <span className="relative block overflow-hidden rounded-full" style={{ height: 8, background: S.high }}>
                <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(w as number) * 2.5}%`, background: i === 0 ? S.gold : S.ink }} />
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 flex-col" style={{ width: 300, gap: 12 }}>
        <div style={{ padding: 14, borderRadius: 14, background: S.surface, boxShadow: CARD_SHADOW }}>
          <span style={{ ...DISPLAY, fontSize: 18 }}>Every request includes</span>
          {['The photo (encrypted upload)', 'The style profile', 'The colour profile', 'Occasion and weather, when given', 'The member’s country'].map((t) => (
            <span key={t} className="flex items-center" style={{ gap: 6, marginTop: 6, fontSize: 11 }}>
              <Check size={12} strokeWidth={3} color={S.goldText} /> {t}
            </span>
          ))}
        </div>
        <div style={{ padding: 14, borderRadius: 14, background: S.surface, boxShadow: CARD_SHADOW }}>
          <span style={{ ...DISPLAY, fontSize: 18 }}>Structured output</span>
          <pre style={{ ...MONO, fontSize: 9.5, lineHeight: 1.45, marginTop: 8, padding: 10, borderRadius: 10, background: S.ink, color: S.onNight, whiteSpace: 'pre-wrap' }}>{`{ "overall": 0–100,
  "sub": { "fit", "colour",
           "cohesion", "occasion" },
  "positives": [], "negatives": [],
  "tips": [{ item, colours,
             material, fit, priority }] }`}</pre>
          <span style={{ ...MONO, fontSize: 9, color: S.ink3, display: 'block', marginTop: 6 }}>Validated by the backend · invalid JSON retried once</span>
        </div>
        <div className="flex items-center" style={{ padding: 12, borderRadius: 14, background: S.surface, boxShadow: CARD_SHADOW, gap: 10 }}>
          <Ring value={88} size={52} stroke={5}>
            <span style={{ ...MONO, fontSize: 13, fontWeight: 700 }}>4.4</span>
          </Ring>
          <span style={{ fontSize: 10.5, color: S.ink2, lineHeight: 1.3 }}>
            <span style={{ fontWeight: 700, color: S.ink }}>Helpfulness 4.4 of 5</span>
            <br />
            5,120 ratings · <Star size={9} fill={S.gold} strokeWidth={0} style={{ display: 'inline' }} /> stored with every analysis
          </span>
          <Sparkles size={14} color={S.goldText} style={{ marginLeft: 'auto' }} />
        </div>
      </div>
    </div>
  )
}
