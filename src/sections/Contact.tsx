import { ScrambleTitle } from '@/components/cyber'
import { useSectionProgress } from '@/systems/scroll/useSectionProgress'

export function Contact() {
  const t = useSectionProgress('contact')
  const enter = Math.min(t / 0.28, 1)

  return (
    <section
      id="contact"
      className="relative flex min-h-[88vh] flex-col items-center justify-center bg-transparent px-6 py-16"
      aria-label="Contact"
    >
      <div
        className="flex w-full max-w-6xl flex-col items-center"
        style={{
          opacity: enter,
          transform: `translateY(${(1 - enter) * 18}px)`,
          filter: `blur(${(1 - enter) * 6}px)`,
        }}
      >
        <ScrambleTitle
          title="CONTACT"
          from="bottom"
          className="font-display text-[clamp(2.6rem,9vw,5.2rem)] font-black tracking-tighter"
        />
        <p className="font-body mt-3 max-w-2xl text-center text-[15px] leading-relaxed text-muted-foreground">
          Full-stack engineer from Alexandria — ERPs, delivery platforms, AI tools, live streams. I
          care about the details users never notice and the performance they always feel.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <a
            href="mailto:saifayman3021@gmail.com"
            className="rounded-full border border-border bg-white px-4 py-2 font-mono text-xs tracking-wide text-foreground shadow-sm hover:bg-zinc-50"
          >
            saifayman3021@gmail.com
          </a>
          <a
            href="https://github.com/SaifAyman23"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-foreground px-4 py-2 font-mono text-xs tracking-wide text-white"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border bg-white px-4 py-2 font-mono text-xs tracking-wide text-foreground"
          >
            LinkedIn
          </a>
          <a
            href="https://drive.google.com/file/d/1OpzN5YNosHrEHZgwcRois3GUPISZ9ktk/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-red px-4 py-2 font-mono text-xs font-bold tracking-wide text-white"
          >
            Resume
          </a>
        </div>

        <div className="mt-10 flex items-center gap-3">
          <span className="h-px w-12 bg-red/50" />
          <span className="font-mono text-[10px] tracking-[0.28em] text-muted-foreground">
            JET LANDED • RUNWAY CLEAR
          </span>
          <span className="h-px w-12 bg-red/50" />
        </div>

        <p className="mt-8 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
          © {new Date().getFullYear()} Saif Eldin Ayman · Ship it & forget it ®
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red/30 to-transparent" />
    </section>
  )
}
