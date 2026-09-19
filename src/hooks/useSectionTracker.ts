import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'

import { SECTION_IDS, type SectionId } from '@/config/sections'

export type SectionTracker = {
  active: SectionId
  direction: 1 | -1
  progressRef: React.RefObject<Record<SectionId, number>>
}

// Viewport line sections are judged against (10% from the top).
// Kept as the single handoff rule so every consumer agrees.
const ACTIVATION_LINE = 0.1

export function useSectionTracker(ids: readonly SectionId[] = SECTION_IDS): SectionTracker {
  const [active, setActive] = useState<SectionId>(ids[0])
  const [direction, setDirection] = useState<1 | -1>(1)
  const progressRef = useRef(
    Object.fromEntries(ids.map((id) => [id, 0])) as Record<SectionId, number>
  )
  const lastY = useRef(typeof window === 'undefined' ? 0 : window.scrollY)

  useEffect(() => {
    // Single trigger for the whole page. Active section is derived from
    // measured section rectangles — never from per-section trigger
    // positions — so trigger count stays at one no matter how many
    // section timelines exist, and none can starve or reorder it.
    const update = () => {
      const elements = ids.map((id) => document.getElementById(id))
      if (elements.some((el) => !el)) return

      const line = window.innerHeight * ACTIVATION_LINE
      const y = window.scrollY
      const nextDirection = y >= lastY.current ? 1 : -1
      lastY.current = y
      setDirection((prev) => (prev === nextDirection ? prev : nextDirection))

      let current = ids[0]
      elements.forEach((el, i) => {
        const rect = el!.getBoundingClientRect()
        progressRef.current[ids[i]] = Math.min(Math.max((line - rect.top) / rect.height, 0), 1)
        if (rect.top <= line && rect.bottom >= line) current = ids[i]
      })
      setActive((prev) => (prev === current ? prev : current))
    }

    const tracker = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: update,
    })
    update()
    window.addEventListener('load', update)

    return () => {
      window.removeEventListener('load', update)
      tracker.kill()
    }
  }, [ids])

  return { active, direction, progressRef }
}
