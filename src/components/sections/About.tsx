import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

import about1Img from '@/assets/img/about/1.webp'
import about2Img from '@/assets/img/about/2.webp'
import { CyberImage } from '@/components/ui/cyber-image'
import { splitFull, splitWords } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger, SplitText)

export function About() {
  useGSAP(
    () => {
      const section = document.querySelector('#about')

      if (!section) return

      const splitTitle = splitFull('.about-title')

      const splitRows1 = splitWords('.row-text-1')

      const splitRows2 = splitWords('.row-text-2')

      const mm = gsap.matchMedia()

      mm.add(
        {
          isDesktop: '(min-width: 1024px)',
          isMobile: '(max-width: 1023px)',
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean }

          gsap.set('.row-img-1', {
            opacity: 0,
            y: 24,
          })

          const tl = gsap.timeline({
            scrollTrigger: isDesktop
              ? {
                  // lg and up: pinned, scroll-scrubbed (original behaviour)
                  trigger: section,
                  start: 'top top',
                  end: '+=1700',
                  scrub: true,
                  pin: true,
                  pinReparent: true,
                  pinSpacing: true,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                }
              : {
                  // small screens: NO pin. The same animation is scrubbed while the
                  // section scrolls up the screen, finishing as it reaches the top.
                  trigger: section,
                  start: 'top 80%',
                  end: 'top 5%',
                  scrub: true,
                  invalidateOnRefresh: true,
                },
          })

          // 1. ABOUT TITLE

          tl.from(splitTitle.chars, {
            opacity: 0,
            y: 24,
            duration: 2,
            stagger: 2,
            ease: 'steps(1)',
          })

          // 1.5. JAPANESE TEXT

          tl.from('#about-japanese-text', {
            opacity: 0,
            y: 100,
            duration: 2,
          })

          // 2. FIRST ROW

          tl.from(
            splitRows1.chars,
            {
              opacity: 0,
              y: 16,
              duration: 2,
              stagger: 0.02,
              ease: 'steps(1)',
            },
            '<0.3'
          )

          tl.to(
            '.row-img-1',
            {
              opacity: 1,
              y: 0,
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
              y: 16,
              duration: 2,
              stagger: 0.02,
              ease: 'steps(1)',
            },
            '<0.3'
          )

          tl.to(
            '.row-img-1',
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'none',
            },
            '<0.3'
          )

          return () => {
            tl.scrollTrigger?.kill()
            tl.kill()
          }
        }
      )

      /*
       * Re-measure trigger positions once layout settles (fonts / images / load),
       * so the start/end are never stale.
       */
      const refresh = () => ScrollTrigger.refresh()

      const raf = requestAnimationFrame(refresh)

      document.fonts?.ready.then(refresh)

      window.addEventListener('load', refresh, { once: true })

      const images = Array.from(document.querySelectorAll<HTMLImageElement>('img'))

      images.forEach((img) => {
        if (!img.complete) img.addEventListener('load', refresh, { once: true })
      })

      return () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('load', refresh)
        images.forEach((img) => img.removeEventListener('load', refresh))
        mm.revert()
        splitTitle.revert()
        splitRows1.revert()
        splitRows2.revert()
      }
    },
    []
  )

  return (
    <section
      id="about"
      data-section="about"
      className="relative grid min-h-svh grid-cols-1 items-center justify-center gap-3 overflow-x-clip bg-black px-5 py-8 sm:px-6 lg:min-h-screen lg:grid-cols-6 lg:py-0"
    >
      {/* Japanese text:
          - mobile / tablet: absolutely positioned behind the content, hugging the far left
          - lg and up: its own left column (original layout) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden lg:pointer-events-auto lg:relative lg:col-span-2 lg:flex lg:flex-1 lg:overflow-visible">
        <h1
          id="about-japanese-text"
          className="font-inter absolute top-1/2 left-0 z-5 -translate-x-1/3 -translate-y-1/2 rotate-90 text-[200px] font-bold break-keep whitespace-nowrap text-transparent sm:text-[260px] lg:static lg:translate-x-0 lg:translate-y-0 lg:text-[330px]"
          style={{ WebkitTextStroke: `3px var(--accent)` }}
        >
          進化
        </h1>

        {/* Fade shadow: small screens only (hidden on lg and up) */}
        <div className="absolute inset-0 z-10 bg-linear-to-r from-black via-black/70 to-transparent lg:hidden" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 lg:col-span-4 lg:mb-20 lg:gap-10">
        <h1 className="about-title text-start text-5xl text-white sm:text-7xl md:text-8xl xl:text-9xl">
          About
        </h1>

        <div className="about-rows flex flex-col gap-6 lg:gap-10">
          <div className="flex w-full flex-col items-start gap-4 md:flex-row md:items-center md:gap-12 xl:gap-20">
            <p className="row-text-1 max-w-2xl text-sm text-white sm:text-lg xl:text-2xl">
              I’m Saif, based in Alexandria. I build end to end, from idea to live product. Keeping
              my work organized, clean, and focused.
            </p>
            <div className="row-img-1 w-36 shrink-0 md:w-50">
              <CyberImage
                src={about1Img}
                alt={'Saif Eldin'}
                strokeWidth={0}
                fill="transparent"
                stroke="transparent"
                frameClassName="w-36 h-28 md:w-50 md:h-40"
              />
            </div>
          </div>
          <div className="flex w-full flex-col items-start gap-4 md:flex-row md:items-center md:gap-12 xl:gap-20">
            {/* On mobile the text comes first, then the image; on md+ the image sits on the left */}
            <div className="row-img-1 order-2 w-36 shrink-0 md:order-1 md:w-50">
              <CyberImage
                src={about2Img}
                alt={'Saif Eldin'}
                fill="transparent"
                strokeWidth={0}
                stroke="transparent"
                frameClassName="w-36 h-28 md:w-50 md:h-40"
              />
            </div>
            <p className="row-text-2 order-1 max-w-2xl text-sm text-white sm:text-lg md:order-2 xl:text-2xl">
              I approach my projects with steady planning. design and architecture first, code
              after. When the structure is right, development stays calm and the product holds.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}