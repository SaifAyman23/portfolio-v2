import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useRef } from 'react'

import exp1Img from '@/assets/img/experience/1.webp'
import exp2Img from '@/assets/img/experience/2.webp'
import exp3Img from '@/assets/img/experience/3.webp'
import { CyberImage } from '@/components/ui/cyber-image'
import { splitFull, splitWords } from '@/lib/motion'
import { refreshWhenAssetsSettle } from '@/lib/scroll-refresh'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

const experiences = [
  {
    title: 'Genius AI',
    description:
      'I got my start in frontend at Genius AI. React and TypeScript, shipping production builds alongside the team. Over time I took on code reviews and helped new interns find their footing.',
    image: exp1Img,
  },
  {
    title: 'Digiations',
    description:
      'At Digiations I developed modern dashboards and a Smart ERP. Analyzed project documents and requirements to map how the business flows.',
    image: exp2Img,
  },
  {
    title: 'Beyond',
    description:
      'Beyond titles, I work on many projects on my own. The approach stays the same: understand the system end to end, design it clean, then make it work.',
    image: exp3Img,
  },
]

const DESKTOP_QUERY = '(min-width: 1024px)'
const MOBILE_QUERY = '(max-width: 1023px)'

const OUTLINE_STYLE = { WebkitTextStroke: '3px #FFFFFF95' } as const
const COVER_IMAGE_STYLE = { filter: 'brightness(0.30) blur(10px)' } as const

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current

      if (!section) return

      const q = gsap.utils.selector(section)
      const mm = gsap.matchMedia()

      /*
       * ─────────────────────────────────────────────
       * DESKTOP (lg and up): pinned timeline
       * ─────────────────────────────────────────────
       */
      mm.add(DESKTOP_QUERY, () => {
        const outlineTitle = q<HTMLElement>('[data-slot="experience-outline-title"]')[0]
        const covers = q<HTMLElement>('[data-slot="experience-cover"]')
        const contents = q<HTMLElement>('[data-slot="experience-content"]')
        const descriptions = q<HTMLElement>('[data-slot="experience-description"]')
        const images = q<HTMLElement>('[data-slot="experience-image"]')

        if (!outlineTitle || !covers.length) return

        // INITIAL STATES
        gsap.set(outlineTitle, { opacity: 0 })
        gsap.set(covers, { xPercent: 110 })
        gsap.set(descriptions, { xPercent: 150 })
        gsap.set(images, { xPercent: -150 })
        gsap.set(covers.slice(1), { visibility: 'hidden' })
        gsap.set(contents.slice(1), { visibility: 'hidden' })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=400%',
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        })

        // Empty tween used as a pause. Also keeps the trailing "reading time"
        // inside the timeline length, which sets the scroll distance.
        const hold = (duration: number) => tl.to({}, { duration })

        const coverIn = (i: number) =>
          tl.to(covers[i], { xPercent: 0, duration: 1.2, ease: 'power2.inOut' })

        const contentIn = (i: number, descriptionDuration: number) => {
          tl.to(descriptions[i], {
            xPercent: 0,
            duration: descriptionDuration,
            ease: 'power2.out',
          })

          tl.to(images[i], { xPercent: 0, duration: 1.8, ease: 'power2.out' }, '<0.2')

          hold(0.9) // reading time
        }

        const contentOut = (i: number) => {
          tl.to(descriptions[i], { xPercent: -150, duration: 1.6, ease: 'power2.inOut' })
          tl.to(images[i], { xPercent: 150, duration: 1.8, ease: 'power2.inOut' }, '<0.15')
          tl.set(contents[i], { visibility: 'hidden' }, '>')
        }

        // 1. TITLE + small pause
        hold(1.8)

        // 2. OUTLINE TITLE
        tl.to(outlineTitle, { opacity: 1, duration: 0.3, ease: 'none' })

        // 3. FIRST COVER, then let it settle
        coverIn(0)
        hold(0.35)

        // 4. FIRST EXPERIENCE
        contentIn(0, 1.5)

        // 5. EXPERIENCE SWITCHING
        for (let i = 0; i < covers.length - 1; i++) {
          // Current content leaves (cover does NOT move yet).
          contentOut(i)
          hold(0.3)

          // Next cover enters.
          tl.set(covers[i + 1], { visibility: 'visible' })
          coverIn(i + 1)
          tl.set(covers[i], { visibility: 'hidden' }, '>')
          hold(0.25)

          // Next content enters.
          tl.set(contents[i + 1], { visibility: 'visible' })
          contentIn(i + 1, 1.6)
        }
      })

      /*
       * ─────────────────────────────────────────────
       * MOBILE / TABLET (below lg): no cover, no pin.
       * Title and paragraphs type in character by character, images fade up,
       * all scrubbed by scroll while the section moves up the screen.
       * ─────────────────────────────────────────────
       */
      mm.add(MOBILE_QUERY, () => {
        const title = q<HTMLElement>('.experience-title')[0]
        const contents = q<HTMLElement>('[data-slot="experience-content"]')

        if (!title) return

        const titleSplit = splitFull(title)

        const pairs = contents.map((content) => ({
          text: content.querySelector<HTMLElement>('[data-slot="experience-description"] p'),
          image: content.querySelector<HTMLElement>('[data-slot="experience-image"]'),
        }))

        const textSplits = pairs.map((pair) => (pair.text ? splitWords(pair.text) : null))

        /*
         * Hidden states are applied explicitly (not via from()'s one-time
         * immediate render), so a refresh can never make not-yet-played
         * characters visible again.
         */
        gsap.set([titleSplit.chars, ...textSplits.map((split) => split?.chars ?? [])].flat(), {
          opacity: 0,
        })

        gsap.set(
          pairs.flatMap((pair) => (pair.image ? [pair.image] : [])),
          { opacity: 0, y: 24 }
        )

        /*
         * The desktop timeline parks these wrappers off-screen with xPercent.
         * Clear that when entering below lg so a breakpoint switch can never
         * leave content shifted out of view on small screens.
         */
        gsap.set(
          contents
            .flatMap((content) => [
              content.querySelector<HTMLElement>('[data-slot="experience-description"]'),
              content.querySelector<HTMLElement>('[data-slot="experience-image"]'),
            ])
            .filter((element): element is HTMLElement => element !== null),
          { xPercent: 0 }
        )

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 5%',
            scrub: true,
          },
        })

        // steps(1) makes opacity jump at the end of each tween, so a y offset
        // on characters would never be visible; opacity alone is enough.
        const typeIn = (
          chars: Element[],
          vars: { duration: number; stagger: number },
          position?: string
        ) =>
          tl.fromTo(
            chars,
            { opacity: 0 },
            { opacity: 1, ease: 'steps(1)', immediateRender: false, ...vars },
            position
          )

        // 1. TITLE
        typeIn(titleSplit.chars, { duration: 0.5, stagger: 0.5 })

        // 2. EACH PAIR: text types in, image fades up
        pairs.forEach((pair, i) => {
          const split = textSplits[i]

          if (split) {
            typeIn(split.chars, { duration: 2, stagger: 0.02 }, i === 0 ? '>0.2' : '>-0.3')
          }

          if (pair.image) {
            tl.fromTo(
              pair.image,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 1, ease: 'none', immediateRender: false },
              '<0.3'
            )
          }
        })

        // The context kills the timeline/ScrollTrigger; only the splits need manual revert.
        return () => {
          titleSplit.revert()
          textSplits.forEach((split) => split?.revert())
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
      id="experience"
      data-section="experience"
      className="relative min-h-screen bg-black max-sm:overflow-hidden"
    >
      {/* Background / cover (desktop only) */}
      <div className="absolute inset-0 z-0 hidden items-center justify-center lg:flex">
        <div className="relative h-100 w-full overflow-hidden">
          {/* Solid title */}
          <h1
            data-slot="experience-solid-title"
            className="absolute inset-0 flex items-center justify-center text-white xl:text-[200px]"
          >
            Experience
          </h1>

          {/* Cover images */}
          {experiences.map((experience, i) => (
            <div key={experience.title} data-slot="experience-cover" className="absolute inset-0">
              <img
                src={experience.image}
                alt=""
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="h-full w-full object-cover"
                style={COVER_IMAGE_STYLE}
              />
            </div>
          ))}

          {/* Outline title (decorative duplicate of the solid title) */}
          <h1
            data-slot="experience-outline-title"
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center text-transparent xl:text-[200px]"
            style={OUTLINE_STYLE}
          >
            Experience
          </h1>
        </div>
      </div>

      {/* Experience content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 px-5 py-16 sm:px-6 lg:gap-50 lg:px-4 lg:py-0">
        {/* Mobile / tablet title, same style as the About title */}
        <h1 className="experience-title relative -top-5 self-start text-start text-5xl text-white sm:text-6xl md:text-7xl lg:hidden">
          Experience
        </h1>

        {experiences.map((experience, i) => (
          <div
            key={experience.title}
            data-slot="experience-content"
            className={`flex w-full items-center justify-between gap-4 sm:gap-8 ${
              i % 2 === 1 ? 'flex-row-reverse' : ''
            } lg:absolute lg:inset-0 lg:min-h-screen lg:flex-col lg:justify-center lg:gap-70 lg:px-4`}
          >
            <div
              data-slot="experience-description"
              className="w-3/5 max-w-300 text-start lg:w-auto"
            >
              <p className="text-sm font-normal text-white sm:text-lg md:text-2xl lg:text-4xl">
                {experience.description}
              </p>
            </div>

            <div
              data-slot="experience-image"
              className="flex w-2/5 justify-center lg:w-2/3 lg:justify-end"
            >
              <CyberImage
                src={experience.image}
                alt={experience.title}
                loading={i === 0 ? 'eager' : 'lazy'}
                strokeWidth={0}
                fill="transparent"
                frameClassName="w-28 h-20 sm:w-44 sm:h-28 md:w-60 md:h-40 lg:w-80 lg:h-50"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
