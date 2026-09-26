import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import type Lenis from 'lenis'
import { useEffect, useRef, useState } from 'react'

import { CyberFrame } from '@/components/ui/cyber-frame'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export type ScrollBarProps = {
  appearDelayMs?: number
  className?: string
}

const MIN_THUMB = 28

/**
 * Routes a scroll request through Lenis when it's mounted (window.__lenis,
 * set by initSmoothScroll) so we don't fight its own per-frame position
 * updates. Falls back to native scrollTo when Lenis isn't running — e.g.
 * prefers-reduced-motion, or this component used without smooth scroll.
 */
function scrollTo(top: number, options?: { immediate?: boolean }) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis
  if (lenis) {
    lenis.scrollTo(top, { immediate: options?.immediate ?? false })
    return
  }
  window.scrollTo({ top, behavior: options?.immediate ? 'auto' : 'smooth' })
}

export function ScrollBar({ appearDelayMs = 4000, className }: ScrollBarProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ startY: number; startTop: number } | null>(null)
  const [scrollable, setScrollable] = useState(false)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from(trackRef.current, {
        xPercent: 200,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        delay: appearDelayMs / 1000,
      })
    },
    { scope: trackRef, dependencies: [appearDelayMs] }
  )

  useEffect(() => {
    const track = trackRef.current
    const thumb = thumbRef.current
    if (!track || !thumb) return

    let raf = 0
    const update = () => {
      const content = document.documentElement.scrollHeight
      const viewport = window.innerHeight
      const maxTop = content - viewport
      const next = maxTop > 0
      setScrollable((prev) => (prev === next ? prev : next))
      if (!next) return
      const trackHeight = track.clientHeight
      const thumbHeight = Math.max((viewport / content) * trackHeight, MIN_THUMB)
      const ratio = window.scrollY / maxTop
      thumb.style.height = `${thumbHeight}px`
      thumb.style.transform = `translateY(${(trackHeight - thumbHeight) * ratio}px)`
    }
    const schedule = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        update()
      })
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('load', update)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('load', update)
    }
  }, [])

  const scrollToRatio = (clientY: number) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const thumbHeight = thumbRef.current?.clientHeight ?? MIN_THUMB
    const ratio = Math.min(
      Math.max((clientY - rect.top - thumbHeight / 2) / (rect.height - thumbHeight), 0),
      1
    )
    scrollTo(ratio * (document.documentElement.scrollHeight - window.innerHeight))
  }

  return (
    <CyberFrame
      ref={trackRef}
      data-slot="scroll-bar"
      aria-hidden="true"
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest('[data-slot="scroll-bar-thumb"]')) return
        scrollToRatio(e.clientY)
      }}
      stroke="var(--border)"
      strokeWidth={1}
      fill="rgba(127, 127, 127, 0.12)"
      contentClassName="h-full p-1"
      className={cn(
        'fixed top-24 right-3 bottom-6 z-50 w-3 backdrop-blur-md',
        !scrollable && 'invisible',
        className
      )}
    >
      <CyberFrame
        ref={thumbRef}
        data-slot="scroll-bar-thumb"
        onPointerDown={(e) => {
          e.stopPropagation()
          ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
          drag.current = { startY: e.clientY, startTop: window.scrollY }
        }}
        onPointerMove={(e) => {
          if (!drag.current || !trackRef.current) return
          const trackHeight = trackRef.current.clientHeight
          const thumbHeight = thumbRef.current?.clientHeight ?? MIN_THUMB
          const maxTop = document.documentElement.scrollHeight - window.innerHeight
          const deltaRatio = (e.clientY - drag.current.startY) / (trackHeight - thumbHeight)
          // immediate: true — a scrollbar drag needs to track the pointer 1:1;
          // Lenis's default eased scrollTo would lag noticeably behind the cursor.
          scrollTo(drag.current.startTop + deltaRatio * maxTop, { immediate: true })
        }}
        onPointerUp={() => {
          drag.current = null
        }}
        onPointerCancel={() => {
          drag.current = null
        }}
        stroke="var(--accent)"
        strokeWidth={1}
        fill="rgba(181, 0, 0, 0.55)"
        chamferX={2}
        chamferY={4}
        contentClassName="p-0"
        className="w-full cursor-grab active:cursor-grabbing"
      >
        <div className="h-full w-full" />
      </CyberFrame>
    </CyberFrame>
  )
}
