import { CyberPanel, ScrambleTitle } from '@/components/cyber'
import { EXPERIENCES } from '@/config/experiences'
import { useSectionProgress } from '@/systems/scroll/useSectionProgress'

function ExperienceItem({
  exp,
  index,
  sectionT,
}: {
  exp: (typeof EXPERIENCES)[number]
  index: number
  sectionT: number
}) {
  const n = EXPERIENCES.length
  const itemStart = index / n
  const itemEnd = (index + 1) / n
  const t = Math.min(Math.max((sectionT - itemStart) / (itemEnd - itemStart), 0), 1)

  const approach = Math.min(t / 0.38, 1)
  const hold = t > 0.38 && t < 0.72 ? 1 : 0
  const exit = Math.min(Math.max((t - 0.72) / 0.28, 0), 1)

  const scale = (1 - approach) * 0.72 + approach * 1 + exit * -0.3
  const blur = (1 - approach) * 8 + exit * 8
  const y = (1 - approach) * 48 + exit * -42
  const opacity = approach * (1 - exit)
  const rotate = (1 - approach) * 1.2

  const isTextFirst = exp.layout === 'text-image'

  return (
    <div
      className="w-full max-w-6xl"
      style={{
        opacity,
        filter: `blur(${blur.toFixed(1)}px)`,
        transform: `translateY(${y.toFixed(1)}px) scale(${scale.toFixed(3)}) rotate(${rotate.toFixed(2)}deg)`,
        willChange: 'transform, opacity, filter',
      }}
    >
      <div
        className={`grid items-center gap-6 md:grid-cols-2 ${isTextFirst ? '' : 'md:[&>*:first-child]:order-2'}`}
      >
        <div className="space-y-3">
          <p className="font-mono text-[11px] tracking-[0.22em] text-red">{exp.period}</p>
          <h3 className="font-display text-[clamp(1.4rem,3vw,1.9rem)] font-bold leading-tight tracking-tighter text-white">
            {exp.company}
            <span className="block font-body text-[13px] font-medium tracking-[0.16em] text-white/60">
              {exp.role}
            </span>
          </h3>
          <p className="font-body text-[14px] leading-relaxed text-white/70">{exp.description}</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {exp.stats.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[11px] tracking-wide text-white/80"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <CyberPanel
          chamfer={22}
          className="overflow-hidden bg-white p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
        >
          <div className="aspect-[16/10] w-full bg-gradient-to-br from-zinc-100 via-white to-zinc-100 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="h-1.5 w-1.5 rounded-full bg-red" />
              <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                0{index + 1} — {exp.company.toUpperCase()}
              </span>
            </div>
            <div className="space-y-1">
              <p className="font-display text-sm font-bold tracking-tight text-foreground">
                {exp.role}
              </p>
              <p className="font-body text-xs text-muted-foreground">
                {exp.period} · {hold ? 'reading' : approach < 1 ? 'approaching' : 'passing'}
              </p>
            </div>
          </div>
        </CyberPanel>
      </div>
    </div>
  )
}

export function Experience() {
  const t = useSectionProgress('experience')
  const titlePhase = Math.min(t / 0.22, 1)
  const titleY = titlePhase < 1 ? (1 - titlePhase) * 28 : Math.min((t - 0.22) / 0.18, 1) * -22
  const titleScale = titlePhase < 1 ? 1 : 1 - Math.min((t - 0.22) / 0.18, 1) * 0.08
  const titleOpacity = t < 0.88 ? 1 : 1 - (t - 0.88) / 0.12
  const jetCover = t > 0.18 && t < 0.32
  const contentT = Math.min(Math.max((t - 0.28) / 0.58, 0), 1)

  return (
    <section
      id="experience"
      className="relative flex min-h-[180vh] flex-col items-center bg-transparent px-6 py-16 text-white"
      aria-label="Experience"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div
        className="sticky top-[22vh] z-10 flex w-full max-w-6xl flex-col items-center"
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY.toFixed(1)}px) scale(${titleScale.toFixed(3)})`,
          willChange: 'transform, opacity',
        }}
      >
        <div
          className={jetCover ? 'blur-[6px]' : ''}
          style={{ filter: jetCover ? 'blur(4px)' : undefined }}
        >
          <ScrambleTitle
            title="EXPERIENCE"
            from="bottom"
            className="font-display text-center text-[clamp(2.8rem,10vw,6.2rem)] font-black tracking-tighter text-white"
          />
        </div>
        <p className="font-body mt-2 text-center text-xs tracking-[0.2em] text-white/50">
          2 years · where I&apos;ve shipped
        </p>
        {jetCover && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[10px] tracking-[0.3em] text-red/70">
              JET COVERING — CINEMATIC
            </span>
          </div>
        )}
      </div>

      <div className="relative z-10 mt-[28vh] flex w-full max-w-6xl flex-col items-center gap-[42vh] pb-[18vh]">
        {EXPERIENCES.map((exp, i) => (
          <ExperienceItem key={exp.id} exp={exp} index={i} sectionT={contentT} />
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-b from-red/50 to-transparent" />
    </section>
  )
}
