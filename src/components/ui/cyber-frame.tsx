import * as React from 'react'

import { cn } from '@/lib/utils'

export const CYBER_FRAME_VIEWBOX = { width: 263, height: 294 } as const

export function buildCyberFramePath(
  width = CYBER_FRAME_VIEWBOX.width,
  height = CYBER_FRAME_VIEWBOX.height,
  chamferX = 70,
  chamferY = 38,
  inset = 2
) {
  const left = inset
  const top = inset
  const right = width - inset
  const bottom = height - inset
  return [
    `M ${left + chamferX} ${top}`,
    `L ${right} ${top}`,
    `L ${right} ${bottom - chamferY}`,
    `L ${right - chamferX} ${bottom}`,
    `L ${left} ${bottom}`,
    `L ${left} ${top + chamferY}`,
    'Z',
  ].join(' ')
}

export const CYBER_FRAME_PATH = buildCyberFramePath()

export type CyberFrameProps = React.ComponentProps<'div'> & {
  contentClassName?: string
  stroke?: string | false
  strokeWidth?: number
  fill?: string
  chamferX?: number
  chamferY?: number
  svgRef?: React.Ref<SVGSVGElement>
  borderRef?: React.Ref<SVGPathElement>
  fillRef?: React.Ref<SVGPathElement>
}

export function CyberFrame({
  children,
  className,
  contentClassName,
  stroke = '#0a0a0a',
  strokeWidth = 4,
  fill = 'transparent',
  chamferX = 70,
  chamferY = 38,
  svgRef,
  borderRef,
  fillRef,
  ref,
  ...props
}: CyberFrameProps) {
  const { width, height } = CYBER_FRAME_VIEWBOX
  const d = buildCyberFramePath(width, height, chamferX, chamferY)

  return (
    <div ref={ref} data-slot="cyber-frame" className={cn('relative', className)} {...props}>
      <svg
        ref={svgRef}
        data-slot="cyber-frame-svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <path ref={fillRef} data-slot="cyber-frame-fill" d={d} fill={fill} stroke="none" />
        {stroke !== false && (
          <path
            ref={borderRef}
            data-slot="cyber-frame-border"
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="miter"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      <div
        data-slot="cyber-frame-content"
        className={cn('relative z-10 h-full w-full px-6 py-5', contentClassName)}
      >
        {children}
      </div>
    </div>
  )
}
