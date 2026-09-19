import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'

import { SECTION_IDS, type SectionId } from '@/config/sections'

export type SectionTracker = {
  active: SectionId
  direction: 1 | -1
  progressRef: React.RefObject<Record<SectionId, number>>
}

const ACTIVATION_LINE = 0.1

/*
 * A pinned section stops moving while it's pinned — GSAP instead
 * moves its `.pin-spacer` wrapper through the full scroll distance
 * (natural height + whatever extra the pin consumes). Measuring the
 * spacer when it exists keeps progress correct through a pin without
 * this hook needing to know that pin exists at all.
 */
function measureSection(element: HTMLElement): DOMRect {
  const parent = element.parentElement
  return parent?.classList.contains('pin-spacer')
    ? parent.getBoundingClientRect()
    : element.getBoundingClientRect()
}

export function useSectionTracker(
  ids: readonly SectionId[] = SECTION_IDS
): SectionTracker {
  const [active, setActive] = useState<SectionId>(ids[0])
  const [direction, setDirection] = useState<1 | -1>(1)

  const progressRef = useRef(
    Object.fromEntries(ids.map((id) => [id, 0])) as Record<SectionId, number>
  )

  const lastY = useRef(typeof window === 'undefined' ? 0 : window.scrollY)

  useEffect(() => {
    let observer: MutationObserver | null = null

    const update = () => {
      const elements = ids.map((id) => document.getElementById(id))
      if (elements.some((element) => !element)) return

      const line = window.innerHeight * ACTIVATION_LINE
      const y = window.scrollY
      const nextDirection: 1 | -1 = y >= lastY.current ? 1 : -1
      lastY.current = y

      setDirection((previous) =>
        previous === nextDirection ? previous : nextDirection
      )

      let current = ids[0]

      elements.forEach((element, index) => {
        if (!element) return

        const rect = measureSection(element)

        progressRef.current[ids[index]] = Math.min(
          Math.max((line - rect.top) / rect.height, 0),
          1
        )

        if (rect.top <= line && rect.bottom > line) {
          current = ids[index]
        }
      })

      setActive((previous) => (previous === current ? previous : current))
    }

    const refresh = () => {
      ScrollTrigger.refresh()
      update()
    }

    const tracker = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: update,
    })

    update()

    window.addEventListener('resize', refresh)
    window.addEventListener('load', refresh)

    observer = new MutationObserver(() => {
      if (!ids.every((id) => document.getElementById(id))) return
      refresh()
      observer?.disconnect()
      observer = null
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      tracker.kill()
      observer?.disconnect()
      observer = null
      window.removeEventListener('resize', refresh)
      window.removeEventListener('load', refresh)
    }
  }, [ids])

  return { active, direction, progressRef }
}