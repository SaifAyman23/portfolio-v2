import { ScrambleTitle } from '@/components/cyber'
import { useSectionProgress } from '@/systems/scroll/useSectionProgress'

export function About() {
  const t = useSectionProgress('about')

  const titleY = Math.min(t * 0.55, 0.55) * -92
  const titleScale = 1 - Math.min(t * 0.55, 0.55) * 0.18
  const titleOpacity = t < 0.92 ? 1 : 1 - (t - 0.92) / 0.08

  const contentT = Math.min(Math.max((t - 0.28) / 0.42, 0), 1)
  const contentOpacity = contentT * (1 - Math.max((t - 0.82) / 0.18, 0))
  const contentBlur = (1 - contentT) * 8 + Math.max((t - 0.82) / 0.18, 0) * 10
  const contentY = (1 - contentT) * 18 + Math.max((t - 0.82) / 0.18, 0) * -16

  return (
    <section
      id="about"
      className="relative flex min-h-[110vh] flex-col items-center justify-center overflow-hidden bg-white px-6 py-16"
      aria-label="About"
    >
      <div className="pointer-events-none absolute left-1/2 top-[22%] h-px w-[92%] max-w-6xl -translate-x-1/2 bg-gradient-to-r from-transparent via-red/15 to-transparent" />

      <div
        className="relative z-10 flex w-full max-w-3xl flex-col items-center"
        style={{
          opacity: titleOpacity,
          filter: t > 0.82 ? `blur(${(t - 0.82) * 40}px)` : 'blur(0px)',
        }}
      >
        <div
          style={{
            transform: `translateY(${titleY.toFixed(1)}px) scale(${titleScale.toFixed(3)})`,
            transformOrigin: '50% 50%',
            willChange: 'transform',
          }}
          className="flex flex-col items-center"
        >
          <ScrambleTitle
            title="ABOUT"
            from="right"
            className="font-display text-center text-[clamp(3rem,12vw,7rem)] font-black leading-none tracking-tighter"
          />
          <span className="mt-2 h-px w-12 bg-red/60" />
        </div>

        <div
          className="mt-8 w-full max-w-[640px] text-center"
          style={{
            opacity: contentOpacity,
            filter: `blur(${contentBlur.toFixed(2)}px)`,
            transform: `translateY(${contentY.toFixed(1)}px)`,
            willChange: 'opacity, filter, transform',
          }}
        >
          <p className="font-body text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
            Full-stack engineer from Alexandria — two years shipping production-grade products end
            to end. I build <span className="font-semibold text-foreground">Django APIs</span>,{' '}
            <span className="font-semibold text-foreground">real-time systems</span> and{' '}
            <span className="font-semibold text-foreground">React interfaces</span> that feel fast
            because they are fast. I care about the details users never notice and the performance
            they always feel.
          </p>
          <p className="font-body mx-auto mt-4 max-w-[560px] text-[14px] leading-relaxed text-muted-foreground">
            Previously frontend at Genius AI shipping TypeScript production builds, and at
            Digiations delivering a Smart ERP close to the business. Today I own features from
            database design to pixel polish — RBAC, WebSockets, LiveKit, Redis, and the boring
            reliability in between.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-border bg-white px-3 py-1 font-mono text-[11px] tracking-wide text-muted-foreground">
              Alexandria · 2 years
            </span>
            <span className="rounded-full bg-red px-3 py-1 font-mono text-[11px] font-bold tracking-wide text-white">
              Django · React · Real-time
            </span>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[18vh] bg-gradient-to-t from-white to-transparent"
        style={{ opacity: t > 0.78 ? (t - 0.78) / 0.22 : 0 }}
      />
    </section>
  )
}
