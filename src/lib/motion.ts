export let reduceMotion: boolean | null = null

export function prefersReducedMotion(): boolean {
  if (reduceMotion !== null) return reduceMotion
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function setReducedMotion(value: boolean | null): void {
  reduceMotion = value
}

export function toggleReducedMotion(): boolean {
  reduceMotion = !prefersReducedMotion()
  return reduceMotion as boolean
}
