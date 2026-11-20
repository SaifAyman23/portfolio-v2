import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'

import { SECTION_IDS, type SectionId } from '@/config/sections'
import { getScroller } from '@/lib/smoothScroll'

// Structural type instead of `import Lenis from 'lenis'` — this file never
// imports the `lenis` package, so a project without it installed still
// compiles and runs untouched. Anything shaped like this works.
type LenisLike = {
  on: (event: 'scroll', callback: (e: { direction: number }) => void) => void
  off: (event: 'scroll', callback: (e: { direction: number }) => void) => void
}

export type SectionTrackerOptions = {
  /**
   * Return the active Lenis (or Lenis-shaped) instance, if this project
   * uses smooth-scroll. Used only to keep `direction` frame-aligned with
   * the scroll. Defaults to reading `window.__lenis`. Pass `() => undefined`
   * to force the native listener.
   */
  getLenis?: () => LenisLike | null | undefined
}

export type SectionTracker = {
  active: SectionId
  direction: 1 | -1
  /** 0–100 per section: how far through its own scroll span the section is. */
  progressRef: React.RefObject<Record<SectionId, number>>
}

const defaultGetLenis = (): LenisLike | undefined =>
  (window as unknown as { __lenis?: LenisLike }).__lenis

/** Where an un-pinned section's span starts: its top reaches this fraction of the viewport height. */
const ENTER_AT = 0.9

/**
 * Progress (0–100) of one section through its span, measured live from the DOM.
 *
 * - Pinned section (wrapped in a `[data-pin-spacer]`, see lib/sticky-pin.ts):
 *   from the spacer's top reaching the scroller's top, until the spacer's
 *   bottom reaches the scroller's bottom — i.e. exactly the time it is held.
 * - Any other section: from its top reaching 90% of the viewport, until its
 *   bottom leaves through the top.
 *
 * Reading positions directly (instead of creating ScrollTriggers) means it can
 * never go stale when pins are created/removed on breakpoint changes, fonts or
 * images load, or the UI scale changes.
 */
function measureProgress(el: HTMLElement, scrollerTop: number, viewH: number): number {
  const spacer = el.parentElement?.hasAttribute('data-pin-spacer') ? el.parentElement : null
  const rect = (spacer ?? el).getBoundingClientRect()
  const top = rect.top - scrollerTop

  let raw: number
  if (spacer) {
    const hold = rect.height - viewH
    raw = hold > 0 ? -top / hold : top <= 0 ? 1 : 0
  } else {
    const start = ENTER_AT * viewH
    raw = (start - top) / (start + rect.height)
  }

  return Math.min(100, Math.max(0, raw * 100))
}

export function useSectionTracker(
  ids: readonly SectionId[] = SECTION_IDS,
  options: SectionTrackerOptions = {}
): SectionTracker {
  const { getLenis = defaultGetLenis } = options

  // Latest-ref pattern so an inline `getLenis` doesn't rebuild the effect every render.
  const getLenisRef = useRef(getLenis)
  useEffect(() => {
    getLenisRef.current = getLenis
  })

  const [active, setActive] = useState<SectionId>(ids[0])
  const [direction, setDirection] = useState<1 | -1>(1)

  const progressRef = useRef(
    Object.fromEntries(ids.map((id) => [id, 0])) as Record<SectionId, number>
  )

  const activeRef = useRef<SectionId>(ids[0])
  const lastY = useRef(getScroller()?.scrollTop ?? 0)

  useEffect(() => {
    const scroller = getScroller()
    const lenis = getLenisRef.current?.() ?? undefined

    const setActiveSafe = (id: SectionId): void => {
      if (activeRef.current === id) return
      activeRef.current = id
      setActive(id)
    }

    // ---------- direction ----------
    const setDirectionSafe = (next: 1 | -1): void => {
      setDirection((prev) => (prev === next ? prev : next))
    }

    const onLenisScroll = (e: { direction: number }): void => {
      if (e.direction === 0) return
      setDirectionSafe(e.direction > 0 ? 1 : -1)
    }

    let lastScrollTop = -1
    let lastViewH = -1
    let lastScrollH = -1

    // ---------- active + progress: measured once per frame, only when something moved ----------
    const update = (force = false): void => {
      const top = scroller?.scrollTop ?? 0
      const viewH = scroller?.clientHeight ?? window.innerHeight
      const scrollH = scroller?.scrollHeight ?? 0

      if (!force && top === lastScrollTop && viewH === lastViewH && scrollH === lastScrollH) return

      if (top !== lastScrollTop) {
        if (!lenis) setDirectionSafe(top >= lastY.current ? 1 : -1)
        lastY.current = top
      }
      lastScrollTop = top
      lastViewH = viewH
      lastScrollH = scrollH

      const scrollerTop = scroller?.getBoundingClientRect().top ?? 0
      let current: SectionId = ids[0]

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue

        const progress = measureProgress(el, scrollerTop, viewH)
        progressRef.current[id] = progress

        // Sections overlap at boundaries; the later one wins, matching reading order.
        if (progress > 0) current = id
      }

      setActiveSafe(current)
    }

    lenis?.on('scroll', onLenisScroll)

    const tick = (): void => update()
    gsap.ticker.add(tick)

    // Sections mount lazily and pins change layout; always re-measure after those.
    const onLayout = (): void => update(true)
    window.addEventListener('resize', onLayout)
    window.addEventListener('load', onLayout)
    update(true)

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', onLayout)
      window.removeEventListener('load', onLayout)
      lenis?.off('scroll', onLenisScroll)
    }
  }, [ids])

  return { active, direction, progressRef }
}
