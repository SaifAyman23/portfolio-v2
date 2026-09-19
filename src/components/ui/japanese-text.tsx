import { cn } from '@/lib/utils'

export type JapaneseTextProps = {
  text: string
  id?: string
  color?: string
  border?: boolean
  className?: string
}

const JAPANESE_FONT = "'Inter','Noto Sans JP','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif"

export function JapaneseText({
  text,
  id,
  color = 'currentColor',
  border = false,
  className,
}: JapaneseTextProps) {
  return (
    <span id={id} className={cn('relative inline-block', className)} style={{ fontFamily: JAPANESE_FONT }}>
      <span className="relative z-0" style={{ color }}>
        {text}
      </span>
      {border && (
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
