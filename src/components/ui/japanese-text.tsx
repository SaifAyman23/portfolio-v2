import { cn } from '@/lib/utils'

export type JapaneseTextProps = {
  text: string
  id?: string
  color?: string
  border?: boolean
  /**
   * 'both'    – fill + optional outline in one element (default, previous behaviour)
   * 'fill'    – only the filled text (no outline)
   * 'outline' – only the outline (the fill is kept transparent so the size stays identical).
   *             Lets you stack the outline on top of something while the fill stays below it.
   */
  layer?: 'both' | 'fill' | 'outline'
  className?: string
}

const JAPANESE_FONT = "'Inter','Noto Sans JP','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif"

export function JapaneseText({
  text,
  id,
  color = 'currentColor',
  border = false,
  layer = 'both',
  className,
}: JapaneseTextProps) {
  const showBorder = layer === 'outline' || (layer === 'both' && border)

  return (
    <span
      id={id}
      className={cn('relative inline-block', className)}
      style={{ fontFamily: JAPANESE_FONT }}
    >
      <span className="relative z-0" style={{ color: layer === 'outline' ? 'transparent' : color }}>
        {text}
      </span>
      {showBorder && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[9999]"
          style={{ color: 'transparent', WebkitTextStroke: `3px ${color}` }}
        >
          {text}
        </span>
      )}
    </span>
  )
}
