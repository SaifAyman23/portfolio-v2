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
  if (document.fonts?.ready) {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      requestAnimationFrame(() => requestAnimationFrame(remove))
    }
    document.fonts.ready.then(finish).catch(finish)
    window.setTimeout(finish, 6000)
  } else {
    remove()
  }
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
