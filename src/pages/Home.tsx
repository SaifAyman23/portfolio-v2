import { About, Contact, Experience, Hero, Projects, Tools } from '@/components/sections'
import { TopBar } from '@/components/TopBar'
import { useSectionTracker } from '@/hooks/useSectionTracker'

export default function Home() {
  const { active, direction } = useSectionTracker()

  return (
    <div className="bg-background">
      <TopBar active={active} direction={direction} />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Tools />
      <section
        id="hobbies"
        data-section="hobbies"
        className="flex min-h-screen flex-col items-center justify-center gap-3 border-b border-border px-6"
      >
        <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">HOBBIES</p>
      </section>
      <Contact />
    </div>
  )
}
