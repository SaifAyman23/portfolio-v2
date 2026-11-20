import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'

import { getScroller, initSmoothScroll } from '@/lib/smoothScroll'
import { initUiScale } from '@/lib/ui-scale'

ScrollTrigger.config({
  ignoreMobileResize: true,
})

// Must run before anything renders: sets the root font size every rem unit follows.
initUiScale()

initSmoothScroll()

// Focus the scroller so keyboard scrolling (space / arrows / PgDn) works right away.
getScroller()?.focus({ preventScroll: true })

if (document.fonts?.ready) {
  document.fonts.ready
    .then(() => requestAnimationFrame(() => ScrollTrigger.refresh()))
    .catch(() => {})
}

function dismissSkeleton(): void {
  const skeleton = document.getElementById('loading-skeleton')
  if (!skeleton) return
  const remove = () => {
    skeleton.style.opacity = '0'
    window.setTimeout(() => skeleton.remove(), 350)
  }
  let done = false
  let loaded = document.readyState === 'complete'
  let introStarted = false
  const finish = () => {
    if (done || !loaded || !introStarted) return
    done = true
    requestAnimationFrame(() => requestAnimationFrame(remove))
  }
  window.addEventListener('hero-intro-start', () => {
    introStarted = true
    finish()
  })
  window.addEventListener('load', () => {
    loaded = true
    finish()
  })
  window.setTimeout(() => {
    loaded = true
    introStarted = true
    finish()
  }, 6000)
}

dismissSkeleton()

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
