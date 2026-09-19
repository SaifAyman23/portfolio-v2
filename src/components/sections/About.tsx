import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AboutRow } from './AboutRow'

gsap.registerPlugin(ScrollTrigger)

export function About() {
  useGSAP(() => {
    const section = document.querySelector('#about')

    if (!section) return

    const title = section.querySelector('.about-title')
    const rows = section.querySelectorAll('.about-rows > *')

    if (!title || rows.length < 2) return

    gsap.set(title, {
      opacity: 0,
      x: 100,
    })

    gsap.set(rows, {
      opacity: 0,
      y: 60,
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=2000',
        scrub: true,
        pin: true,
        anticipatePin: 1,
      },
    })

    // 1. ABOUT TITLE

    tl.to(title, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'none',
    })

    // 2. FIRST ROW

    tl.to(
      rows[0],
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'none',
      },
      '<0.3'
    )

    // 3. SECOND ROW

    tl.to(
      rows[1],
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'none',
      },
      '<0.3'
    )
  }, [])

  return (
    <section
      id="about"
      data-section="about"
      className="grid min-h-screen grid-cols-6 flex-col items-center justify-center gap-3 bg-black px-6"
    >
      <div className="col-span-2 flex">
        <h1
          className="rotate-90 break-keep text-[330px] font-bold text-transparent font-inter"
          style={{ WebkitTextStroke: `3px var(--accent)` }}
        >
          進化
        </h1>
      </div>

      <div className="z-10 col-span-4 mb-20 flex flex-col gap-10">
        <h1 className="about-title text-start text-white xl:text-9xl">
          About
        </h1>

        <div className="about-rows flex flex-col gap-10">
          <AboutRow />
          <AboutRow flip />
        </div>
      </div>
    </section>
  )
}