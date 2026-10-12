import { useEffect, useState } from 'react'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Intro, introAlreadySeen } from './components/Intro'
import { MatrixRain } from './components/MatrixRain'
import { ROUTES, useRoute } from './lib/router'
import { BurnsPage } from './pages/Burns'
import { CommunityPage } from './pages/Community'
import { DashboardPage } from './pages/Dashboard'
import { HomePage } from './pages/Home'
import { PassPage } from './pages/Pass'
import { StakingPage } from './pages/Staking'
import { SwapPage } from './pages/Swap'

const PAGES = {
  '/': HomePage,
  '/pass': PassPage,
  '/swap': SwapPage,
  '/staking': StakingPage,
  '/burns': BurnsPage,
  '/dashboard': DashboardPage,
  '/community': CommunityPage,
} as const

export function App() {
  const route = useRoute()
  const [intro, setIntro] = useState(() => route === '/' && !introAlreadySeen())
  const Page = PAGES[route]

  // Route changes: scroll to top, update the title and move focus to the main heading.
  useEffect(() => {
    const label = ROUTES.find((r) => r.path === route)?.label ?? 'Home'
    document.title = route === '/' ? 'BMC Illuminati — Know • Create • Burn • Rise' : `${label} — BMC Illuminati`
    window.scrollTo({ top: 0 })
    const main = document.getElementById('main')
    main?.focus({ preventScroll: true })
  }, [route])

  return (
    <>
      <a href="#main" className="skip-link" onClick={(event) => {
        event.preventDefault()
        document.getElementById('main')?.focus()
        document.getElementById('main')?.scrollIntoView()
      }}>
        Skip to content
      </a>
      <div className="bg-layer" aria-hidden="true">
        <div className="bg-grid" />
        <div className="bg-glow green" />
        <div className="bg-glow purple" />
        <MatrixRain intensity={0.25} />
      </div>
      {intro ? <Intro onDone={() => setIntro(false)} /> : null}
      <div inert={intro ? true : undefined}>
        <Header route={route} />
        <main id="main" tabIndex={-1} className="container page" style={{ outline: 'none' }}>
          <Page />
        </main>
        <Footer />
      </div>
    </>
  )
}
