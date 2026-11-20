import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

export const SCROLLER_ID = 'main-content'

/**
 * The element that scrolls. The window never scrolls — the site lives inside
 * the framed <main id="main-content"> declared in index.html.
 */
export function getScroller(): HTMLElement | null {
  return typeof document === 'undefined' ? null : document.getElementById(SCROLLER_ID)
}

/** The active Lenis instance, if smooth scroll is running. */
export function getLenis(): Lenis | undefined {
  return (window as unknown as { __lenis?: Lenis }).__lenis
}

export function initSmoothScroll() {
  // Phone URL-bar resizes must not trigger refreshes that shift pins
  ScrollTrigger.config({ ignoreMobileResize: true })

  // Every ScrollTrigger in the app is driven by <main>, not the window.
  const scroller = getScroller()
  if (scroller) ScrollTrigger.defaults({ scroller })

  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return () => {}
  }

  // On touch-only mobile devices, native hardware-accelerated momentum scrolling
  // is standard and 120Hz. Lenis wheel emulation is unnecessary and conflicts
  // with native touch momentum + mobile URL-bar collapsing/expanding.
  const isTouchOnly =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches &&
    !window.matchMedia('(pointer: fine)').matches

  if (isTouchOnly) {
    return () => {}
  }

  const lenis = new Lenis({
    ...(scroller ? { wrapper: scroller, content: scroller.firstElementChild as HTMLElement } : {}),
    // Listen on the window so wheel input over the black margin / custom
    // scroll bar still scrolls <main>.
    eventsTarget: window,
    lerp: 0.08,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
    gestureOrientation: 'vertical',
  })

  ;(window as unknown as { __lenis?: typeof lenis }).__lenis = lenis
  lenis.on('scroll', ScrollTrigger.update)

  // Keep Lenis's scroll-height limit in sync whenever ScrollTrigger's own
  // layout changes (e.g. pin spacers being inserted/resized).
  const onRefresh = () => lenis.resize()
  ScrollTrigger.addEventListener('refresh', onRefresh)

  const raf = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  return () => {
    ScrollTrigger.removeEventListener('refresh', onRefresh)
    gsap.ticker.remove(raf)
    lenis.destroy()
    delete (window as unknown as { __lenis?: unknown }).__lenis
  }
}
