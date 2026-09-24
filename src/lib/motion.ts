/**
 * Manual override: true forces reduced motion, false forces full motion,
 * null (default) follows the OS setting. Changing it after timelines are
 * created needs a reload to take effect.
 */
export let reduceMotion: boolean | null = null

export function prefersReducedMotion(): boolean {
  if (reduceMotion !== null) return reduceMotion
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function setReducedMotion(value: boolean | null): void {
  reduceMotion = value
}

export function toggleReducedMotion(): boolean {
  reduceMotion = !prefersReducedMotion()
  return reduceMotion as boolean
}
