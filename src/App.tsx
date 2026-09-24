import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { lazy, Suspense } from 'react'

import { useSectionTracker } from './hooks'
import MainLayout from './MainLayout'

import { SeoUpdater } from '@/components/SeoUpdater'

gsap.registerPlugin(ScrollTrigger, SplitText, Observer)

const Home = lazy(() => import('@/pages/Home'))
const JetScene = lazy(() =>
  import('./components/jet/JetScene').then((module) => ({ default: module.JetScene }))
)

function App() {
  const { active, direction, progressRef } = useSectionTracker()

  return (
    <>
      <SeoUpdater />
      <Suspense fallback={null}>
        <JetScene active={active} progressRef={progressRef} />
        <MainLayout>
          <Home active={active} direction={direction} />
        </MainLayout>
      </Suspense>
    </>
  )
}

export default App
