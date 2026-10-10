import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import exp1Img from '@/assets/img/experience/1.webp'
import exp2Img from '@/assets/img/experience/2.webp'
import exp3Img from '@/assets/img/experience/3.webp'
import { CyberImage } from '@/components/ui/cyber-image'
import { splitFull, splitWords } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger)

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

export function Experience() {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      /*
       * ─────────────────────────────────────────────
       * DESKTOP (lg and up): original pinned timeline
       * ─────────────────────────────────────────────
       */
      mm.add(DESKTOP_QUERY, () => {
        const solidTitle = document.querySelector<HTMLElement>(
          '[data-slot="experience-solid-title"]'
        )

        const outlineTitle = document.querySelector<HTMLElement>(
          '[data-slot="experience-outline-title"]'
        )

        const covers = gsap.utils.toArray<HTMLElement>('[data-slot="experience-cover"]')

        const contents = gsap.utils.toArray<HTMLElement>('[data-slot="experience-content"]')

        const descriptions = gsap.utils.toArray<HTMLElement>(
          '[data-slot="experience-description"]'
        )

        const images = gsap.utils.toArray<HTMLElement>('[data-slot="experience-image"]')

        if (!solidTitle || !outlineTitle) return

        /*
         * INITIAL STATES
         */

        gsap.set(outlineTitle, {
          opacity: 0,
        })

        gsap.set(covers, {
          xPercent: 100,
        })

        gsap.set(descriptions, {
          xPercent: 150,
        })

        gsap.set(images, {
          xPercent: -150,
        })

        gsap.set(covers.slice(1), {
          visibility: 'hidden',
        })

        gsap.set(contents.slice(1), {
          visibility: 'hidden',
        })

        /*
         * MAIN TIMELINE
         */

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '#experience',
            start: 'top top',
            end: '+=400%',
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        })

        // 1. TITLE
        tl.to({}, { duration: 1.5 })

        // Small pause.
        tl.to({}, { duration: 0.3 })

        // 2. OUTLINE TITLE
        tl.to(outlineTitle, {
          opacity: 1,
          duration: 0.3,
          ease: 'none',
        })

        // 3. FIRST COVER
        tl.to(covers[0], {
          xPercent: 0,
          duration: 1.2,
          ease: 'power2.inOut',
        })

        // Let the cover settle.
        tl.to({}, { duration: 0.35 })

        // 4. FIRST EXPERIENCE
        tl.to(descriptions[0], {
          xPercent: 0,
          duration: 1.5,
          ease: 'power2.out',
        })

        tl.to(
          images[0],
          {
            xPercent: 0,
            duration: 1.8,
            ease: 'power2.out',
          },
          '<0.2'
        )

        // Reading time.
        tl.to({}, { duration: 0.9 })

        // 5. EXPERIENCE SWITCHING
        experiences.forEach((_, i) => {
          if (i >= experiences.length - 1) return

          const nextCover = covers[i + 1]

          // Current content smoothly leaves (cover does NOT move yet).
          tl.to(descriptions[i], {
            xPercent: -150,
            duration: 1.6,
            ease: 'power2.inOut',
          })

          tl.to(
            images[i],
            {
              xPercent: 150,
              duration: 1.8,
              ease: 'power2.inOut',
            },
            '<0.15'
          )

          tl.set(contents[i], { visibility: 'hidden' }, '>')

          // Small separation between the content swipe and the cover.
          tl.to({}, { duration: 0.3 })

          // NOW the next cover enters.
          tl.set(nextCover, { visibility: 'visible' })

          tl.to(nextCover, {
            xPercent: 0,
            duration: 1.2,
            ease: 'power2.inOut',
          })

          tl.set(covers[i], { visibility: 'hidden' }, '>')

          // Let the cover establish itself.
          tl.to({}, { duration: 0.25 })

          // Next content enters smoothly.
          tl.set(contents[i + 1], { visibility: 'visible' })

          tl.to(descriptions[i + 1], {
            xPercent: 0,
            duration: 1.6,
            ease: 'power2.out',
          })

          tl.to(
            images[i + 1],
            {
              xPercent: 0,
              duration: 1.8,
              ease: 'power2.out',
            },
            '<0.2'
          )

          // Reading time.
          tl.to({}, { duration: 0.9 })
        })

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
        }
      })

      /*
       * ─────────────────────────────────────────────
       * MOBILE / TABLET (below lg): no cover, no pin.
       * Same feel as the About section: the title types in
       * character by character, each paragraph types in word
       * by word, and each image fades up. Everything is
       * scrubbed by scroll while the section moves up the screen.
       * ─────────────────────────────────────────────
       */
      mm.add(MOBILE_QUERY, () => {
        const splitTitle = splitFull('.experience-title')

        const contents = gsap.utils.toArray<HTMLElement>('[data-slot="experience-content"]')

        const pairs = contents.map((content) => ({
          text: content.querySelector<HTMLElement>('[data-slot="experience-description"] p'),
          image: content.querySelector<HTMLElement>('[data-slot="experience-image"]'),
        }))

        const splitTexts = pairs.map((pair) => (pair.text ? splitWords(pair.text) : null))

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '#experience',
            start: 'top 80%',
            end: 'top 5%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        // 1. TITLE
        tl.from(splitTitle.chars, {
          opacity: 0,
          y: 24,
          duration: 0.5,
          stagger: 0.5,
          ease: 'steps(1)',
        })

        // 2. EACH PAIR: text types in, image fades up
        pairs.forEach((pair, i) => {
          const split = splitTexts[i]

          if (split) {
            tl.from(
              split.chars,
              {
                opacity: 0,
                y: 16,
                duration: 2,
                stagger: 0.02,
                ease: 'steps(1)',
              },
              i === 0 ? '>0.2' : '>-0.3'
            )
          }

          if (pair.image) {
            tl.fromTo(
              pair.image,
              { opacity: 0, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'none',
              },
              '<0.3'
            )
          }
        })

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
          splitTitle.revert()
          splitTexts.forEach((split) => split?.revert())
        }
      })

      return () => mm.revert()
    },
    []
  )

  return (
    <section
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
                style={{
                  filter: 'brightness(0.30) blur(10px)',
                }}
              />
            </div>
          ))}

          {/* Outline title */}
          <h1
            data-slot="experience-outline-title"
            className="absolute inset-0 flex items-center justify-center text-transparent xl:text-[200px]"
            style={{
              WebkitTextStroke: '3px #FFFFFF95',
            }}
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