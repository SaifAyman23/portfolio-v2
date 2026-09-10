import { useSectionProgress } from '@/systems/scroll/useSectionProgress'

export function Hero() {
  const t = useSectionProgress('hero')
  const fade = 1 - Math.min(t * 1.35, 1)
  const blur = t * 10
  const y = t * -32

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-transparent"
      aria-label="Hero"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red to-transparent opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red to-transparent opacity-60"
      />

      <div className="pointer-events-none absolute left-4 top-[88px] hidden select-none flex-col gap-1 md:flex">
        <span className="font-mono text-[10px] tracking-[0.22em] text-red">
          SYS — 35.68N / 139.69E
        </span>
        <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
          TOKYO DRIFT // 2026
        </span>
        <span className="mt-2 h-10 w-px bg-red/50" />
      </div>

      <div className="pointer-events-none absolute right-4 top-[88px] hidden select-none flex-col items-end gap-1 md:flex">
        <span className="font-display text-[10px] font-bold tracking-[0.2em] text-foreground">
          RUNWAY 07L — CLEAR
        </span>
        <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
          ALT 0.4 // SPD 0
        </span>
        <span className="font-mono text-[9px] tracking-[0.18em] text-red">● LIVE TELEMETRY</span>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-[68px] hidden -translate-x-1/2 select-none md:block">
        <span className="font-body text-[10px] tracking-[0.45em] text-muted-foreground">
          サイフ・アマン — FULL-STACK
        </span>
      </div>

      <div
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 pb-10 pt-20"
        style={{
          opacity: fade,
          filter: `blur(${blur.toFixed(2)}px)`,
          transform: `translateY(${y.toFixed(1)}px)`,
          willChange: 'opacity, filter, transform',
        }}
      >
        <div className="flex flex-col items-center">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-red sm:w-12" />
            <span className="font-mono text-[11px] tracking-[0.32em] text-red">白 × 黒 × 赤</span>
            <span className="h-px w-8 bg-red sm:w-12" />
          </div>

          <h1 className="font-display text-center text-[clamp(3.2rem,12vw,8.2rem)] font-black leading-[0.85] tracking-tighter text-foreground">
            <span className="block">SAIF</span>
            <span className="block bg-gradient-to-r from-foreground via-foreground to-red bg-clip-text text-transparent">
              AYMAN
            </span>
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="h-[1px] w-6 bg-red/60" />
            <p className="font-body text-center text-[11px] font-bold tracking-[0.24em] text-foreground sm:text-[12px]">
              FULL-STACK SOFTWARE ENGINEER
            </p>
            <span className="h-[1px] w-6 bg-red/60" />
          </div>

          <div className="relative mt-6 max-w-[560px]">
            <div className="pointer-events-none absolute -left-2 -top-2 h-3 w-3 border-l-[1.5px] border-t-[1.5px] border-red/70" />
            <div className="pointer-events-none absolute -right-2 -bottom-2 h-3 w-3 border-b-[1.5px] border-r-[1.5px] border-red/70" />
            <p className="bg-white/85 px-5 py-3 text-center font-body text-[14px] leading-relaxed text-muted-foreground backdrop-blur-[2px] sm:text-[15px]">
              Two years shipping the whole stack.{' '}
              <span className="font-semibold text-foreground">ERPs</span>,{' '}
              <span className="font-semibold text-foreground">delivery platforms</span>,{' '}
              <span className="font-semibold text-foreground">AI tools</span> & live-streaming
              infra.
              <br className="hidden sm:block" /> Django under the hood, React where it counts,
              real-time by default.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 font-mono text-[11px] tracking-wide text-muted-foreground shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Alexandria · Available
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-red px-3.5 py-1.5 font-display text-[11px] font-bold tracking-[0.14em] text-white shadow-sm">
              SCROLL TO TAKE OFF ↓
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="font-mono text-[9px] tracking-[0.22em] text-muted-foreground">SCROLL</span>
        <span className="h-8 w-px bg-gradient-to-b from-red to-transparent" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% 38%, transparent 55%, rgba(255,255,255,0.92) 85%)',
        }}
      />
    </section>
  )
}
