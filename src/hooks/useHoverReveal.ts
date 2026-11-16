import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

type RevealState = 'idle' | 'open' | 'closed'

export type HoverRevealOptions = {
  openDelay?: number
}

/**
 * Open/close state for a hover-revealed layer. Mouse and pen open on hover,
 * touch toggles on tap, keyboard opens on focus-visible and closes on Escape.
 * `hasOpened` stays true after the first reveal so callers can mount heavy
 * content lazily.
 */
export function useHoverReveal({ openDelay = 90 }: HoverRevealOptions = {}) {
  const [state, setState] = useState<RevealState>('idle')
  const rootRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | undefined>(undefined)
  const pointerTypeRef = useRef('mouse')

  const open = state === 'open'

  const cancelPending = useCallback(() => {
    window.clearTimeout(timerRef.current)
  }, [])

  const show = useCallback(() => setState('open'), [])
  const hide = useCallback(() => {
    cancelPending()
    setState((prev) => (prev === 'idle' ? prev : 'closed'))
  }, [cancelPending])

  useEffect(() => cancelPending, [cancelPending])

  useEffect(() => {
    if (!open) return
    const onOutsidePointerDown = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Node && rootRef.current?.contains(event.target)) return
      hide()
    }
    document.addEventListener('pointerdown', onOutsidePointerDown)
    return () => document.removeEventListener('pointerdown', onOutsidePointerDown)
  }, [open, hide])

  const handlers = {
    onPointerDown: (event: PointerEvent) => {
      pointerTypeRef.current = event.pointerType
    },
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      cancelPending()
      timerRef.current = window.setTimeout(show, openDelay)
    },
    onPointerLeave: (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      hide()
    },
    onClick: () => {
      if (pointerTypeRef.current !== 'touch') return
      setState((prev) => (prev === 'open' ? 'closed' : 'open'))
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      if (event.currentTarget.matches(':focus-visible')) show()
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (event.currentTarget.contains(event.relatedTarget)) return
      hide()
    },
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === 'Escape') hide()
    },
  }

  return { open, hasOpened: state !== 'idle', rootRef, handlers }
}
