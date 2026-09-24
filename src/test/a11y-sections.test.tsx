import { render } from '@testing-library/react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { describe, expect, it } from 'vitest'

import { About, Contact, Experience, Footer, Hero, Projects, Tools } from '@/components/sections'
import { runAxe, summarizeViolations } from '@/test/axe'

gsap.registerPlugin(ScrollTrigger, SplitText, Observer)

function scan(ui: React.ReactNode) {
  const { container } = render(ui)
  return runAxe(container).then((results) => {
    expect(results.violations, summarizeViolations(results)).toEqual([])
  })
}

describe('section a11y scans', () => {
  it('Hero has no aXe violations', async () => {
    await scan(<Hero />)
  })

  it('About has no aXe violations', async () => {
    await scan(<About />)
  })

  it('Experience has no aXe violations', async () => {
    await scan(<Experience />)
  })

  it('Projects has no aXe violations', async () => {
    await scan(<Projects />)
  })

  it('Tools has no aXe violations', async () => {
    await scan(<Tools />)
  })

  it('Contact has no aXe violations', async () => {
    await scan(<Contact />)
  })

  it('Footer has no aXe violations', async () => {
    await scan(<Footer />)
  })
})
