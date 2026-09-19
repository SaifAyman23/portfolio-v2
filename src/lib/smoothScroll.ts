import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null

  const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
    gestureOrientation: 'vertical',
  })

  ;(window as unknown as { __lenis?: typeof lenis }).__lenis = lenis
  lenis.on('scroll', ScrollTrigger.update)

  const raf = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(raf)
    lenis.destroy()
    delete (window as unknown as { __lenis?: unknown }).__lenis
  }
}
