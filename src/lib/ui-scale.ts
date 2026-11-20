/**
 * One scale for the whole desktop design.
 *
 * From `SCALE_FROM` (the xl breakpoint) up, the root font size and the jet
 * camera follow `scale = min(width / REF_W, height / REF_H)`, so text, spacing,
 * frames and the jet all grow and shrink together and the composition looks the
 * same on every desktop screen. Everything sized in rem scales automatically;
 * px/vw/vh sizes in components were converted to rem for that reason.
 *
 * To retune: set REF_W / REF_H to the window size (px) you designed at. At
 * exactly that size the scale is 1 and nothing changes from the unscaled design.
 * Below SCALE_FROM the scale is 1 and the existing responsive layout is untouched.
 */
export const REF_W = 1440
export const REF_H = 800
export const SCALE_FROM = 1280

/** The scale never grows past this: on huge screens extra pixels add room, not size. */
export const MAX_SCALE = 2

/**
 * The framed <main> is never wider than this aspect ratio (width / height).
 * On ultrawide screens the black margin around the frame grows on the sides
 * instead of the composition stretching.
 */
export const MAX_ASPECT = 2.2

/** Gap kept around <main> (m-4 = 16px each side). Always px — never scaled. */
export const FRAME_GAP = 16

/**
 * Global text-size dial, applied on every screen size. All rem-based type
 * (and rem spacing) is multiplied by this: 1 = original size, 0.9 = 10% smaller.
 * It only changes the root font size — the jet camera and chamfers follow
 * `--ui-scale`, which is untouched, so they keep their size.
 */
export const TEXT_SCALE = 0.9

/**
 * Size (px) of the framed <main>: the window minus the gap, limited to
 * MAX_ASPECT and to what MAX_SCALE can fill. `capped` is false when the
 * plain `window - gap` size applies (the CSS fallback then handles it).
 */
export function computeFrame(width = window.innerWidth, height = window.innerHeight) {
  const availW = width - FRAME_GAP * 2
  const availH = height - FRAME_GAP * 2
  const w = Math.min(availW, availH * MAX_ASPECT, REF_W * MAX_SCALE - FRAME_GAP * 2)
  const h = Math.min(availH, REF_H * MAX_SCALE - FRAME_GAP * 2)
  return { w: Math.floor(w), h: Math.floor(h), capped: w < availW || h < availH }
}

export function computeUiScale(width = window.innerWidth, height = window.innerHeight): number {
  if (width < SCALE_FROM) return 1
  // Measure against the (possibly capped) frame, so the scale matches what is actually drawn.
  const frame = computeFrame(width, height)
  const effW = frame.w + FRAME_GAP * 2
  const effH = frame.h + FRAME_GAP * 2
  return Math.min(MAX_SCALE, effW / REF_W, effH / REF_H)
}

let current = 1

export function getUiScale(): number {
  return current
}

function apply(): void {
  current = computeUiScale()
  const root = document.documentElement
  root.style.setProperty('--ui-scale', String(current))

  // Only set when capped; otherwise the CSS fallback (100dvh/100vw - 32px) is used,
  // which keeps tracking mobile URL-bar changes natively.
  const frame = computeFrame()
  if (frame.capped) {
    root.style.setProperty('--frame-w', `${frame.w}px`)
    root.style.setProperty('--frame-h', `${frame.h}px`)
  } else {
    root.style.removeProperty('--frame-w')
    root.style.removeProperty('--frame-h')
  }
  root.style.fontSize = `${16 * current * TEXT_SCALE}px`
}

/** Applies the scale now and keeps it in sync with the window. Returns cleanup. */
export function initUiScale(): () => void {
  apply()
  window.addEventListener('resize', apply)
  window.addEventListener('orientationchange', apply)
  return () => {
    window.removeEventListener('resize', apply)
    window.removeEventListener('orientationchange', apply)
  }
}
