import { CyberFrame } from './cyber-frame'

import { cn } from '@/lib/utils'

export type TagProps = {
  text: string
  className?: string
  contentClassName?: string
  textClassName?: string
  stroke?: string | false
  strokeWidth?: number
  fill?: string
}

export function Tag({
  text,
  className,
  contentClassName,
  textClassName,
  stroke,
  strokeWidth,
  fill,
}: TagProps) {
  return (
    <CyberFrame
      data-slot="tag"
      className={cn('inline-flex', className)}
      contentClassName={cn('px-3 py-1', contentClassName)}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
    >
      <span data-slot="tag-text" className={cn('font-mono text-xs tracking-wide', textClassName)}>
        {text}
      </span>
    </CyberFrame>
  )
}
