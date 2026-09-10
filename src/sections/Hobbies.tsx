import { ScrambleTitle } from '@/components/cyber'
import { useSectionProgress } from '@/systems/scroll/useSectionProgress'

export function Hobbies() {
  const t = useSectionProgress('hobbies')
  const opacity = Math.min(t / 0.22, 1) * (1 - Math.min(Math.max((t - 0.78) / 0.22, 0), 1))
  const blur = (1 - Math.min(t / 0.22, 1)) * 8 + Math.min(Math.max((t - 0.78) / 0.22, 0), 1) * 8

  return (
    <section
      id="hobbies"
      className="relative flex min-h-[70vh] flex-col items-center justify-center bg-transparent px-6 py-20"
      aria-label="Hobbies"
    >
      <div
        className="flex max-w-3xl flex-col items-center text-center"
        style={{ opacity, filter: `blur(${blur.toFixed(1)}px)` }}
      >
        <ScrambleTitle
          title="HOBBIES"
          from="bottom"
          className="font-display text-[clamp(2.4rem,8vw,4.5rem)] font-black tracking-tighter"
        />
        <p className="font-body mt-3 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
          You haven&apos;t defined this yet — intentionally left open. When we reach this phase, you
          tell me what you want it to be. No invention now.
        </p>
        <span className="mt-4 rounded-full border border-border bg-white px-3 py-1 font-mono text-[11px] tracking-wide text-muted-foreground">
          Open for your direction
        </span>
      </div>
    </section>
  )
}
