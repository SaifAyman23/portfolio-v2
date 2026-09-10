import { JOURNEY_RANGES } from '@/config/journey'
import type { SectionId } from '@/config/sections'
import { useJourneyProgress } from '@/systems/scroll/useJourneyProgress'

export function useSectionProgress(section: SectionId) {
  const journey = useJourneyProgress()
  const [start, end] = JOURNEY_RANGES[section]
  if (journey <= start) return 0
  if (journey >= end) return 1
  return (journey - start) / (end - start)
}
