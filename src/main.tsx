import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'

import { initSmoothScroll } from '@/lib/smoothScroll'

initSmoothScroll()

function dismissSkeleton(): void {
  const skeleton = document.getElementById('loading-skeleton')
  if (!skeleton) return
  const remove = () => {
    skeleton.style.opacity = '0'
    window.setTimeout(() => skeleton.remove(), 350)
  }
  let done = false
  const finish = () => {
    if (done) return
    done = true
    requestAnimationFrame(() => requestAnimationFrame(remove))
  }
  window.addEventListener('hero-intro-start', finish, { once: true })
  window.setTimeout(finish, 6000)
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
