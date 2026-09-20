import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

import bg1 from '@/assets/img/city.webp'
import { CyberImage } from '@/components/ui/cyber-image'
import { prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger, SplitText)

export function About() {
  useGSAP(() => {
    if (prefersReducedMotion()) return

    const section = document.querySelector('#about')

    if (!section) return

    const splitTitle = SplitText.create('.about-title', {
      type: 'lines, words, chars',
      linesClass: 'split-line',
      wordsClass: 'split-word',
      charsClass: 'split-char',
    })

    const splitRows1 = SplitText.create('.row-text-1', {
      type: 'lines, words, chars',
      linesClass: 'split-line',
      wordsClass: 'split-word',
      charsClass: 'split-char',
    })

    const splitRows2 = SplitText.create('.row-text-2', {
      type: 'lines, words, chars',
      linesClass: 'split-line',
      wordsClass: 'split-word',
      charsClass: 'split-char',
    })

    gsap.set('.row-img-1', {
      opacity: 0,
      filter: 'blur(10px)',
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=2000',
        scrub: true,
        pin: true,
        pinReparent: true,
        anticipatePin: 1,
      },
    })

    // 1. ABOUT TITLE

    tl.from(splitTitle.chars, {
      opacity: 0,
      filter: 'blur(10px)',
      duration: 2,
      stagger: 2,
      ease: 'none',
    })

    // 1.5. JAPANESE TEXT

    tl.from('#about-japanese-text', {
      opacity: 0,
      filter: 'blur(10px)',
      y: 100,
      duration: 2,
    })

    // 2. FIRST ROW

    tl.from(
      splitRows1.chars,
      {
        opacity: 0,
        filter: 'blur(10px)',
        duration: 2,
        stagger: 0.02,
        ease: 'none',
      },
      '<0.3'
    )

    tl.to(
      '.row-img-1',
      {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'none',
      },
      '<0.3'
    )

    // 3. SECOND ROW

    tl.from(
      splitRows2.chars,
      {
        opacity: 0,
        filter: 'blur(10px)',
        duration: 2,
        stagger: 0.02,
        ease: 'none',
      },
      '<0.3'
    )

    tl.to(
      '.row-img-1',
      {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'none',
      },
      '<0.3'
    )

    return () => {
      splitTitle.revert()
      splitRows1.revert()
      splitRows2.revert()
    }
  }, [])

  return (
    <section
      id="about"
      data-section="about"
      className="grid min-h-screen grid-cols-6 flex-col items-center justify-center gap-3 bg-black px-6"
    >
      <div className="col-span-2 flex">
        <h1
          id="about-japanese-text"
          className="rotate-90 break-keep text-[330px] font-bold text-transparent font-inter"
          style={{ WebkitTextStroke: `3px var(--accent)` }}
        >
          進化
        </h1>
      </div>

      <div className="z-10 col-span-4 mb-20 flex flex-col gap-10">
        <h1 className="about-title text-start text-white xl:text-9xl">About</h1>

        <div className="about-rows flex flex-col gap-10">
          <div className="flex w-full items-center gap-20">
            <p className="max-w-2xl row-text-1 text-white xl:text-2xl">
              Two years of building the whole stack. ERPs, delivery platforms, AI tools,
              live-streaming infra. Django under the hood, React where it counts, real-time by
              default.
            </p>
            <div className="w-50 row-img-1">
              <CyberImage
                src={bg1}
                alt={'Background First'}
                strokeWidth={0}
                stroke="transparent"
                frameClassName="w-50 h-40"
              />
            </div>
          </div>
          <div className="flex w-full items-center gap-20">
            <div className="w-50 row-img-1">
              <CyberImage
                src={bg1}
                alt={'Background First'}
                strokeWidth={0}
                stroke="transparent"
                frameClassName="w-50 h-40"
              />
            </div>
            <p className="max-w-2xl row-text-2 text-white xl:text-2xl">
              Two years of building the whole stack. ERPs, delivery platforms, AI tools,
              live-streaming infra. Django under the hood, React where it counts, real-time by
              default.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
