import { useEffect } from 'react'
import { Nav, SECTIONS } from './components/sections/Nav'
import { Hero } from './components/sections/Hero'
import { Overview } from './components/sections/Overview'
import { Constraints } from './components/sections/Constraints'
import { Flow } from './components/sections/Flow'
import { Roles } from './components/sections/Roles'
import { Architecture } from './components/sections/Architecture'
import { Milestones } from './components/sections/Milestones'
import { Deliverables } from './components/sections/Deliverables'
import { Later } from './components/sections/Later'
import { Clients } from './components/sections/Clients'
import { Terms } from './components/sections/Terms'
import { Close } from './components/sections/Close'
import { ToastHost } from './components/ui/bits'
import { useTheme } from './hooks/useTheme'
import { useActiveSection } from './hooks/useActiveSection'
import { setScreen } from './tracker/tracker'

const IDS = SECTIONS.map((s) => s.id)

export default function App() {
  const { theme, toggle } = useTheme()
  const active = useActiveSection(IDS)
  useEffect(() => setScreen(`proposal:${active}`, 'visitor'), [active])
  return (
    <ToastHost>
      <a href="#overview" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:bg-[var(--card)] focus:px-3 focus:py-2">
        Skip to the proposal
      </a>
      <Nav theme={theme} onTheme={toggle} active={active} />
      <main>
        <Hero />
        <Overview />
        <Constraints />
        <Flow />
        <Roles />
        <Architecture />
        <Milestones />
        <Deliverables />
        <Later />
        <Clients />
        <Terms />
        <Close />
      </main>
    </ToastHost>
  )
}
