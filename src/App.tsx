import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { lazy, Suspense, useEffect, useState } from 'react'

import { useMediaQuery, useSectionTracker } from './hooks'
import MainLayout from './MainLayout'

import { Overlay } from '@/components/Overlay'
import { SeoUpdater } from '@/components/SeoUpdater'

gsap.registerPlugin(ScrollTrigger, SplitText, Observer)

ScrollTrigger.config({
  ignoreMobileResize: true,
})

const Home = lazy(() => import('@/pages/Home'))
const JetScene = lazy(() =>
  import('./components/jet/JetScene').then((module) => ({ default: module.JetScene }))
)

function App() {
  const { active, direction, progressRef } = useSectionTracker()
  const isXl = useMediaQuery('(min-width: 1280px)')
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    if (!isXl) return
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }
    const t = window.setTimeout(() => setIdle(true), 2000)
    return () => window.clearTimeout(t)
  }, [isXl])

  return (
    <>
      <SeoUpdater />
      <Suspense fallback={null}>
        {isXl && idle && (
          <Overlay>
            <JetScene active={active} progressRef={progressRef} />
          </Overlay>
        )}
        <MainLayout>
          <Home active={active} direction={direction} />
        </MainLayout>
      </Suspense>
    </>
  )
}

export default App
