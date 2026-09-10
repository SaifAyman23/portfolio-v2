import { useEffect, useRef, useState } from 'react'

import { TIMINGS } from '@/config/timings'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#£%&'

function scrambleWord(word: string, progress: number): string {
  if (progress >= 1) return word
  return word
    .split('')
    .map((c) => {
      if (c === ' ') return ' '
      const revealAt = Math.random() * 0.6
      if (progress > revealAt + 0.35) return c
      return CHARS[Math.floor(Math.random() * CHARS.length)] ?? c
    })
    .join('')
}

type ScrambleTitleProps = {
  title: string
  className?: string
  as?: 'h1' | 'h2'
  trigger?: boolean
}

export function ScrambleTitle({ title, className, as: Tag = 'h2', trigger = true }: ScrambleTitleProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [display, setDisplay] = useState(title)
  const [phase, setPhase] = useState<'scramble' | 'red' | 'sharp'>('scramble')

  useEffect(() => {
    if (!trigger) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.55 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [trigger])

  useEffect(() => {
    if (!visible) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      queueMicrotask(() => {
        setDisplay(title)
        setPhase('sharp')
      })
      return
    }

    let raf = 0
    const start = performance.now()
    const total = (TIMINGS.title.scrambleDuration + TIMINGS.title.redBlurDuration + TIMINGS.title.resolveDuration) * 1000

    const tick = (now: number) => {
      const elapsed = now - start
      const p = Math.min(elapsed / total, 1)

      if (p < 0.45) {
        setPhase('scramble')
        setDisplay(scrambleWord(title, p / 0.45))
      } else if (p < 0.7) {
        setPhase('red')
        setDisplay(title)
      } else {
        setPhase('sharp')
        setDisplay(title)
      }

      if (p < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [visible, title])

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{
        filter: phase === 'red' ? 'blur(6px)' : phase === 'scramble' ? 'blur(2px)' : 'blur(0)',
        color: phase === 'red' ? '#E10600' : undefined,
        opacity: visible ? 1 : 0,
        transition: 'filter 0.35s ease, color 0.3s ease',
      }}
      aria-label={title}
    >
      {display}
    </Tag>
  )
}
