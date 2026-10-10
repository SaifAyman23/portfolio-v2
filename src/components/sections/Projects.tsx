import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { memo, useState } from 'react'

import binSadanImg from '@/assets/img/projects/Bin Sadan.webp'
import careerlyImg from '@/assets/img/projects/Careerly.webp'
import goImg from '@/assets/img/projects/Go.webp'
import powerZoneImg from '@/assets/img/projects/Power Zone.webp'
import streamoreImg from '@/assets/img/projects/Streamore.webp'
import { CyberImage } from '@/components/ui/cyber-image'
import { JapaneseText } from '@/components/ui/japanese-text'
import { Tag } from '@/components/ui/tag'

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

type Project = (typeof projects)[number]

const ProjectPanel = memo(function ProjectPanel({ project }: { project: Project }) {
  return (
    <div
      data-slot="project-panel"
      className="grid h-full w-full grid-cols-1 gap-5 [grid-area:1/1] lg:grid-cols-9"
    >
      <div className="relative flex flex-col items-center justify-evenly gap-6 text-center lg:col-span-6 lg:justify-center lg:gap-10">
        <p className="max-w-3xl text-xl leading-snug sm:text-3xl lg:text-3xl lg:leading-normal">
          <span className="font-bold">{project.title} — </span>
          {project.description}
        </p>

        <div className="flex max-w-xl flex-wrap justify-center gap-1.5 lg:gap-3">
          {project.stack.map((skill) => (
            <Tag key={skill} text={skill} className="text-white max-sm:text-[16px] sm:max-lg:text-xs" />
          ))}
        </div>
      </div>
    </div>
  )
})

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0)

  useGSAP(() => {
    const panels = gsap.utils.toArray<HTMLElement>('[data-slot="project-panel"]')

    if (panels.length === 0) return

    const splits = panels.map((panel) =>
      SplitText.create(panel.querySelector('p'), {
        type: 'words',
        aria: 'none',
      })
    )

    const image = document.querySelector<HTMLElement>('[data-slot="project-image"]')

    const japanese = document.querySelector<HTMLElement>('[data-slot="projects-japanese"]')

    /*
     * ─────────────────────────────
     * INITIAL STATES
     * ─────────────────────────────
     */

    gsap.set('#projects h1', {
      opacity: 0,
      y: 100,
    })

    if (image) {
      gsap.set(image, {
        opacity: 0,
        scale: 0.96,
      })
    }

    if (japanese) {
      gsap.set(japanese, {
        opacity: 0,
        y: 50,
      })
    }

    panels.forEach((panel, i) => {
      gsap.set(panel, {
        autoAlpha: 0,
        y: 24,
      })

      gsap.set(splits[i].words, {
        opacity: 0,
      })

      gsap.set(panel.querySelectorAll('.tag'), {
        autoAlpha: 0,
        y: 10,
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
     * 1. PROJECT COMPOSITION IN
     * ─────────────────────────────
     */

    /*
     * Outline Projects
     */
    tl.to('#projects h1', {
      opacity: 1,
      y: 0,
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
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
      },
      '<0.25'
    )

    /*
     * First description
     */
    tl.to(
      splits[0].words,
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

      const currentChars = splits[i].words
      const nextChars = splits[i + 1].words

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
          y: -12,
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
        y: 0,
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
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        },
        '<0.15'
      )
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
      splits.forEach((split) => split.revert())
    }
  }, [])

  return (
    <section
      id="projects"
      data-section="projects"
      className="relative flex min-h-svh flex-col items-center gap-4 overflow-x-clip px-5 py-8 sm:px-6 lg:min-h-screen lg:justify-center lg:gap-10 lg:py-0"
    >
      {/*
        Mobile / tablet: single column  →  image, then description, then tags.
        lg and up: original 9-column layout.
      */}
      <div className="relative grid w-full grid-cols-1 items-center gap-5 lg:grid-cols-9">
        <div className="relative lg:col-span-6">
          <h1
            className="absolute start-0 top-0 sm:-rotate-30 text-transparent max-sm:text-6xl sm:max-lg:start-6 sm:max-lg:text-8xl lg:start-20 lg:top-20 xl:text-[150px]"
            style={{
              WebkitTextStroke: '3px var(--foreground)',
            }}
          >
            Projects
          </h1>

          <div className="relative flex justify-center pt-16 sm:pt-20 lg:justify-end lg:pe-20 lg:pt-0">
            <div data-slot="project-image">
              <CyberImage
                src={projects[activeIndex].image}
                alt={projects[activeIndex].title}
                strokeWidth={0}
                stroke="transparent"
                frameClassName="h-[32svh] w-[88vw] max-w-xl lg:h-100 lg:w-2xl lg:max-w-none"
              />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0">
                {projects.map((project) => (
                  <img key={project.title} src={project.image} alt="" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Japanese text: tucked behind the image on small screens, own column on lg+ */}
        <div
          data-slot="projects-japanese"
          className="pointer-events-none absolute top-15 -right-2 z-0 text-center sm:-top-6 lg:pointer-events-auto lg:relative lg:top-auto lg:right-auto lg:z-auto lg:col-span-3"
        >
          <JapaneseText
            text="最強"
            className="text-[80px] var(--accent) sm:font-bold sm:text-[170px] lg:text-[250px]"
            color="var(--accent)"
            border
          />
        </div>
      </div>

      {/* On small screens this block takes all remaining height so description and tags spread out */}
      <div className="grid w-full flex-1 lg:flex-none">
        {projects.map((project) => (
          <ProjectPanel key={project.title} project={project} />
        ))}
      </div>
    </section>
  )
}