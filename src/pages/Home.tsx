import { CyberPanel, ScrambleTitle } from '@/components/cyber'
import { SECTIONS } from '@/config/sections'

export default function Home() {
  return (
    <div className="bg-transparent text-foreground">
      <section
        id="hero"
        className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 py-24"
      >
        <ScrambleTitle
          title="SAIF AYMAN"
          as="h1"
          className="font-display text-center text-[clamp(2.8rem,9vw,6rem)] font-bold tracking-tighter"
        />
        <p className="font-body mt-3 text-center text-sm tracking-[0.2em] text-muted-foreground sm:text-base">
          FULL-STACK SOFTWARE ENGINEER
        </p>
        <p className="font-body mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
          White runway · White jet · Red accents · Scroll takes off
        </p>
        <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          <CyberPanel className="p-5">
            <p className="font-display text-xs tracking-widest text-red">JET</p>
            <p className="font-body mt-1 text-sm">Body white · akcent red · glow #FF1A14</p>
          </CyberPanel>
          <CyberPanel className="p-5">
            <p className="font-display text-xs tracking-widest text-red">SCROLL</p>
            <p className="font-body mt-1 text-sm">Lenis + ScrollTrigger scrub 1.1</p>
          </CyberPanel>
          <CyberPanel className="p-5" variant="outline">
            <p className="font-display text-xs tracking-widest text-red">TITLE</p>
            <p className="font-body mt-1 text-sm">Scrambled → Red blur → Sharp</p>
          </CyberPanel>
        </div>
        <p className="font-body mt-12 text-xs tracking-[0.18em] text-muted-foreground">SCROLL TO TAKE OFF ↓</p>
      </section>

      {SECTIONS.slice(1).map((s) => (
        <section
          key={s.id}
          id={s.id}
          className="flex min-h-[70vh] flex-col items-center justify-center border-t border-border/60 bg-white/70 px-6 py-20 backdrop-blur-[1px]"
        >
          <ScrambleTitle
            title={s.title}
            className="font-display text-center text-[clamp(2rem,8vw,4.5rem)] font-bold tracking-tighter"
          />
          <p className="font-body mt-2 text-xs tracking-[0.2em] text-muted-foreground">{s.label}</p>
        </section>
      ))}
    </div>
  )
}
