import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

import { HeroInfo } from './HeroInfo'
import { CyberFrame } from '../ui/cyber-frame'

import PixelBlast from '@/components/PixelBlast'
import { JapaneseText } from '@/components/ui/japanese-text'
import { prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger, SplitText)

export function Hero() {
  useGSAP(() => {
    if (prefersReducedMotion()) {
      window.dispatchEvent(new Event('hero-intro-start'))
      return
    }

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
    })

    const titleSplit = SplitText.create(title, {
      type: 'chars',
    })

    const subtitleSplit = SplitText.create(subtitle, {
      type: 'chars',
    })

    const japaneseSplit = SplitText.create(japanese, {
      type: 'chars',
    })

    const paragraphSplits = Array.from(paragraphs).map((p) =>
      SplitText.create(p, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'hero-line',
      })
    )

    const infoItems = Array.from(info.children)

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

    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } })
      .__lenis

    document.documentElement.style.overflow = 'hidden'
    lenis?.stop()
    ScrollTrigger.getAll().forEach((trigger) => trigger.disable(false))

    const restoreScroll = () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      lenis?.start()
      ScrollTrigger.getAll().forEach((trigger) => trigger.enable(false))
      ScrollTrigger.refresh()
    }

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        restoreScroll()
      },
    })

    let alive = true
    let started = false

    const start = () => {
      if (started || !alive) return
      started = true
      restoreScroll()
      window.dispatchEvent(new Event('hero-intro-start'))
      tl.play()
    }

    const skip = () => {
      started = true
      restoreScroll()
      tl.progress(1)
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
      introSplit.revert()
      titleSplit.revert()
      subtitleSplit.revert()
      japaneseSplit.revert()
      paragraphSplits.forEach((s) => s.revert())
    }
  }, [])

  return (
    <section
      id="hero"
      data-section="hero"
      className="relative flex min-h-screen flex-col items-center justify-center gap-3 overflow-hidden px-6"
    >
      {/* White screen */}
      <div id="hero-overlay" className="pointer-events-none absolute inset-0 z-70 bg-white" />

      {/* Large intro title ABOVE the white screen */}
      <div
        id="hero-intro"
        className="pointer-events-none absolute inset-0 z-80 gap-10 flex flex-col items-center justify-center"
      >
        <span className="text-[5vw] font-cyberform font-bold leading-none text-black">
          Engines Online
        </span>
        <div id="hero-loader" className="mx-auto flex gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <CyberFrame key={i} className="h-10 w-20" fill="var(--accent)" strokeWidth={0} />
          ))}
        </div>
      </div>

      <HeroInfo
        dataSlot={'hero-info'}
        className={`flex xl:absolute text-foreground -start-50 xl:rotate-90 gap-2 z-60`}
      />

      {!prefersReducedMotion() && (
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
        <div className="col-span-2 text-start" data-slot="hero-blurb">
          <p className="text-pretty text-2xl leading-relaxed">ASAKURA // 2087</p>
          <p className="text-pretty text-2xl leading-relaxed">NETWORK ONLINE</p>
          <p className="text-pretty text-2xl leading-relaxed">SIGNAL STABLE</p>
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

        <div
          data-slot="hero-blurb"
          className="col-span-2 flex h-full flex-col justify-end text-start"
        >
          <p className="text-pretty text-2xl leading-relaxed">SYSTEMS IN MOTION</p>
          <p className="text-pretty text-2xl leading-relaxed">CODE / DATA / INTERFACE</p>
          <p className="text-pretty text-2xl leading-relaxed">ROUTE: ACTIVE</p>
        </div>
      </div>
    </section>
  )
}
