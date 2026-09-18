import { About, Contact, Experience, Footer, Hero, Projects, Tools } from '@/components/sections'
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
      <Contact />
      <Footer />
    </div>
  )
}
