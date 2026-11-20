import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * Renders fixed chrome (top bar, scroll bar, jet) into #overlay-root, the
 * non-scrolling layer that sits exactly over the framed <main>. That keeps
 * `fixed` elements inside the rounded frame instead of the whole window.
 * Falls back to rendering in place when the layer isn't in the DOM (tests).
 */
export function Overlay({ children }: { children: ReactNode }) {
  const target = typeof document === 'undefined' ? null : document.getElementById('overlay-root')
  return target ? createPortal(children, target) : <>{children}</>
}
