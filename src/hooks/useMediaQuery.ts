import { useEffect, useState } from 'react'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

function currentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'lg'
  const width = window.innerWidth
  if (width < 640) return 'xs'
  if (width < 768) return 'sm'
  if (width < 1024) return 'md'
  if (width < 1280) return 'lg'
  if (width < 1536) return 'xl'
  return '2xl'
}

/**
 * The active Tailwind breakpoint tier. Reactive — updates on resize
 * and rotation. Mobile is `xs` and `sm` (below 768px).
 */
export function useMediaQuery(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(currentBreakpoint)

  useEffect(() => {
    const onResize = () => {
      const next = currentBreakpoint()
      setBreakpoint((prev) => (prev === next ? prev : next))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return breakpoint
}
