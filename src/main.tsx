import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'

import { queryClient } from '@/lib/queryClient'
import { initSmoothScroll } from '@/lib/smoothScroll'

initSmoothScroll()

const skeleton = document.getElementById('loading-skeleton')
if (skeleton) {
  skeleton.style.opacity = '0'
  setTimeout(() => skeleton.remove(), 300)
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
