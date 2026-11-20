import { ScrollTrigger } from 'gsap/ScrollTrigger'

export interface StickyPin {
  /** Use as the ScrollTrigger `trigger` (never the sticky section itself). */
  spacer: HTMLElement
  /** Ready-made ScrollTrigger vars: the section is "pinned" for `distance` px. */
  vars: Pick<ScrollTrigger.Vars, 'trigger' | 'start' | 'end'>
  /** Puts the section back where it was and removes the spacer. */
  revert: () => void
}

/**
 * Pins a section with CSS `position: sticky` instead of ScrollTrigger's pin.
 *
 * Why: the site scrolls inside <main>, not the window. For a non-window
 * scroller ScrollTrigger can only pin with a JS transform, which is applied a
 * frame after the browser has already scrolled — so the pinned section jitters
 * and flickers (worst on touch devices and trackpads, where scrolling runs on the
 * compositor). `position: sticky` is handled natively by the browser and is
 * always perfectly in sync.
 *
 * The section is wrapped in a spacer whose height is `sectionHeight + distance`.
 * While the spacer scrolls past, the section sticks to the top of <main>;
 * the scrubbed timeline runs over that same range ('top top' → 'bottom bottom').
 *
 * @param distance scroll distance (px) to hold the section, re-evaluated on
 *                 every ScrollTrigger refresh so it follows resizes.
 */
export function createStickyPin(section: HTMLElement, distance: (sectionHeight: number) => number): StickyPin {
  const parent = section.parentNode
  if (!parent) throw new Error('createStickyPin: section is not attached')

  const spacer = document.createElement('div')
  spacer.setAttribute('data-pin-spacer', section.id || '')
  parent.insertBefore(spacer, section)
  spacer.appendChild(section)

  const prev = { position: section.style.position, top: section.style.top }
  section.style.position = 'sticky'
  section.style.top = '0px'

  const measure = () => {
    // Clear first so the section's natural height is measured, not a stale one.
    spacer.style.height = ''
    const h = section.offsetHeight
    spacer.style.height = `${h + Math.max(0, distance(h))}px`
  }

  measure()
  // Runs at the very start of every refresh, before ScrollTrigger measures anything.
  ScrollTrigger.addEventListener('refreshInit', measure)

  return {
    spacer,
    vars: { trigger: spacer, start: 'top top', end: 'bottom bottom' },
    revert: () => {
      ScrollTrigger.removeEventListener('refreshInit', measure)
      section.style.position = prev.position
      section.style.top = prev.top
      if (spacer.parentNode) {
        spacer.parentNode.insertBefore(section, spacer)
        spacer.remove()
      }
    },
  }
}
