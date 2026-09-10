import { useEffect, useRef, useState } from 'react'

export function useJourneyProgress() {
  const [progress, setProgress] = useState(0)
  const target = useRef(0)
  const current = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      target.current = max > 0 ? window.scrollY / max : 0
    }

    let raf = 0
    const tick = () => {
      current.current += (target.current - current.current) * 0.08
      if (Math.abs(target.current - current.current) > 0.0005) {
        setProgress(current.current)
      } else if (target.current !== current.current) {
        current.current = target.current
        setProgress(current.current)
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    tick()

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return progress
}
