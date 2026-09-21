import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { useSectionTracker } from './hooks'
import MainLayout from './MainLayout'

import { SeoUpdater } from '@/components/SeoUpdater'
import { ROUTES } from '@/lib/constants'
import { JetScene } from './components/jet/JetScene'

gsap.registerPlugin(ScrollTrigger, SplitText)

const Home = lazy(() => import('@/pages/Home'))

function App() {
  const { active, direction, progressRef } = useSectionTracker()

  return (
    <Router>
      <SeoUpdater />
      <Suspense fallback={null}>
        <JetScene active={active} progressRef={progressRef} />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<Home active={active} direction={direction} />} />
            {/* Future authenticated routes go here */}
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
