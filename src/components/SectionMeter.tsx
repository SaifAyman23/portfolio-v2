import { SECTIONS, type SectionId } from '@/config/sections'
import { useSectionTracker } from '@/hooks/useSectionTracker'
import { cn } from '@/lib/utils'

export function SectionMeter({ active }: { active?: SectionId }) {
  const tracked = useSectionTracker()
  const current = active ?? tracked

  return (
    <nav
      aria-label="Section progress"
      className="pointer-events-none fixed top-0 inset-x-0 z-50 flex justify-center"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3 max-sm:px-3">
        <div className="flex flex-1 items-center gap-1 sm:gap-2">
          {SECTIONS.map((s, i) => {
            const isActive = s.id === current
            const isPast = SECTIONS.findIndex((x) => x.id === current) > i
            return (
              <div key={s.id} className="flex flex-1 items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'font-display tabular-nums text-[10px] leading-none tracking-widest transition-colors duration-300 sm:text-xs',
                      isActive ? 'text-red' : isPast ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className={cn(
                      'hidden sm:inline font-body text-[10px] font-bold tracking-[0.14em] transition-colors duration-300 sm:text-xs',
                      isActive ? 'text-red' : 'text-muted-foreground'
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < SECTIONS.length - 1 && (
                  <div className="h-px flex-1 mx-1 sm:mx-2 bg-border relative overflow-hidden">
                    <div
                      className={cn(
                        'absolute inset-y-0 left-0 bg-red transition-all duration-500',
                        isPast || isActive ? 'w-full' : 'w-0'
                      )}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
