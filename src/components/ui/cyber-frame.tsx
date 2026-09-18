import * as React from 'react'

import { cn } from '@/lib/utils'

export type CyberFrameProps = React.ComponentProps<'div'> & {
  contentClassName?: string
  stroke?: string | false
  strokeWidth?: number
  fill?: string
  chamferX?: number
  chamferY?: number
}

function frameClip(chamferX: number, chamferY: number) {
  return `polygon(${chamferX}px 0, 100% 0, 100% calc(100% - ${chamferY}px), calc(100% - ${chamferX}px) 100%, 0 100%, 0 ${chamferY}px)`
}

export function CyberFrame({
  children,
  className,
  contentClassName,
  stroke = '#0a0a0a',
  strokeWidth = 2,
  fill = 'white',
  chamferX = 18,
  chamferY = 18,
  ref,
  ...props
}: CyberFrameProps) {
  const borderClip = frameClip(chamferX, chamferY)
  const fillClip = frameClip(
    Math.max(chamferX - strokeWidth, 0),
    Math.max(chamferY - strokeWidth, 0)
  )

  return (
    <div ref={ref} data-slot="cyber-frame" className={cn('relative', className)} {...props}>
      {stroke !== false && (
        <div
          data-slot="cyber-frame-border"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ clipPath: borderClip, backgroundColor: stroke }}
        />
      )}
      <div
        data-slot="cyber-frame-fill"
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          inset: stroke === false ? 0 : strokeWidth,
          clipPath: stroke === false ? borderClip : fillClip,
          backgroundColor: fill,
        }}
      />
      <div
        data-slot="cyber-frame-content"
        className={cn('relative z-10 h-full w-full px-6 py-5', contentClassName)}
      >
        {children}
      </div>
    </div>
  )
}
