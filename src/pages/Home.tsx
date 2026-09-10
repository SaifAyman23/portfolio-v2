import { About } from '@/sections/About'
import { Contact } from '@/sections/Contact'
import { Experience } from '@/sections/Experience'
import { Hero } from '@/sections/Hero'
import { Hobbies } from '@/sections/Hobbies'
import { Projects } from '@/sections/Projects'
import { Tools } from '@/sections/Tools'

export default function Home() {
  return (
    <div className="bg-transparent text-foreground">
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Tools />
      <Hobbies />
      <Contact />
    </div>
  )
}
