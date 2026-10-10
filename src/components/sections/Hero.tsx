import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useState } from 'react'

import { HeroInfo } from './HeroInfo'
import { CyberFrame } from '../ui/cyber-frame'

import PixelBlast from '@/components/PixelBlast'
import { JapaneseText } from '@/components/ui/japanese-text'
import { getLenis } from '@/lib/smoothScroll'
import { isWebGLAvailable } from '@/lib/webgl'

gsap.registerPlugin(ScrollTrigger, SplitText)

export function Hero() {
  const [glOK] = useState(isWebGLAvailable)

  useGSAP(() => {
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

    const introSplit = SplitText.create(intro, {
      type: 'chars',
      aria: 'none',
    })

    const titleSplit = SplitText.create(title, {
      type: 'chars',
      aria: 'none',
    })

    const subtitleSplit = SplitText.create(subtitle, {
      type: 'chars',
      aria: 'none',
    })

    const japaneseSplit = SplitText.create(japanese, {
      type: 'chars',
      aria: 'none',
    })

    const paragraphSplits = Array.from(paragraphs).map((p) =>
      SplitText.create(p, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'hero-line',
        aria: 'none',
      })
    )

    const infoItems = Array.from(info.children)

    // Once the intro is over the text goes back to normal, unsplit markup. The line splits are
    // fixed at the width the page had at load, so keeping them would leave stale line breaks
    // after a resize or a phone rotation.
    let splitsReverted = false
    const revertSplits = () => {
      if (splitsReverted) return
      splitsReverted = true
      introSplit.revert()
      titleSplit.revert()
      subtitleSplit.revert()
      japaneseSplit.revert()
      paragraphSplits.forEach((s) => s.revert())
    }

    gsap.set(titleSplit.chars, {
      opacity: 0,
      // y: 20,
    })

    gsap.set(subtitleSplit.chars, {
      opacity: 0,
      y: 12,
    })

    gsap.set(japaneseSplit.chars, {
      opacity: 0,
      y: 12,
    })

    paragraphSplits.forEach((split) => {
      gsap.set(split.lines, {
        yPercent: 100,
        opacity: 0,
      })
    })

    gsap.set(infoItems, {
      opacity: 0,
      y: 20,
    })

    gsap.set(introSplit.chars, {
      opacity: 0,
      y: 20,
    })

    const lenis = getLenis()

    document.documentElement.style.overflow = 'hidden'
    lenis?.stop()
    ScrollTrigger.getAll().forEach((trigger) => trigger.disable(false))

    const restoreScroll = () => {
      document.documentElement.style.overflow = ''
      lenis?.start()
      ScrollTrigger.getAll().forEach((trigger) => trigger.enable(false))
      ScrollTrigger.refresh()
    }

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        restoreScroll()
        revertSplits()
      },
    })

    let alive = true
    let started = false

    const start = () => {
      if (started || !alive) return
      started = true
      window.dispatchEvent(new Event('hero-intro-start'))
      tl.play()
    }

    const skip = () => {
      started = true
      restoreScroll()
      tl.progress(1)
      revertSplits()
    }

    window.addEventListener('scroll', skip, { passive: true, once: true })

    const ready = Promise.race([
      (async () => {
        try {
          await document.fonts?.ready
        } catch {
          return
        }
      })(),
      new Promise<void>((resolve) => window.setTimeout(resolve, 1200)),
    ])
    ready.then(() => start())

    // 1. LARGE CENTER TITLE

    tl.to(introSplit.chars, {
      opacity: 1,
      y: 0,
      stagger: 0.04,
      duration: 0.35,
      ease: 'power3.out',
    })

    // 1.5. CYBER LOADER

    tl.from(
      loaderItems,
      {
        opacity: 0,
        scaleY: 0,
        transformOrigin: '50% 100%',
        stagger: 0.06,
        duration: 0.3,
        ease: 'power2.out',
      },
      '<0.1'
    )

    // 3. LARGE TITLE LEAVES

    tl.to(
      intro,
      {
        opacity: 0,
        duration: 0.25,
        ease: 'none',
      },
      '+=0.1'
    )

    // 4. WHITE SCREEN DISAPPEARS

    tl.to(
      overlay,
      {
        opacity: 0,
        duration: 0.3,
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
        stagger: 0.025,
        duration: 0.35,
        ease: 'steps(1)',
      },
      '>-0.05'
    )

    // 6. SUBTITLE

    tl.to(subtitleSplit.chars, {
      opacity: 1,
      y: 0,
      stagger: 0.02,
      duration: 0.3,
    })

    // 7. HERO INFO BUTTONS

    tl.to(
      infoItems,
      {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        duration: 0.4,
        ease: 'none',
      },
      '<0.15'
    )

    // 8. FIRST PARAGRAPH — lines masked, from below

    tl.to(
      paragraphSplits[0].lines,
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power3.out',
      },
      '<0.1'
    )

    // 9. SECOND PARAGRAPH — lines masked, from below

    tl.to(
      paragraphSplits[1].lines,
      {
        yPercent: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power3.out',
      },
      '<0.2'
    )

    // 10. JAPANESE CENTER TEXT

    tl.to(
      japaneseSplit.chars,
      {
        opacity: 1,
        y: 0,
        // stagger: 0.5,
        duration: 0.4,
        ease: 'none',
      },
      '<0.1'
    )

    return () => {
      alive = false
      window.removeEventListener('scroll', skip)
      document.documentElement.style.overflow = ''
      lenis?.start()
      ScrollTrigger.getAll().forEach((trigger) => trigger.enable(false))
      ScrollTrigger.refresh()
      revertSplits()
    }
  }, [])

  return (
    // svh = the visible height on mobile (ignores the collapsing browser bar)
    <section
      id="hero"
      data-section="hero"
      className="relative flex min-h-[100svh] flex-col items-center gap-3 overflow-hidden px-6 max-sm:pt-15 sm:justify-center sm:px-10 xl:px-6"
    >
      {/* White screen */}
      <div id="hero-overlay" className="pointer-events-none absolute inset-0 z-70 bg-white" />

      {/* Large intro title ABOVE the white screen */}
      <div
        id="hero-intro"
        className="pointer-events-none absolute inset-0 z-80 gap-10 flex flex-col items-center justify-center"
      >
        <span className="text-[clamp(1.5rem,8vw,1.875rem)] sm:text-[5vw] font-cyberform font-bold leading-none text-black">
          Engines Online
        </span>
        <div id="hero-loader" className="mx-auto flex xl:gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <CyberFrame
              key={i}
              className="w-[6vw] sm:h-[4vh] sm:w-[4vw]"
              fill="var(--accent)"
              strokeWidth={0}
            />
          ))}
        </div>
      </div>

      {/* Below xl the info sits in the page flow at the top and may wrap; from xl it is the rotated side bar */}
      <HeroInfo
        dataSlot={'hero-info'}
        className={`flex flex-wrap justify-center xl:flex-nowrap xl:justify-start xl:absolute text-foreground -start-50 xl:rotate-90 xl:gap-2 z-60`}
      />

      {glOK && (
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

      {/* Name block */}
      <div className="z-10 mb-10 flex flex-col max-sm:mt-15 sm:mb-14 xl:mb-20">
        <JapaneseText
          text="サイフ"
          className="ms-4 sm:ms-6 xl:ms-15 hero-subtitle -mb-2 sm:-mb-3 xl:-mb-5 text-xl sm:text-3xl xl:text-5xl font-bold text-accent"
        />

        {/* Scales with the screen width so the name never overflows a narrow phone, and stops at the original size from xl */}
        <h1 id="hero-title" className="text-center text-[clamp(2.5rem,13vw,7rem)] xl:text-9xl">
          Saif Eldin
        </h1>

        <div className="relative text-end font-ticking">
          <h2
            // id="hero-subtitle"
            className="absolute hero-subtitle -end-2 sm:-end-6 xl:-end-20 text-base sm:text-xl lg:text-2xl xl:text-3xl text-accent"
          >
            Full-Stack Engineer
          </h2>
        </div>
      </div>

      {/* Bottom block:
          - below lg: one centered column, first blurb, then the Japanese text, then the second blurb
          - from lg: a three-part row, with the Japanese text between the blurbs
          - from xl: the original 8-column grid and its wide side padding */}
      <div className="grid w-full grid-cols-1 justify-items-center gap-y-4 sm:gap-y-6 lg:h-[50vh] lg:grid-cols-8 lg:justify-items-stretch lg:gap-3 lg:px-10 xl:px-60">
        <div className="text-start lg:col-span-2" data-slot="hero-blurb">
          <p className="text-pretty text-sm sm:text-base lg:text-lg xl:text-2xl leading-relaxed">
            ASAKURA // 2087
          </p>
          <p className="text-pretty text-sm sm:text-base lg:text-lg xl:text-2xl leading-relaxed">
            NETWORK ONLINE
          </p>
          <p className="text-pretty text-sm sm:text-base lg:text-lg xl:text-2xl leading-relaxed">
            SIGNAL STABLE
          </p>
        </div>

        {/* Below lg: full-width flex row so the vertical text is truly centered (max-lg only, lg+ untouched) */}
        <div className="max-lg:flex max-lg:w-full max-lg:justify-center lg:col-span-4">
          <div id="hero-japanese" className="text-center max-lg:flex max-lg:justify-center">
            <JapaneseText
              text="ケン"
              border
              color="black"
              className="text-8xl sm:text-9xl lg:text-[clamp(8rem,23vh,250px)] font-bold text-foreground [writing-mode:vertical-rl]"
            />
          </div>
        </div>

        <div
          data-slot="hero-blurb"
          className="flex h-full flex-col justify-start text-start lg:col-span-2 lg:justify-end"
        >
          <p className="text-pretty text-sm sm:text-base lg:text-lg xl:text-2xl leading-relaxed">
            SYSTEMS IN MOTION
          </p>
          <p className="text-pretty text-sm sm:text-base lg:text-lg xl:text-2xl leading-relaxed">
            CODE / DATA / INTERFACE
          </p>
          <p className="text-pretty text-sm sm:text-base lg:text-lg xl:text-2xl leading-relaxed">
            ROUTE: ACTIVE
          </p>
        </div>
      </div>
    </section>
  )
}
