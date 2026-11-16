import { useEffect, useState } from 'react'

import { cyberFrameClip } from '@/components/ui/cyber-frame-path'
import { ScanField } from '@/components/ui/scan-field'
import { cn } from '@/lib/utils'

export type ProjectGalleryProps = {
  title: string
  images: readonly string[]
  open: boolean
  mounted: boolean
  className?: string
}

const FRAME_CHAMFER = 54
const CYCLE_MS = 2600
const FADE_MS = 1000

export function ProjectGallery({ title, images, open, mounted, className }: ProjectGalleryProps) {
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (!open) return
    const cycle = window.setInterval(
      () => setIndex((current) => (current + 1) % images.length),
      CYCLE_MS
    )
    return () => window.clearInterval(cycle)
  }, [open, images.length])

  return (
    <div
      data-slot="project-gallery"
      aria-hidden={!shown}
      className={cn('pointer-events-none absolute inset-0 z-20 overflow-hidden', className)}
      style={{ clipPath: cyberFrameClip(FRAME_CHAMFER, FRAME_CHAMFER) }}
    >
      <div className={cn('absolute inset-0 z-10 bg-[#0a0a0a]', shown ? 'visible' : 'invisible')}>
        {mounted &&
          images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${title} — screenshot ${i + 1}`}
              loading="eager"
              decoding="async"
              draggable={false}
              className={cn(
                'absolute inset-0 h-full w-full object-cover object-center transition-opacity ease-out motion-reduce:transition-none',
                i === index ? 'opacity-100' : 'opacity-0'
              )}
              style={{ transitionDuration: `${FADE_MS}ms` }}
            />
          ))}
      </div>
      <div aria-hidden="true" className="absolute inset-0 z-20">
        <ScanField active={open} onMidpoint={setShown} />
      </div>
    </div>
  )
}
