import { SplitText } from 'gsap/SplitText'

type SplitTarget = Parameters<typeof SplitText.create>[0]

const WORD_SPLIT = {
  type: 'words, chars',
  wordsClass: 'split-word',
  charsClass: 'split-char',
  aria: 'none',
} as const

const FULL_SPLIT = {
  type: 'lines, words, chars',
  linesClass: 'split-line',
  wordsClass: 'split-word',
  charsClass: 'split-char',
  aria: 'none',
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
