import { ScrambleTitle } from '@/components/cyber'
import { TOOL_CATEGORIES } from '@/config/tools'
import { useSectionProgress } from '@/systems/scroll/useSectionProgress'

export function Tools() {
  const t = useSectionProgress('tools')
  const titleEnter = Math.min(t / 0.28, 1)
  const titleMove = Math.min(Math.max((t - 0.32) / 0.22, 0), 1)
  const titleExit = Math.min(Math.max((t - 0.72) / 0.18, 0), 1)

  const titleX = titleMove * -28
  const titleY = titleMove * -42
  const titleScale = 1 - titleMove * 0.42
  const titleAlign = titleMove > 0.5 ? 'left' : 'center'

  return (
    <section
      id="tools"
      className="relative flex min-h-[140vh] flex-col bg-transparent px-6 py-16"
      aria-label="Tools"
    >
      <div
        className="sticky top-[14vh] z-10 flex w-full max-w-6xl flex-col"
        style={{
          alignItems: titleAlign === 'left' ? 'flex-start' : 'center',
          opacity: 1 - titleExit,
          filter: `blur(${(titleExit * 8).toFixed(1)}px)`,
          transform: `translate(${titleX.toFixed(1)}%, ${titleY.toFixed(1)}px) scale(${titleScale.toFixed(3)})`,
          transformOrigin: titleAlign === 'left' ? '0% 0%' : '50% 50%',
        }}
      >
        <div style={{ opacity: titleEnter, transform: `translateY(${(1 - titleEnter) * 18}px)` }}>
          <ScrambleTitle
            title="TOOLS"
            from="bottom"
            className="font-display text-[clamp(2.8rem,10vw,6rem)] font-black tracking-tighter"
          />
        </div>
        <p className="font-body mt-2 text-xs tracking-[0.2em] text-muted-foreground">
          electrons orbiting the jet
        </p>
      </div>

      <div
        className="relative z-10 mx-auto mt-[22vh] grid w-full max-w-6xl grid-cols-1 gap-4 md:grid-cols-3"
        style={{
          opacity: Math.min(Math.max((t - 0.28) / 0.2, 0), 1) * (1 - titleExit),
          filter: `blur(${(Math.max(0, 1 - Math.min((t - 0.28) / 0.2, 1)) * 6 + titleExit * 8).toFixed(1)}px)`,
        }}
      >
        {TOOL_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="rounded-xl border border-border bg-white/80 p-4 backdrop-blur-md shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
              <h3 className="font-display text-xs font-bold tracking-[0.14em]">
                {cat.label.toUpperCase()}
              </h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {cat.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-white px-2.5 py-1 font-mono text-[11px] tracking-wide text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-3 font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
              {cat.items.length} electrons · radius{' '}
              {cat.id === 'backend' ? '1.35' : cat.id === 'frontend' ? '1.85' : '2.35'}
            </p>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-[18vh] left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
        {t < 0.72 ? 'ORBITING' : 'EXPANDING → HOBBIES'}
      </div>
    </section>
  )
}
