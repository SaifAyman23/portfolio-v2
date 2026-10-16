import { useEffect, useState, type RefObject } from 'react'

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
    const io = new IntersectionObserver(
      ([entry]) => {
        const next = entry?.isIntersecting ?? true
        setNear((prev) => (prev === next ? prev : next))
      },
      { rootMargin, threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target, rootMargin, threshold])

  return near
}
