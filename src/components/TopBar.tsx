import { useMemo, type CSSProperties } from 'react'

import { SECTIONS, type SectionId } from '@/config/sections'
import { cn } from '@/lib/utils'

const BAR_COUNT = 61
const MIN_HEIGHT = 6
const MAX_HEIGHT = 34
const MAX_BLUR = 3

export type TopBarProps = {
  active: SectionId
  direction?: 1 | -1
  className?: string
}

export function TopBar({ active, direction = 1, className }: TopBarProps) {
  const center = (BAR_COUNT - 1) / 2

  const bars = useMemo(
    () =>
      Array.from({ length: BAR_COUNT }, (_, i) => {
        const distance = Math.abs(i - center) / center
        const curved = Math.pow(1 - distance, 2)
        return {
          height: MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) * curved,
          blur: distance * MAX_BLUR,
          opacity: curved,
        }
      }),
    [center]
  )

  const label = SECTIONS.find((section) => section.id === active)?.label ?? active
  const light = active === 'about' || active === 'experience' || active === 'footer'
  const baseColor = light ? 'white' : 'var(--foreground)'

  console.log(
    `useSectionTracker: active=${active}, direction=${direction}`
  );
  return (
    <header
      data-slot="top-bar"
      className={cn(
        'pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center pt-3',
        className
      )}
    >
      <div
        data-slot="top-bar-bars"
        aria-hidden="true"
        className="flex w-full max-w-4xl items-start transition-all justify-center gap-[3px] px-6"
      >
        {bars.map((bar, i) => {
          const redMix = Math.pow(bar.opacity, 8) * 100
          return (
            <span
              key={i}
              data-slot={i === center ? 'top-bar-bar-active' : 'top-bar-bar'}
              className="w-[2px] shrink-0 rounded-full transition-[background-color] duration-500"
              style={{
                height: bar.height,
                filter: `blur(${bar.blur.toFixed(2)}px)`,
                opacity: bar.opacity.toFixed(3),
                backgroundColor: `color-mix(in srgb, var(--accent) ${redMix.toFixed(1)}%, ${baseColor} ${(100 - redMix).toFixed(1)}%)`,
              }}
            />
          )
        })}
      </div>
      <div
        key={active}
        data-slot="top-bar-label"
        className="topbar-name mt-1.5"
        style={{ '--enter-dir': direction } as CSSProperties}
      >
        <span
          className={cn(
            'font-ticking text-xs tracking-[0.3em] transition-colors duration-500',
            light ? 'text-white' : 'text-foreground'
          )}
        >
          {label}
        </span>
      </div>
    </header>
  )
}
