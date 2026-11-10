/* NAV · The report's fields in order: the IceyCrew mark and "Proposal for Hazel", the fields of the
   report as small ticks with their codes (the active one is where we are on the report), a gold
   scroll-progress rule (how much of the report has been read), the theme toggle, Accept, and the full
   list of fields behind the menu button. */
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { P } from '../../data/proposal'
import type { Theme } from '../../hooks/useTheme'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/format'
import { IceMark } from '../ui/bits'
import { SETTLE } from '../ui/motion'
import { overlayClosed, overlayOpened } from '../../tracker/tracker'

export const SECTIONS = [
  { id: 'top', label: 'Cover', time: 'F-01' },
  { id: 'overview', label: 'Summary', time: 'F-02' },
  { id: 'constraints', label: 'Conditions', time: 'F-03' },
  { id: 'flow', label: 'The member’s path', time: 'F-04' },
  { id: 'roles', label: 'Who holds the report', time: 'F-05' },
  { id: 'architecture', label: 'The setting', time: 'F-06' },
  { id: 'milestones', label: 'Fields and payments', time: 'F-07' },
  { id: 'deliverables', label: 'What is handed over', time: 'F-08' },
  { id: 'later', label: 'A later report', time: 'F-09' },
  { id: 'clients', label: 'Prior reports', time: 'F-10' },
  { id: 'terms', label: 'The fine print', time: 'F-11' },
  { id: 'start', label: 'Accept', time: 'F-12' },
] as const

const num = (i: number) => String(i + 1).padStart(2, '0')

