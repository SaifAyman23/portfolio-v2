import { useEffect, useState } from 'react'

import { CyberFrame } from './cyber-frame'
import { cyberFrameClip } from './cyber-frame-path'

import { cn } from '@/lib/utils'

export type CyberImageProps = {
  src: string
  alt: string
  width?: number
  height?: number
  loading?: 'eager' | 'lazy'
  decoding?: 'async' | 'sync' | 'auto'
  fetchPriority?: 'high' | 'low' | 'auto'
  srcSet?: string
  sizes?: string
  frameClassName?: string
  contentClassName?: string
  imgClassName?: string
  stroke?: string | false
  strokeWidth?: number
  fill?: string
  chamferX?: number
  chamferY?: number
  imgRef?: React.Ref<HTMLImageElement>
}

export function CyberImage({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  srcSet,
  sizes,
  frameClassName,
  contentClassName,
  imgClassName,
  stroke,
  strokeWidth,
  fill,
  chamferX = 54,
  chamferY = 54,
  imgRef,
}: CyberImageProps) {
  const [top, setTop] = useState(src)
  const [bottom, setBottom] = useState<string | null>(null)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (src === top) return
    const frame = requestAnimationFrame(() => {
      setBottom(src)
      setFading(true)
    })
    const timer = window.setTimeout(() => {
      setTop(src)
      setFading(false)
      setBottom(null)
    }, 700)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [src, top])

  return (
    <CyberFrame
      data-slot="cyber-image"
      className={cn('w-full', frameClassName)}
      contentClassName={cn('p-0', contentClassName)}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      chamferX={chamferX}
      chamferY={chamferY}
    >
      <div
        data-slot="cyber-image-viewport"
        className="relative h-full w-full overflow-hidden"
        style={{
          clipPath: cyberFrameClip(chamferX, chamferY),
        }}
      >
        {bottom && (
          <img
            key={bottom}
            aria-hidden="true"
            data-slot="cyber-image-img-next"
            src={bottom}
            alt=""
            width={width}
            height={height}
            loading={loading}
            decoding={decoding}
            draggable={false}
            className={cn(
              'animate-fade-in absolute inset-0 z-0 h-full w-full object-cover',
              imgClassName
            )}
          />
        )}
        <img
          ref={imgRef}
          data-slot="cyber-image-img"
          src={top}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding={decoding}
          fetchPriority={fetchPriority}
          srcSet={srcSet}
          sizes={sizes}
          draggable={false}
          className={cn(
            'absolute inset-0 z-10 h-full w-full object-cover',
            fading && 'animate-fade-out',
            imgClassName
          )}
        />
      </div>
    </CyberFrame>
  )
}
