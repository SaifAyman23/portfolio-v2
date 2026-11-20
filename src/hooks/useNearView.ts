import { useEffect, useState, type RefObject } from 'react'

import { getScroller } from '@/lib/smoothScroll'

export type NearViewOptions = {
  rootMargin?: string
  threshold?: number | number[]
}

/**
 * True while the target is inside (or near, via rootMargin) the viewport.
 * Takes an element id or a ref. Defaults to true so content never flashes
 * missing where IntersectionObserver is unavailable.
 */
export function useNearView(
  target: string | RefObject<HTMLElement | null>,
  options?: NearViewOptions
): boolean {
  const rootMargin = options?.rootMargin ?? '0px'
  const threshold = options?.threshold ?? 0
  const [near, setNear] = useState(true)

  useEffect(() => {
    const el = typeof target === 'string' ? document.getElementById(target) : target.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    // Observe against the scroller: ancestors' overflow clips would otherwise
    // swallow the rootMargin when the root is the window.
    const scroller = getScroller()
    const root = scroller?.contains(el) ? scroller : null
    const io = new IntersectionObserver(
      ([entry]) => {
        const next = entry?.isIntersecting ?? true
        setNear((prev) => (prev === next ? prev : next))
      },
      { root, rootMargin, threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target, rootMargin, threshold])

  return near
}