export function Nav({ theme, onTheme, active }: { theme: Theme; onTheme: () => void; active: string }) {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 34, restDelta: 0.001 })
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    overlayOpened('menu')
    return () => overlayClosed('menu')
  }, [open])
  const menuBtn = useRef<HTMLButtonElement>(null)
  const firstLink = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!open) return
    firstLink.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuBtn.current?.focus()
      }
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const activeIdx = Math.max(0, SECTIONS.findIndex((s) => s.id === active))
  const press = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 520, damping: 30 }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--rule-strong)] bg-[color-mix(in_srgb,var(--ground)_90%,transparent)] backdrop-blur-md">
        <nav aria-label="Proposal" className="shell flex h-14 items-center gap-3">
          <a href="#top" className="flex min-w-0 shrink items-center gap-2.5 text-[var(--ink)]" data-intent="nav_home" data-value="wordmark">
            <IceMark size={26} />
            <span className="display-wide text-[0.8rem] leading-none">
              Icey<span className="text-[var(--money)]">Crew</span>
            </span>
            <span aria-hidden className="hidden h-4 w-px bg-[var(--rule-strong)] sm:block" />
            <span className="kicker hidden truncate text-[var(--ink-3)] sm:inline">Proposal for {P.client.contact}</span>
          </a>

          {/* the fields of the report as ticks along the page */}
          <ol className="mx-auto hidden items-end gap-[3px] lg:flex" aria-label="Fields on the report">
            {SECTIONS.map((s, i) => {
              const on = s.id === active
              return (
                <li key={s.id} className="group/tick relative">
                  <a href={`#${s.id}`} aria-current={on ? 'location' : undefined} data-intent="nav_tick" data-value={s.id} className="flex h-10 w-6 items-end justify-center pb-2">
                    <span className="sr-only">
                      Field {num(i)}, {s.label}
                    </span>
                    <motion.span
                      aria-hidden
                      className={cn('block w-[7px] origin-bottom rounded-[1px]', on ? 'bg-[var(--cta)]' : i < activeIdx ? 'bg-[var(--ink-2)]' : 'bg-[var(--rule-strong)]')}
                      style={{ height: 18 }}
                      initial={false}
                      animate={{ scaleY: on ? 1 : 0.45 }}
                      transition={press}
                    />
                  </a>
                  <span
                    aria-hidden
                    className="kicker pointer-events-none absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 translate-y-[-2px] whitespace-nowrap rounded-[var(--r-card)] bg-[var(--toast-bg)] px-2 py-1 text-[0.6875rem] text-[var(--toast-ink)] opacity-0 transition-[opacity,transform] duration-150 ease-[var(--ease-turn)] group-focus-within/tick:translate-y-0 group-focus-within/tick:opacity-100 group-hover/tick:translate-y-0 group-hover/tick:opacity-100"
                  >
                    {s.time} · {s.label}
                  </span>
                </li>
              )
            })}
          </ol>

          <div className="ml-auto flex shrink-0 items-center gap-1 lg:ml-0">
            <button
              type="button"
              onClick={onTheme}
              data-intent="toggle_theme"
              data-value={theme === 'dark' ? 'light' : 'dark'}
              className="grid h-10 w-10 place-items-center rounded-[var(--r-card)] text-[var(--ink)] transition-[background-color,transform] duration-150 hover:bg-[var(--primary-soft)] active:scale-[0.96]"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={theme}
                  className="inline-grid place-items-center"
                  initial={reduced ? { opacity: 0 } : { rotate: -40, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={reduced ? { opacity: 0, transition: { duration: 0.1 } } : { rotate: 30, opacity: 0, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.16, ease: SETTLE }}
                >
                  {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} aria-hidden /> : <Moon size={18} strokeWidth={1.5} aria-hidden />}
                </motion.span>
              </AnimatePresence>
              <span className="sr-only">{theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}</span>
            </button>
            <a
              href="#start"
              data-intent="nav_start"
              data-value="start"
              className="kicker hidden min-h-10 items-center gap-2 rounded-[var(--r-card)] bg-[var(--cta)] px-3.5 font-semibold text-[var(--on-cta)] transition-[background-color,transform] duration-150 hover:bg-[var(--cta-hover)] active:scale-[0.97] sm:inline-flex"
            >
              Accept
            </a>
            <button
              ref={menuBtn}
              type="button"
              aria-expanded={open}
              aria-controls="nav-overlay"
              onClick={() => setOpen((o) => !o)}
              data-intent={open ? 'close_menu' : 'open_menu'}
              data-value="menu"
              className="relative grid h-10 w-10 place-items-center rounded-[var(--r-card)] text-[var(--ink)] hover:bg-[var(--primary-soft)]"
            >
              <span aria-hidden className="relative block h-3 w-5">
                <motion.span className="absolute left-0 top-0 block h-[1.5px] w-5 bg-current" initial={false} animate={open ? { y: 5.25, rotate: 45 } : { y: 0, rotate: 0 }} transition={press} />
                <motion.span className="absolute bottom-0 left-0 block h-[1.5px] w-5 bg-current" initial={false} animate={open ? { y: -5.25, rotate: -45 } : { y: 0, rotate: 0 }} transition={press} />
              </span>
              <span className="sr-only">{open ? 'Close the list of fields' : 'Open the list of fields'}</span>
            </button>
          </div>
        </nav>
        <motion.span aria-hidden className="absolute -bottom-[1px] left-0 h-[2px] w-full origin-left bg-[var(--cta)]" style={{ scaleX: progress }} />
      </header>

      <div id="nav-overlay">
        <AnimatePresence>
          {open && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Fields on the report"
              className="plot fixed inset-x-0 bottom-0 top-14 z-40 overflow-y-auto bg-[var(--ground)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.16 } }}
              transition={{ duration: reduced ? 0 : 0.25, ease: SETTLE }}
            >
              <div className="shell py-8 sm:py-12">
                <motion.div
                  className="card mx-auto max-w-3xl px-6 pb-6 pt-8 sm:px-14"
                  initial={reduced ? false : { y: 28 }}
                  animate={{ y: 0 }}
                  exit={reduced ? undefined : { y: 12 }}
                  transition={{ duration: 0.6, ease: SETTLE }}
                >
                  <p className="kicker flex flex-wrap items-center gap-x-3 gap-y-1 border-b-2 border-[var(--ink)] pb-2 text-[var(--ink)]">
                    <span className="font-bold">Grading report</span>
                    <span aria-hidden className="h-3 w-px bg-current opacity-50" />
                    <span>{P.client.programmeNo}</span>
                  </p>
                  <ol className="mt-2">
                    {SECTIONS.map((s, i) => {
                      const on = s.id === active
                      return (
                        <motion.li
                          key={s.id}
                          initial={reduced ? false : { opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: SETTLE, delay: reduced ? 0 : 0.08 + 0.03 * i }}
                          className="border-b border-[var(--rule)]"
                        >
                          <a
                            ref={i === 0 ? firstLink : undefined}
                            href={`#${s.id}`}
                            onClick={() => setOpen(false)}
                            aria-current={on ? 'location' : undefined}
                            data-intent="nav_menu"
                            data-value={s.id}
                            className="group flex min-h-12 items-baseline gap-4 py-2"
                          >
                            <span className={cn('struck w-24 shrink-0 text-[0.8rem]', on ? 'text-[var(--money)]' : 'text-[var(--ink-3)]')}>
                              {num(i)} · {s.time}
                            </span>
                            <span className="display min-w-0 text-[clamp(1.6rem,1.1rem+2vw,2.6rem)] text-[var(--ink)] transition-transform duration-200 ease-[var(--ease-turn)] group-hover:translate-x-1">{s.label}</span>
                            {on && <span className="kicker ml-auto shrink-0 text-[var(--money)]">You are here</span>}
                          </a>
                        </motion.li>
                      )
                    })}
                  </ol>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
