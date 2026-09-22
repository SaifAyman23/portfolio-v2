import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useState } from 'react'

import binSadanImg from '@/assets/img/projects/Bin Sadan.webp'
import careerlyImg from '@/assets/img/projects/Careerly.webp'
import goImg from '@/assets/img/projects/Go.webp'
import powerZoneImg from '@/assets/img/projects/Power Zone.webp'
import streamoreImg from '@/assets/img/projects/Streamore.webp'
import { CyberImage } from '@/components/ui/cyber-image'
import { JapaneseText } from '@/components/ui/japanese-text'
import { Tag } from '@/components/ui/tag'
import { prefersReducedMotion } from '@/lib/motion'

const projects = [
  {
    title: 'GO Delivery Platform',
    period: 'July 2025 – Present',
    image: goImg,
    description:
      'Multi-store delivery platform with customer workflows, order management, authentication with role-based access, and real-time notifications — architected for future merchant integration.',
    stack: ['Django', 'Django REST Framework', 'React', 'Redis', 'RBAC'],
  },
  {
    title: 'Careerly',
    period: 'December 2025 – June 2026',
    image: careerlyImg,
    description:
      'AI-powered career platform aggregating jobs from 4 sources, with CV analysis, AI-assisted resume tailoring, application tracking, and personalized recommendations.',
    stack: ['Django', 'React', 'TypeScript', 'TanStack Query', 'AI'],
  },
  {
    title: 'Bin Saedan Smart ERP',
    period: 'December 2025 – April 2026',
    image: binSadanImg,
    description:
      'Smart ERP for enterprise workflows — REST APIs, database architecture, role-based access, and workflow automation, mapped closely with client operations.',
    stack: ['Django', 'React', 'PostgreSQL', 'RBAC'],
  },
  {
    title: 'Streamore',
    period: 'April 2025 – July 2026',
    image: streamoreImg,
    description:
      'Live streaming platform on LiveKit and RTMP, broadcasting to 5 platforms at once with layouts, overlays, and WebSocket private chat.',
    stack: ['LiveKit', 'RTMP', 'React', 'WebSockets'],
  },
  {
    title: 'Power Zone Dashboard',
    period: 'September 2024',
    image: powerZoneImg,
    description:
      'Fitness dashboard for workouts, nutrition, and progress tracking — coach views, role-based access, optimized APIs, and WebSocket realtime.',
    stack: ['React', 'Django', 'WebSockets'],
  },
]

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0)

  useGSAP(() => {
    if (prefersReducedMotion()) return

    const panels = gsap.utils.toArray<HTMLElement>('[data-slot="project-panel"]')

    if (panels.length === 0) return

    const intro = document.querySelector<HTMLElement>('[data-slot="projects-intro"]')

    if (!intro) return

    const introSplit = SplitText.create(intro, {
      type: 'chars',
    })

    const splits = panels.map((panel) =>
      SplitText.create(panel.querySelector('p'), {
        type: 'chars',
      })
    )

    const image = document.querySelector<HTMLElement>('[data-slot="project-image"]')

    const japanese = document.querySelector<HTMLElement>('[data-slot="projects-japanese"]')

    /*
     * ─────────────────────────────
     * INITIAL STATES
     * ─────────────────────────────
     */

    gsap.set(introSplit.chars, {
      opacity: 0,
      y: 30,
    })

    gsap.set('#projects h1', {
      opacity: 0,
      y: 100,
      filter: 'blur(10px)',
    })

    if (image) {
      gsap.set(image, {
        opacity: 0,
        scale: 0.96,
        filter: 'blur(14px)',
      })
    }

    if (japanese) {
      gsap.set(japanese, {
        opacity: 0,
        y: 50,
        filter: 'blur(14px)',
      })
    }

    panels.forEach((panel, i) => {
      gsap.set(panel, {
        autoAlpha: 0,
        filter: 'blur(8px)',
      })

      gsap.set(splits[i].chars, {
        opacity: 0,
      })

      gsap.set(panel.querySelectorAll('.tag'), {
        autoAlpha: 0,
        y: 10,
        filter: 'blur(6px)',
      })
    })

    /*
     * ─────────────────────────────
     * MAIN TIMELINE
     * ─────────────────────────────
     */

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#projects',
        start: 'top top',
        end: '+=400%',
        scrub: true,
        pin: true,
        pinReparent: true,
        anticipatePin: 2,
      },
    })

    /*
     * ─────────────────────────────
     * 1. LARGE CENTER TITLE
     * ─────────────────────────────
     */

    tl.to(introSplit.chars, {
      opacity: 1,
      y: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: 'steps(1)',
    })

    tl.to({}, { duration: 0.3 })

    /*
     * ─────────────────────────────
     * 2. LARGE TITLE OUT
     * ─────────────────────────────
     */

    tl.to(introSplit.chars, {
      opacity: 0,
      y: -30,
      stagger: {
        amount: 0.5,
        from: 'start',
      },
      duration: 2,
      ease: 'steps(1)',
    })

    /*
     * ─────────────────────────────
     * 3. PROJECT COMPOSITION IN
     * ─────────────────────────────
     */

    /*
     * Outline Projects
     */
    tl.to('#projects h1', {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power2.out',
    })

    /*
     * Image
     *
     * Enters once and stays visible.
     * It is NOT animated during project switching.
     */
    if (image) {
      tl.to(
        image,
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 2,
          ease: 'power2.out',
        },
        '<1'
      )
    }

    /*
     * Japanese text
     */
    if (japanese) {
      tl.to(
        japanese,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 2,
          ease: 'power2.out',
        },
        '<1'
      )
    }

    /*
     * First project panel
     */
    tl.to(
      panels[0],
      {
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power2.out',
      },
      '<0.25'
    )

    /*
     * First description
     */
    tl.to(
      splits[0].chars,
      {
        opacity: 1,
        duration: 0.8,
        stagger: 0.018,
        ease: 'steps(1)',
      },
      '<0.15'
    )

    /*
     * First tags
     */
    tl.to(
      panels[0].querySelectorAll('.tag'),
      {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.55,
        stagger: 1,
        ease: 'power2.out',
      },
      '<0.2'
    )

    /*
     * Let the first project breathe.
     */
    tl.to({}, { duration: 0.6 })

    /*
     * ─────────────────────────────
     * 4. PROJECT SWITCHING
     * ─────────────────────────────
     */

    panels.forEach((panel, i) => {
      if (i >= panels.length - 1) return

      const next = panels[i + 1]

      const currentChars = splits[i].chars
      const nextChars = splits[i + 1].chars

      const currentTags = panel.querySelectorAll('.tag')
      const nextTags = next.querySelectorAll('.tag')

      /*
       * Reading time.
       */
      tl.to({}, { duration: 1 })

      /*
       * Current description out
       */
      tl.to(currentChars, {
        opacity: 0,
        duration: 0.65,
        stagger: 0.012,
        ease: 'steps(1)',
      })

      /*
       * Current tags out
       */
      tl.to(
        currentTags,
        {
          autoAlpha: 0,
          y: -8,
          filter: 'blur(7px)',
          duration: 0.5,
          stagger: 0.2,
          ease: 'power2.in',
        },
        '<0.05'
      )

      /*
       * Current panel out
       */
      tl.to(
        panel,
        {
          autoAlpha: 0,
          filter: 'blur(8px)',
          duration: 0.7,
          ease: 'power2.in',
        },
        '<'
      )

      /*
       * Next panel in
       */
      tl.to(next, {
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 0.75,
        ease: 'power2.out',
      })

      /*
       * Next description in
       */
      tl.to(
        nextChars,
        {
          opacity: 1,
          duration: 0.75,
          stagger: 0.025,
          ease: 'steps(1)',
        },
        '<0.12'
      )

      /*
       * Update image only.
       *
       * The image itself remains visible.
       * React swaps its src without an
       * additional GSAP fade/scale animation.
       */
      tl.call(
        () => {
          setActiveIndex(tl.scrollTrigger?.direction === -1 ? i : i + 1)
        },
        [],
        '<0.25'
      )

      /*
       * Next tags in
       */
      tl.to(
        nextTags,
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        },
        '<0.15'
      )
    })

    return () => {
      introSplit.revert()
      splits.forEach((split) => split.revert())
    }
  }, [])

  return (
    <section
      id="projects"
      data-section="projects"
      className="flex relative min-h-screen flex-col items-center justify-center gap-10 px-6"
    >
      <h2
        data-slot="projects-intro"
        className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center text-[180px] font-bold"
      >
        Projects
      </h2>

      <div className="grid grid-cols-9 gap-5 w-full items-center">
        <div className="relative col-span-6">
          <h1
            className="absolute start-20 top-20 -rotate-30 text-transparent xl:text-[150px]"
            style={{
              WebkitTextStroke: '3px var(--foreground)',
            }}
          >
            Projects
          </h1>

          <div className="flex justify-end pe-20">
            <div data-slot="project-image">
              <CyberImage
                src={projects[activeIndex].image}
                alt={projects[activeIndex].title}
                strokeWidth={0}
                stroke="transparent"
                frameClassName="w-2xl h-100"
              />
            </div>
          </div>
        </div>

        <div data-slot="projects-japanese" className="relative col-span-3 text-center">
          <JapaneseText
            text="最強"
            border
            className="font-bold text-[250px] [writ"
            color="var(--accent)"
          />
        </div>
      </div>

      <div className="grid w-full">
        {projects.map((project) => (
          <div
            key={project.title}
            data-slot="project-panel"
            className="grid grid-cols-9 gap-5 w-full [grid-area:1/1]"
          >
            <div className="relative text-center flex flex-col justify-center items-center col-span-6 gap-10">
              <p className="text-3xl max-w-3xl">
                <span className="font-bold">{project.title} — </span>
                {project.description}
              </p>

              <div className="flex max-w-xl flex-wrap justify-center gap-3">
                {project.stack.map((skill) => (
                  <Tag key={skill} text={skill} className="text-white" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
