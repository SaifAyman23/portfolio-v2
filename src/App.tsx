import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import MainLayout from './MainLayout'

import { SeoUpdater } from '@/components/SeoUpdater'
import { ROUTES } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

const Home = lazy(() => import('@/pages/Home'))

function App() {
  return (
    <Router>
      <SeoUpdater />
      <Suspense fallback={null}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<Home />} />
            {/* Future authenticated routes go here */}
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
