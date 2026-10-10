import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let queued: gsap.core.Tween | null = null

/**
 * Debounced ScrollTrigger.refresh(). Many callers (fonts, dozens of images)
 * collapse into a single refresh instead of one full re-measure each.
 */
export function queueScrollRefresh(delay = 0.15) {
  queued?.kill()
  queued = gsap.delayedCall(delay, () => {
    queued = null
    ScrollTrigger.refresh()
  })
}

/**
 * Re-measures trigger positions once fonts and still-loading images settle,
 * so start/end values are never stale. Returns a cleanup function.
 *
 * ScrollTrigger already refreshes on window load and resize by itself.
 */
export function refreshWhenAssetsSettle(): () => void {
  let active = true

  const refresh = () => {
    if (active) queueScrollRefresh()
  }

  document.fonts?.ready.then(refresh)

  const pending = Array.from(document.querySelectorAll<HTMLImageElement>('img')).filter(
    (img) => !img.complete
  )

  pending.forEach((img) => img.addEventListener('load', refresh, { once: true }))

  return () => {
    active = false
    pending.forEach((img) => img.removeEventListener('load', refresh))
  }
}
