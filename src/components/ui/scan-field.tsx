import { useEffect, useRef } from 'react'

import { createScanEngine, type ScanEngine } from '@/lib/scan-engine'
import { cn } from '@/lib/utils'

export type ScanFieldProps = {
  active: boolean
  onMidpoint?: (entering: boolean) => void
  className?: string
}

const FALLBACK_ACCENT = '#b50000'

export function ScanField({ active, onMidpoint, className }: ScanFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<ScanEngine | null>(null)
  const onMidpointRef = useRef(onMidpoint)

  useEffect(() => {
    onMidpointRef.current = onMidpoint
  }, [onMidpoint])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const accent = getComputedStyle(canvas).getPropertyValue('--accent').trim() || FALLBACK_ACCENT
    const engine = createScanEngine(canvas, {
      colors: ['#1a1a1a', '#ffffff', accent],
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      onMidpoint: (entering) => onMidpointRef.current?.(entering),
    })
    engineRef.current = engine

    if (typeof ResizeObserver === 'undefined') {
      const { width, height } = canvas.getBoundingClientRect()
      engine.resize(width, height)
      return () => engine.destroy()
    }

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      engine.resize(entry.contentRect.width, entry.contentRect.height)
    })
    observer.observe(canvas)

    return () => {
      observer.disconnect()
      engine.destroy()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    engineRef.current?.setActive(active)
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      data-slot="scan-field"
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    />
  )
}
