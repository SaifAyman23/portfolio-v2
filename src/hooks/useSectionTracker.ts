import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, useState } from 'react'

import { SECTION_IDS, type SectionId } from '@/config/sections'

export type SectionTracker = {
  active: SectionId
  direction: 1 | -1
  progressRef: React.RefObject<Record<SectionId, number>>
}

export function useSectionTracker(ids: readonly SectionId[] = SECTION_IDS): SectionTracker {
  const [active, setActive] = useState<SectionId>(ids[0])
  const [direction, setDirection] = useState<1 | -1>(1)
  const progressRef = useRef(
    Object.fromEntries(ids.map((id) => [id, 0])) as Record<SectionId, number>
  )

  useEffect(() => {
    const triggers: Array<ScrollTrigger | null> = []
    const pending = new Set(ids)

    // Sections render inside lazy-loaded Home, which may resolve AFTER
    // this effect runs. Create each trigger the moment its element
    // appears instead of giving up on missing ones.
    const createFor = (id: SectionId) => {
      const el = document.getElementById(id)
      if (!el || !pending.has(id)) return
      pending.delete(id)
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 10%',
          end: 'bottom 10%',
          onToggle: (self) => {
            if (self.isActive) {
              setActive(id)
              setDirection(self.direction === -1 ? -1 : 1)
            }
          },
          onUpdate: (self) => {
            progressRef.current[id] = self.progress
          },
        })
      )
      if (pending.size === 0) observer.disconnect()
    }

    ids.forEach(createFor)
    const observer = new MutationObserver(() => ids.forEach(createFor))
    if (pending.size > 0) observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      triggers.forEach((trigger) => trigger?.kill())
    }
  }, [ids])

  return { active, direction, progressRef }
}
