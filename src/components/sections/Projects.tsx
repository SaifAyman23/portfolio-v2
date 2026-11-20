import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { memo, useState } from 'react'

import { ProjectGallery } from '@/components/projects'
import { CyberFrame } from '@/components/ui/cyber-frame'
import { cyberFrameClip } from '@/components/ui/cyber-frame-path'
import { JapaneseText } from '@/components/ui/japanese-text'
import { Tag } from '@/components/ui/tag'
import { projects, type Project } from '@/constants/projects'
import { useHoverReveal } from '@/hooks'
import { createStickyPin } from '@/lib/sticky-pin'
import { cn } from '@/lib/utils'

const ProjectPanel = memo(function ProjectPanel({ project }: { project: Project }) {
  return (
    <div data-slot="project-panel" className="grid h-full w-full grid-cols-1 gap-5 [grid-area:1/1]">
      <div className="relative flex flex-col items-center justify-end gap-6 text-center lg:col-span-6 lg:justify-center lg:gap-10">
        <p className="max-w-3xl text-xl leading-snug sm:text-3xl lg:text-3xl lg:leading-normal">
          <span className="font-bold">{project.title} — </span>
          {project.description}
        </p>

        <div className="flex max-w-xl flex-wrap justify-center gap-1.5 lg:gap-3">
          {project.stack.map((skill) => (
            <Tag
              key={skill}
              text={skill}
              className="text-white max-sm:text-[1rem] sm:max-lg:text-xs"
            />
          ))}
        </div>
      </div>
    </div>
  )
})

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { open, hasOpened, rootRef, handlers } = useHoverReveal()
  const activeProject = projects[activeIndex]
  const galleryEnabled = activeProject.galleryEnabled

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
        opacity: 1,
        scale: 0.96,
        force3D: true,
      })
    }

    if (japanese) {
      gsap.set(japanese, {
        opacity: 0,
        y: 50,
      })
    }

    panels.forEach((panel, i) => {
      const isFirst = i === 0

      gsap.set(panel, {
        autoAlpha: isFirst ? 1 : 0,
        y: isFirst ? 0 : 24,
      })

      gsap.set(splits[i].words, {
        opacity: isFirst ? 1 : 0,
      })

      gsap.set(panel.querySelectorAll('.tag'), {
        autoAlpha: isFirst ? 1 : 0,
        y: isFirst ? 0 : 10,
      })
    })

    /*
     * ─────────────────────────────
     * MAIN TIMELINE
     * ─────────────────────────────
     */

    // CSS-sticky pin (see lib/sticky-pin.ts) — no JS transform, so no flicker.
    const projectsSection = document.getElementById('projects')
    const pin = projectsSection ? createStickyPin(projectsSection, (h) => h * 4) : null

    const tl = gsap.timeline({
      scrollTrigger: {
        ...(pin?.vars ?? { trigger: '#projects', start: 'top top', end: '+=400%' }),
        scrub: true,
        invalidateOnRefresh: true,
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
          scale: 1,
          duration: 2,
          ease: 'power2.out',
          force3D: true,
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
      pin?.revert()
    }
  }, [])

  return (
    <section
      id="projects"
      data-section="projects"
      className="relative flex min-h-svh flex-col items-center justify-center gap-4 overflow-x-clip px-5 py-10 sm:px-6 z-900 lg:min-h-svh lg:justify-center lg:gap-10 lg:py-0"
    >
      {/*
        Mobile / tablet: single column  →  image, then description, then tags.
        lg and up: original 9-column layout.
      */}
      <div className="relative grid w-full grid-cols-1 items-center gap-5 lg:grid-cols-9">
        {/* max-lg:z-10 lifts the image column (title + image) above the Japanese text on small screens */}
        <div className="relative flex flex-col items-end justify-between gap-5 lg:col-span-6">
          <h1
            className="absolute start-0 top-0 sm:-rotate-30 text-transparent max-sm:text-6xl sm:max-lg:start-6 sm:max-lg:text-8xl lg:start-20 lg:top-20 xl:text-[9.375rem]"
            style={{
              WebkitTextStroke: '3px var(--foreground)',
            }}
          >
            Projects
          </h1>

          <div className="relative flex w-full justify-center pt-16 sm:pt-20 lg:justify-end lg:pe-20 lg:pt-0">
            <div
              data-slot="project-image"
              className="w-full max-w-xl will-change-[transform,opacity] lg:w-auto lg:max-w-none"
            >
              <CyberFrame
                ref={rootRef}
                role={galleryEnabled ? 'group' : undefined}
                tabIndex={galleryEnabled ? 0 : undefined}
                aria-label={galleryEnabled ? `${activeProject.title} screenshots` : undefined}
                {...(galleryEnabled ? handlers : {})}
                className="h-[32svh] w-full overflow-hidden lg:h-100 lg:w-2xl"
                contentClassName="p-0"
                stroke="transparent"
                strokeWidth={0}
                chamferX={54}
                chamferY={54}
              >
                <div
                  data-slot="cyber-image-viewport"
                  className="relative h-full w-full overflow-hidden"
                  style={{
                    clipPath: cyberFrameClip(54, 54),
                  }}
                >
                  {projects.map((project, idx) => (
                    <img
                      key={project.title}
                      src={project.image}
                      alt={project.title}
                      loading="eager"
                      decoding="async"
                      draggable={false}
                      className={cn(
                        'absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out',
                        idx === activeIndex
                          ? 'opacity-100 z-10'
                          : 'opacity-0 z-0 pointer-events-none'
                      )}
                    />
                  ))}
                </div>
                {galleryEnabled && (
                  <ProjectGallery
                    key={activeProject.slug}
                    title={activeProject.title}
                    images={activeProject.gallery}
                    open={open}
                    mounted={hasOpened}
                  />
                )}
              </CyberFrame>
            </div>
          </div>

          {/* On small screens this block takes all remaining height so description and tags spread out */}
          <div className="grid w-full flex-1">
            {projects.map((project) => (
              <ProjectPanel key={project.title} project={project} />
            ))}
          </div>
        </div>

        {/* Japanese text: tucked behind the image on small screens, own column on lg+ */}
        <div
          data-slot="projects-japanese"
          className="pointer-events-none absolute top-5 -right-2 text-center sm:-top-6 lg:pointer-events-auto lg:relative lg:top-auto lg:right-auto lg:col-span-3"
        >
          <h1
            className="font-bold text-transparent hidden lg:block text-[20rem] [writing-mode:vertical-rl]"
            style={{
              WebkitTextStroke: '6px var(--accent)',
            }}
          >
            最強
          </h1>
          <JapaneseText
            text="最強"
            className="text-[4.375rem] sm:font-bold sm:text-[10.625rem] lg:hidden"
            color="var(--accent)"
            border
          />
        </div>
      </div>
    </section>
  )
}
