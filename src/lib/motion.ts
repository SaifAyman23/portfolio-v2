import { gsap } from 'gsap'

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function withReducedMotion<T extends unknown[]>(
  fn: (...args: T) => void | (() => void)
): (...args: T) => void | (() => void) {
  return (...args: T) => {
    const mm = gsap.matchMedia()
    let cleanup: void | (() => void)
    mm.add('(prefers-reduced-motion: reduce)', () => {
      return () => {}
    })
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      cleanup = fn(...args) as void | (() => void)
      return () => {
        if (typeof cleanup === 'function') cleanup()
      }
    })
    return () => mm.revert()
  }
}
