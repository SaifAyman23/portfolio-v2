import { Overlay } from '@/components/Overlay'
import { ScrollBar } from '@/components/ScrollBar'
import { About, Contact, Experience, Footer, Hero, Projects, Tools } from '@/components/sections'
import { TopBar } from '@/components/TopBar'

interface HomeProps {
  active: 'hero' | 'about' | 'experience' | 'projects' | 'tools' | 'contact' | 'footer'
  direction: 1 | -1
}

export default function Home(props: HomeProps) {
  return (
    <div className="bg-background flex flex-col">
      <Overlay>
        <TopBar active={props.active} direction={props.direction} />
        <ScrollBar appearDelayMs={4800} hidden={props.active === 'footer'} />
      </Overlay>
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
