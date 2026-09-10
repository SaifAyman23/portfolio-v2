import type { SectionId } from './sections'

export const JOURNEY_RANGES: Record<SectionId, [number, number]> = {
  hero: [0.0, 0.14],
  about: [0.14, 0.28],
  experience: [0.28, 0.48],
  projects: [0.48, 0.67],
  tools: [0.67, 0.82],
  hobbies: [0.82, 0.92],
  contact: [0.92, 1.0],
}

export function getSectionProgress(journeyProgress: number, section: SectionId): number {
  const [start, end] = JOURNEY_RANGES[section]
  if (journeyProgress <= start) return 0
  if (journeyProgress >= end) return 1
  return (journeyProgress - start) / (end - start)
}

export function getActiveSection(journeyProgress: number): SectionId {
  for (const [id, [start, end]] of Object.entries(JOURNEY_RANGES) as Array<
    [SectionId, [number, number]]
  >) {
    if (journeyProgress >= start && journeyProgress < end) return id
  }
  return 'contact'
}
