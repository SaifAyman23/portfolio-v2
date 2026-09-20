import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { HeroInfo } from './HeroInfo'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

import PixelBlast from '@/components/PixelBlast'
import { JapaneseText } from '@/components/ui/japanese-text'
import { CyberFrame } from '../ui/cyber-frame'

gsap.registerPlugin(ScrollTrigger, SplitText)

const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Hero() {
  useGSAP(() => {
    if (reduceMotion) return

    const hero = document.querySelector('#hero')
    const intro = document.querySelector('#hero-intro')
    const title = document.querySelector('#hero-title')
    const subtitle = document.querySelectorAll('.hero-subtitle')
    const japanese = document.querySelector('#hero-japanese')
    const info = document.querySelector('[data-slot="hero-info"]')
    const loaderItems = document.querySelectorAll('#hero-loader > *')
    const paragraphs = document.querySelectorAll('[data-slot="hero-blurb"]')
    const overlay = document.querySelector('#hero-overlay')

    if (
      !hero ||
      !intro ||
      !title ||
      !japanese ||
      !info ||
      !overlay ||
      loaderItems.length === 0 ||
      paragraphs.length < 2
    ) {
      return
    }

    const introSplit = new SplitText(intro, {
      type: 'chars',
    })

    const titleSplit = new SplitText(title, {
      type: 'chars',
    })

    const subtitleSplit = new SplitText(subtitle, {
      type: 'chars',
    })

    const japaneseSplit = new SplitText(japanese, {
      type: 'chars',
    })

    const paragraphSplits = Array.from(paragraphs).map(
      (paragraph) =>
        new SplitText(paragraph, {
          type: 'chars',
        })
    )

    const infoItems = Array.from(info.children)

    gsap.set(titleSplit.chars, {
      opacity: 0,
      // y: 20,
      filter: 'blur(12px)',
    })

    gsap.set(subtitleSplit.chars, {
      opacity: 0,
      filter: 'blur(8px)',
    })

    gsap.set(japaneseSplit.chars, {
      opacity: 0,
      filter: 'blur(10px)',
    })

    paragraphSplits.forEach((split) => {
      gsap.set(split.chars, {
        opacity: 0,
        filter: 'blur(8px)',
      })
    })

    gsap.set(infoItems, {
      opacity: 0,
      y: 20,
      filter: 'blur(8px)',
    })

    gsap.set(introSplit.chars, {
      opacity: 0,
      // y: 20,
      // filter: 'blur(20px)',
    })

    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } })
      .__lenis

    document.documentElement.style.overflow = 'hidden'
    lenis?.stop()
    ScrollTrigger.getAll().forEach((trigger) => trigger.disable(false))

    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = ''
        lenis?.start()
        ScrollTrigger.getAll().forEach((trigger) => trigger.enable(false))
        ScrollTrigger.refresh()
      },
    })

    // 1. LARGE CENTER TITLE

    tl.to(introSplit.chars, {
      opacity: 1,
      y: 0,
      // filter: 'blur(8px)',
      stagger: 0.06,
      duration: 0.5,
      ease: 'steps(1)',
    })

    // 1.5. CYBER LOADER

    tl.from(
      loaderItems,
      {
        opacity: 0,
        stagger: 0.06,
        duration: 0.2,
        ease: 'steps(1)',
      },
      '<0.1'
    )

    // 2. LARGE TITLE BECOMES SHARP

    tl.to(
      introSplit.chars,
      {
        filter: 'blur(0px)',
        stagger: 0.06,
        duration: 0.5,
        ease: 'none',
      },
      '<0.1'
    )

    // 3. LARGE TITLE LEAVES

    tl.to(
      intro,
      {
        opacity: 0,
        filter: 'blur(15px)',
        scale: 1.05,
        duration: 0.35,
        ease: 'none',
      },
      '+=0.15'
    )

    // 4. WHITE SCREEN DISAPPEARS

    tl.to(
      overlay,
      {
        opacity: 0,
        duration: 0.4,
        ease: 'none',
      },
      '<0.1'
    )

    // 5. REAL HERO TITLE

    tl.to(
      titleSplit.chars,
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.04,
        duration: 0.5,
        ease: 'none',
      },
      '>-0.05'
    )

    // 6. SUBTITLE

    tl.to(subtitleSplit.chars, {
      opacity: 1,
      filter: 'blur(0px)',
      stagger: 0.03,
      duration: 0.4,
      ease: 'none',
    })

    // 7. HERO INFO BUTTONS

    tl.to(
      infoItems,
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.06,
        duration: 1,
        ease: 'none',
      },
      '<0.15'
    )

    // 8. FIRST PARAGRAPH

    tl.to(
      paragraphSplits[0].chars,
      {
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.012,
        duration: 0.4,
        ease: 'none',
      },
      '<0.1'
    )

    // 9. SECOND PARAGRAPH

    tl.to(
      paragraphSplits[1].chars,
      {
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.012,
        duration: 0.4,
        ease: 'none',
      },
      '<0.2'
    )

    // 10. JAPANESE CENTER TEXT

    tl.to(
      japaneseSplit.chars,
      {
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.5,
        duration: 0.4,
        ease: 'none',
      },
      '<0.1'
    )

    return () => {
      document.documentElement.style.overflow = ''
      lenis?.start()
      ScrollTrigger.getAll().forEach((trigger) => trigger.enable(false))
      ScrollTrigger.refresh()
      introSplit.revert()
      titleSplit.revert()
      subtitleSplit.revert()
      japaneseSplit.revert()

      paragraphSplits.forEach((split) => {
        split.revert()
      })
    }
  }, [])

  return (
    <section
      id="hero"
      data-section="hero"
      className="relative flex min-h-screen flex-col items-center justify-center gap-3 overflow-hidden px-6"
    >
      {/* White screen */}
      <div id="hero-overlay" className="pointer-events-none absolute inset-0 z-50 bg-white" />

      {/* Large intro title ABOVE the white screen */}
      <div
        id="hero-intro"
        className="pointer-events-none absolute inset-0 z-[60] gap-10 flex flex-col items-center justify-center"
      >
        <span className="text-[5vw] font-cyberform font-bold leading-none text-black">
          Brace Yourself
        </span>
        <div id="hero-loader" className="mx-auto flex gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <CyberFrame key={i} className="h-10 w-20" fill="var(--accent)" strokeWidth={0} />
          ))}
        </div>
      </div>

      <HeroInfo dataSlot={"hero-info"} className={`flex xl:absolute text-foreground -start-50 xl:rotate-90 gap-2 z-10`} />

      {!reduceMotion && (
        <div className="absolute z-0 h-full w-full opacity-30">
          <PixelBlast
            variant="circle"
            pixelSize={4}
            color="#b50000"
            patternScale={4}
            patternDensity={1}
            pixelSizeJitter={2}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid={false}
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={2}
            edgeFade={0.25}
            transparent
          />
        </div>
      )}

      <div className="z-10 mb-20 flex flex-col">
        <JapaneseText
          id={''}
          text="サイフ"
          className="ms-15 hero-subtitle -mb-5 text-5xl font-bold text-accent"
        />

        <h1 id="hero-title" className="text-center xl:text-9xl">
          Saif Eldin
        </h1>

        <div className="relative text-end font-ticking">
          <h2
            // id="hero-subtitle"
            className="absolute hero-subtitle -end-20 text-accent xl:text-3xl"
          >
            Full-Stack Engineer
          </h2>
        </div>
      </div>

      <div className="grid h-[50vh] grid-cols-8 gap-3 xl:px-60">
        <div className="col-span-2 text-start">
          <p data-slot="hero-blurb">Building scalable web applications with modern technologies.</p>
        </div>

        <div className="col-span-4 text-center">
          <div id="hero-japanese">
            <JapaneseText
              text="ケン"
              border
              color="black"
              className="text-[250px] font-bold text-foreground [writing-mode:vertical-rl]"
            />
          </div>
        </div>

        <div className="col-span-2 flex h-full flex-col justify-end text-start">
          <p data-slot="hero-blurb">Focused on clean architecture and smooth user experiences.</p>
        </div>
      </div>
    </section>
  )
}
