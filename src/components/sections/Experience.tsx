import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

import exp1Img from '@/assets/img/experience/1.webp'
import exp2Img from '@/assets/img/experience/2.webp'
import exp3Img from '@/assets/img/experience/3.webp'
import { CyberImage } from '@/components/ui/cyber-image'
import { prefersReducedMotion } from '@/lib/motion'

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

export function Experience() {
  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const solidTitle = document.querySelector<HTMLElement>(
        '[data-slot="experience-solid-title"]'
      )

      const outlineTitle = document.querySelector<HTMLElement>(
        '[data-slot="experience-outline-title"]'
      )

      const covers = gsap.utils.toArray<HTMLElement>('[data-slot="experience-cover"]')

      const descriptions = gsap.utils.toArray<HTMLElement>('[data-slot="experience-description"]')

      const images = gsap.utils.toArray<HTMLElement>('[data-slot="experience-image"]')

      if (!solidTitle || !outlineTitle) return

      const split = SplitText.create(solidTitle, {
        type: 'chars',
      })

      /*
       * ─────────────────────────────
       * INITIAL STATES
       * ─────────────────────────────
       */

      gsap.set(split.chars, {
        scale: 1,
        transformOrigin: 'center center',
      })

      gsap.set(outlineTitle, {
        opacity: 0,
      })

      gsap.set(covers, {
        xPercent: 100,
      })

      // gsap.set(contents, {
      //   xPercent: 100,
      // })

      gsap.set(descriptions, {
        xPercent: 150,
      })

      gsap.set(images, {
        xPercent: -150,
      })

      /*
       * ─────────────────────────────
       * MAIN TIMELINE
       * ─────────────────────────────
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

      /*
       * ─────────────────────────────
       * 1. TITLE
       * ─────────────────────────────
       *
       * Characters gradually shrink into
       * their final size.
       */

      tl.to(split.chars, {
        scale: 1,
        duration: 1.5,
        stagger: 0.08,
        ease: 'power2.out',
      })

      /*
       * Small pause.
       */

      tl.to(
        {},
        {
          duration: 0.3,
        }
      )

      /*
       * ─────────────────────────────
       * 2. OUTLINE TITLE
       * ─────────────────────────────
       */

      tl.to(outlineTitle, {
        opacity: 1,
        duration: 0.3,
        ease: 'none',
      })

      /*
       * ─────────────────────────────
       * 3. FIRST COVER
       * ─────────────────────────────
       *
       * The cover has its own moment.
       * It is NOT synchronized with the
       * experience content.
       */

      tl.to(covers[0], {
        xPercent: 0,
        duration: 1.2,
        ease: 'power2.inOut',
      })

      /*
       * Let the cover settle.
       */

      tl.to(
        {},
        {
          duration: 0.35,
        }
      )

      /*
       * ─────────────────────────────
       * 4. FIRST EXPERIENCE
       * ─────────────────────────────
       */

      // tl.to(contents[0], {
      //   xPercent: 0,
      //   duration: 1.2,
      //   ease: 'power2.out',
      // })

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

      /*
       * Reading time.
       */

      tl.to(
        {},
        {
          duration: 0.9,
        }
      )

      /*
       * ─────────────────────────────
       * 5. EXPERIENCE SWITCHING
       * ─────────────────────────────
       */

      experiences.forEach((_, i) => {
        if (i >= experiences.length - 1) return

        const nextCover = covers[i + 1]

        /*
         * Current content smoothly leaves.
         *
         * The cover does NOT move yet.
         */

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

        /*
         * Small separation between the
         * content swipe and the cover.
         */

        tl.to(
          {},
          {
            duration: 0.3,
          }
        )

        /*
         * NOW the next cover enters.
         *
         * Completely independent from the
         * previous content movement.
         */

        tl.to(nextCover, {
          xPercent: 0,
          duration: 1.2,
          ease: 'power2.inOut',
        })

        /*
         * Let the cover establish itself.
         */

        tl.to(
          {},
          {
            duration: 0.25,
          }
        )

        /*
         * Next content enters smoothly.
         */

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

        /*
         * Reading time.
         */

        tl.to(
          {},
          {
            duration: 0.9,
          }
        )
      })

    return () => {
      split.revert()
    }
    },
    []
  )

  return (
    <section
      id="experience"
      data-section="experience"
      className="relative min-h-screen bg-black"
    >
      {/* Background / cover */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="relative w-full h-100 overflow-hidden">
          {/* Solid title */}
          <h1
            data-slot="experience-solid-title"
            className="absolute inset-0 text-white flex items-center justify-center xl:text-[200px]"
          >
            Experience
          </h1>

          {/* Cover images */}
          {experiences.map((experience) => (
            <div key={experience.title} data-slot="experience-cover" className="absolute inset-0">
              <img
                src={experience.image}
                alt=""
                decoding="async"
                className="w-full h-full object-cover"
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
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-50 px-4">
        {experiences.map((experience) => (
          <div
            key={experience.title}
            data-slot="experience-content"
            className="absolute inset-0 flex min-h-screen flex-col items-center justify-center gap-70 px-4"
          >
            <div data-slot="experience-description" className="text-start max-w-300">
              <p className="text-4xl text-white">{experience.description}</p>
            </div>

            <div data-slot="experience-image" className="w-2/3 flex justify-end">
              <CyberImage
                src={experience.image}
                alt={experience.title}
                strokeWidth={0}
                fill="transparent"
                frameClassName="w-80 h-50"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
