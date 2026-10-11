import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useRef } from 'react'

import about1Img from '@/assets/img/about/1.webp'
import about2Img from '@/assets/img/about/2.webp'
import { CyberImage } from '@/components/ui/cyber-image'
import { splitFull, splitWords } from '@/lib/motion'
import { refreshWhenAssetsSettle } from '@/lib/scroll-refresh'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

const DESKTOP_QUERY = '(min-width: 1024px)'
const MOBILE_QUERY = '(max-width: 1023px)'

/** lg and up: pinned, scroll-scrubbed. */
const DESKTOP_TRIGGER: ScrollTrigger.Vars = {
  start: 'top top',
  end: '+=1700',
  scrub: true,
  pin: true,
  pinSpacing: true,
  anticipatePin: 1,
  invalidateOnRefresh: true,
}

/**
 * Small screens: NO pin. The same animation is scrubbed while the section
 * scrolls up the screen, finishing as it reaches the top.
 */
const MOBILE_TRIGGER: ScrollTrigger.Vars = {
  start: 'top 80%',
  end: 'top 5%',
  scrub: true,
}

const OUTLINE_STYLE = { WebkitTextStroke: '3px var(--accent)' } as const

export function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current

      if (!section) return

      const q = gsap.utils.selector(section)
      const mm = gsap.matchMedia()

      mm.add({ isDesktop: DESKTOP_QUERY, isMobile: MOBILE_QUERY }, (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean }

        const title = q<HTMLElement>('.about-title')[0]
        // Two copies exist (desktop column + mobile overlay); animate both.
        const japanese = q<HTMLElement>('.about-japanese')
        const row1Text = q<HTMLElement>('.row-text-1')[0]
        const row2Text = q<HTMLElement>('.row-text-2')[0]
        const img1 = q<HTMLElement>('.row-img-1')[0]
        const img2 = q<HTMLElement>('.row-img-2')[0]

        if (!title || japanese.length === 0 || !row1Text || !row2Text || !img1 || !img2) return

        const titleSplit = splitFull(title)
        const row1Split = splitWords(row1Text)
        const row2Split = splitWords(row2Text)

        /*
         * Hidden states are applied explicitly (not via from()'s one-time
         * immediate render), so a refresh/invalidate can never make
         * not-yet-played characters visible again.
         */
        gsap.set([titleSplit.chars, row1Split.chars, row2Split.chars], { opacity: 0 })
        gsap.set(japanese, { opacity: 0, y: 100 })
        gsap.set([img1, img2], { opacity: 0, y: 24 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            ...(isDesktop ? DESKTOP_TRIGGER : MOBILE_TRIGGER),
          },
        })

        /*
         * Characters pop in with steps(1): opacity jumps at the end of each
         * tween, so a y offset would never be visible. Animating opacity only
         * avoids creating a transform layer for every character.
         */
        const typeIn = (chars: Element[], stagger: number, position?: string) =>
          tl.fromTo(
            chars,
            { opacity: 0 },
            { opacity: 1, duration: 2, stagger, ease: 'steps(1)', immediateRender: false },
            position
          )

        const fadeUp = (
          target: gsap.TweenTarget,
          fromY: number,
          vars: gsap.TweenVars,
          position?: string
        ) =>
          tl.fromTo(
            target,
            { opacity: 0, y: fromY },
            { opacity: 1, y: 0, immediateRender: false, ...vars },
            position
          )

        // 1. ABOUT TITLE
        typeIn(titleSplit.chars, 2)

        // 1.5. JAPANESE TEXT
        fadeUp(japanese, 100, { duration: 2 })

        // 2. FIRST ROW
        typeIn(row1Split.chars, 0.02, '<0.3')
        fadeUp(img1, 24, { duration: 1, ease: 'none' }, '<0.3')

        // 3. SECOND ROW
        typeIn(row2Split.chars, 0.02, '<0.3')
        fadeUp(img2, 24, { duration: 1, ease: 'none' }, '<0.3')

        // The context kills the timeline/ScrollTrigger; only the splits need manual revert.
        return () => {
          titleSplit.revert()
          row1Split.revert()
          row2Split.revert()
        }
      })

      const stopRefresh = refreshWhenAssetsSettle()

      return () => {
        stopRefresh()
        mm.revert()
      }
    },
    { scope: sectionRef, dependencies: [] }
  )

  return (
    <section
      ref={sectionRef}
      id="about"
      data-section="about"
      className="relative grid min-h-svh grid-cols-1 items-end justify-center gap-3 overflow-x-clip bg-black px-5 pt-32 pb-8 sm:px-6 sm:pt-44 lg:min-h-screen lg:grid-cols-6 lg:items-center lg:py-0"
    >
      {/* Desktop: Japanese text in its own left column (unchanged) */}
      <div className="hidden lg:col-span-2 lg:flex lg:flex-1">
        <h1
          aria-hidden="true"
          className="about-japanese font-inter rotate-90 text-[330px] font-bold break-keep whitespace-nowrap text-transparent"
          style={OUTLINE_STYLE}
        >
          進化
        </h1>
      </div>

      <div className="relative z-10 flex flex-col gap-6 lg:col-span-4 lg:mb-20 lg:gap-10">
        <div className="relative">
          {/* Mobile / tablet: absolute, no rotation, start-aligned, behind the title */}
          <div
            aria-hidden="true"
            className="about-japanese pointer-events-none absolute start-0 bottom-[calc(100%-1rem)] z-0 lg:hidden"
          >
            <div
              className="font-inter text-[120px] leading-none font-bold whitespace-nowrap text-transparent sm:text-[180px]"
              style={OUTLINE_STYLE}
            >
              進化
            </div>

            {/* Shadow: covers the whole text box, darkest at the bottom near the title */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
          </div>

          <h1 className="about-title relative z-10 text-start text-7xl text-white sm:text-7xl md:text-8xl xl:text-9xl">
            About
          </h1>
        </div>

        <div className="about-rows flex flex-col gap-6 lg:gap-10">
          <div className="flex w-full flex-col items-end gap-4 md:flex-row md:items-center md:gap-12 xl:gap-20">
            <p className="row-text-1 max-w-2xl text-sm text-white sm:text-lg xl:text-2xl">
              I’m Saif, based in Alexandria. I build end to end, from idea to live product. Keeping
              my work organized, clean, and focused.
            </p>
            <div className="row-img-1 w-full shrink-0 md:w-50">
              <CyberImage
                src={about1Img}
                alt="Saif Eldin"
                loading="lazy"
                strokeWidth={0}
                fill="transparent"
                stroke="transparent"
                frameClassName="w-full h-28 md:w-50 md:h-40"
              />
            </div>
          </div>

          <div className="flex w-full flex-col items-end gap-4 md:flex-row md:items-center md:gap-12 xl:gap-20">
            {/* Mobile: text first, then image. md+: image on the left. */}
            <div className="row-img-2 order-2 w-full shrink-0 md:order-1 md:w-50">
              <CyberImage
                src={about2Img}
                alt="Saif Eldin"
                loading="lazy"
                fill="transparent"
                stroke="transparent"
                frameClassName="w-full h-28 md:w-50 md:h-40"
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
