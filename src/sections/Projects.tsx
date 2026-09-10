import { useMemo } from 'react'

import { CyberPanel, ScrambleTitle } from '@/components/cyber'
import { PROJECTS } from '@/config/projects'
import { useSectionProgress } from '@/systems/scroll/useSectionProgress'

export function Projects() {
  const t = useSectionProgress('projects')
  const titleT = Math.min(t / 0.24, 1)
  const titleExit = Math.min(Math.max((t - 0.24) / 0.16, 0), 1)

  const n = PROJECTS.length
  const activeIndex = Math.min(Math.floor((Math.max(t - 0.38, 0) / 0.62) * n), n - 1)
  const progressInProject = (Math.max(t - 0.38, 0) / 0.62) * n - activeIndex

  const blurFor = (i: number) => {
    if (i === activeIndex) return Math.abs(progressInProject - 0.5) * 4
    return 8
  }

  const opacityFor = (i: number) =>
    i === activeIndex ? 1 - Math.abs(progressInProject - 0.5) * 0.3 : 0

  const tilt = useMemo(() => -1.1, [])

  return (
    <section
      id="projects"
      className="relative flex min-h-[140vh] flex-col items-center bg-transparent px-6 py-16"
      aria-label="Projects"
      style={{ transform: `rotate(${tilt}deg)`, transformOrigin: '50% 50%' }}
    >
      <div className="w-full max-w-6xl" style={{ transform: `rotate(${-tilt}deg)` }}>
        <div
          className="flex flex-col items-center"
          style={{
            opacity: 1 - titleExit,
            filter: `blur(${(titleExit * 8).toFixed(1)}px)`,
            transform: `translateY(${(titleExit * -18).toFixed(1)}px) scale(${(1 - titleExit * 0.04).toFixed(3)})`,
          }}
        >
          <ScrambleTitle
            title="PROJECTS"
            from="bottom"
            className="font-display text-center text-[clamp(2.8rem,10vw,6rem)] font-black tracking-tighter"
          />
          <p className="font-body mt-2 text-center text-xs tracking-[0.2em] text-muted-foreground">
            {titleT < 1 ? 'entering' : 'A few things I’ve built'}
          </p>
        </div>

        <div className="relative mt-[18vh] min-h-[42vh]">
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              className="absolute inset-0"
              style={{
                opacity: opacityFor(i),
                filter: `blur(${blurFor(i).toFixed(1)}px)`,
                pointerEvents: i === activeIndex ? 'auto' : 'none',
              }}
            >
              <CyberPanel
                chamfer={18}
                className="mx-auto max-w-[760px] bg-white p-6 shadow-[0_12px_50px_rgba(0,0,0,0.08)] md:p-8"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start">
                  <div className="flex-1">
                    <p className="font-mono text-[11px] tracking-[0.18em] text-red">{p.eyebrow}</p>
                    <h3 className="font-display mt-1 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight">
                      {p.title}
                    </h3>
                    <p className="font-body mt-3 text-[14px] leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border bg-white px-2.5 py-1 font-mono text-[11px] tracking-wide text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="w-full md:w-[280px] md:shrink-0">
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-sm bg-gradient-to-br from-zinc-100 to-zinc-50 p-4 flex flex-col justify-between border border-border">
                      <span className="h-1.5 w-1.5 rounded-full bg-red" />
                      <div>
                        <p className="font-display text-xs font-bold tracking-tight">{p.title}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          image · {p.eyebrow}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CyberPanel>
              <p className="mt-3 text-center font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
                {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')} —{' '}
                {i === activeIndex ? 'focus' : 'blur'}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-[48vh] flex justify-center gap-1">
          {PROJECTS.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${i === activeIndex ? 'w-6 bg-red' : 'w-1.5 bg-border'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
