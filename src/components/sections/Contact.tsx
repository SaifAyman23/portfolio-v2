import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import { useEffect, useMemo, useState } from 'react'

import { CyberFrame } from '../ui/cyber-frame'

import { useNearView } from '@/hooks/useNearView'
import { splitFull, splitWords } from '@/lib/motion'
import { queueScrollRefresh } from '@/lib/scroll-refresh'

gsap.registerPlugin(Observer)

/** How many shapes to show on small screens (12 per row → 4 rows). */
const MOBILE_SHAPES = 48

/** True from the `lg` breakpoint (1024px) and up. */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => setIsDesktop(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isDesktop
}

export function Contact() {
  const isDesktop = useIsDesktop()
  const setupReady = useNearView('contact', { rootMargin: '1200px', initial: false, once: true })

  const fills = useMemo(() => {
    const total = 100
    const whiteCount = Math.floor((total * 4) / 7)
    const blackCount = Math.floor((total * 2) / 7)
    const accentCount = total - whiteCount - blackCount
    const arr: string[] = [
      ...Array(whiteCount).fill('white'),
      ...Array(blackCount).fill('black'),
      ...Array(accentCount).fill('var(--accent)'),
    ]
    let seed = 12345
    const rand = (): number => {
      seed = (seed * 9301 + 29297) % 233280
      return seed / 233280
    }
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    for (let row = 6; row < 8; row++) {
      for (let col = 0; col < 4; col++) {
        const idx = row * 12 + col
        if (idx < arr.length) arr[idx] = 'white'
      }
    }
    return arr
  }, [])

  useGSAP(
    () => {
      if (!setupReady) return
      const p = document.querySelector<HTMLElement>('#contact p')
      const frames = gsap.utils.toArray<HTMLElement>('#contact .size-1\\/12')
      const h1 = document.querySelector<HTMLElement>('#contact h1')
      if (!p || !h1 || frames.length === 0) return

      const splitP = splitWords(p)

      const splitH1 = splitFull(h1)

      gsap.set(splitP.chars, { opacity: 0, y: 20 })
      gsap.set(frames, { opacity: 0, scale: 0.96 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 90%',
          end: 'bottom 120%',
          scrub: true,
          toggleActions: 'play none none reverse',
        },
      })

      tl.to(splitP.chars, {
        opacity: 1,
        y: 0,
        stagger: 0.02,
        duration: 0.6,
        ease: 'steps(1)',
      }).to(
        frames,
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: { amount: 0.9, from: 'random' },
          ease: 'none',
        },
        '<0.15'
      )

      gsap.set(splitH1.chars, { opacity: 0, y: 20 })

      gsap.to(splitH1.chars, {
        opacity: 1,
        y: 0,
        stagger: 0.02,
        duration: 0.8,
        ease: 'steps(1)',
        scrollTrigger: {
          trigger: h1,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      })

      const observers = frames.map((frame) =>
        Observer.create({
          target: frame,
          type: 'pointer',
          onHover: () =>
            gsap.to(frame, {
              scale: 0.75,
              duration: 0.01,
              ease: 'steps(1)',
              overwrite: 'auto',
            }),
          onHoverEnd: () =>
            gsap.to(frame, {
              scale: 1,
              duration: 0.01,
              ease: 'steps(1)',
              overwrite: 'auto',
            }),
        })
      )

      queueScrollRefresh()

      return () => {
        splitP.revert()
        splitH1.revert()
        observers.forEach((o) => o.kill())
      }
    },
    { dependencies: [isDesktop, setupReady] }
  )

  return (
    <section
      id="contact"
      data-section="contact"
      className="relative z-70 flex min-h-screen grid-cols-2 items-center justify-center gap-3 px-6 max-lg:flex-col max-lg:items-stretch max-lg:justify-start max-lg:gap-6 max-lg:py-10 lg:grid"
    >
      <div className="start-0 bottom-0 z-20 flex flex-col flex-1 justify-between gap-6 lg:h-full lg:gap-0">
        <div className="h-auto w-full bg-white p-5 sm:p-8 lg:h-2/3 lg:w-4/6 lg:p-10">
          <p className="max-w-4xl text-start text-xl sm:text-xl lg:text-base xl:text-5xl">
            You bring the vision, I’ll own the build. From architecture to launch, turning your
            project into a live service that holds, scales, and ships.
          </p>
        </div>
        <h1
          className="max-w-7xl text-start max-sm:text-5xl sm:max-lg:text-7xl lg:m-10 xl:text-9xl"
          style={{ WebkitTextStroke: '2px var(--foreground)' }}
        >
          Let’s Work Together
        </h1>
      </div>

      {/*
        Small screens: the shapes fill the full width below the text (12 per row, no gaps).
        lg and up: original layout.
      */}
      <div className="flex h-auto w-full flex-wrap content-start gap-0 p-0 max-lg:order-first lg:h-full lg:w-auto lg:gap-3 lg:p-10">
        {(isDesktop ? fills : fills.slice(0, MOBILE_SHAPES)).map((fill, i) => (
          <CyberFrame
            key={i}
            className="size-1/12 hover:scale-75 max-lg:aspect-square max-lg:h-auto"
            chamferX={isDesktop ? 40 : 14}
            chamferY={isDesktop ? 30 : 12}
            strokeWidth={0}
            stroke="transparent"
            fill={fill}
          />
        ))}
      </div>
    </section>
  )
}
