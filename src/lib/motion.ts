import { SplitText } from 'gsap/SplitText'

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

type SplitTarget = Parameters<typeof SplitText.create>[0]

const WORD_SPLIT = {
  type: 'words, chars',
  wordsClass: 'split-word',
  charsClass: 'split-char',
} as const

const FULL_SPLIT = {
  type: 'lines, words, chars',
  linesClass: 'split-line',
  wordsClass: 'split-word',
  charsClass: 'split-char',
} as const

/**
 * SplitText with the project's shared class names. `splitWords` for
 * word/char reveals, `splitFull` where line masks are needed too.
 */
export function splitWords(target: SplitTarget): SplitText {
  return SplitText.create(target, { ...WORD_SPLIT })
}

export function splitFull(target: SplitTarget): SplitText {
  return SplitText.create(target, { ...FULL_SPLIT })
}
