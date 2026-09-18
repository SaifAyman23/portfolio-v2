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
    const triggers = ids.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null

      return ScrollTrigger.create({
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
    })

    return () => {
      triggers.forEach((trigger) => trigger?.kill())
    }
  }, [ids])

  return { active, direction, progressRef }
}
