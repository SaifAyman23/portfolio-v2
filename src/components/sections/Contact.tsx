import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import { SplitText } from 'gsap/SplitText'
import { useMemo } from 'react'

import { CyberFrame } from '../ui/cyber-frame'

import { prefersReducedMotion } from '@/lib/motion'

gsap.registerPlugin(Observer)

export function Contact() {
   
   
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
      if (prefersReducedMotion()) return

      const p = document.querySelector<HTMLElement>('#contact p')
      const frames = gsap.utils.toArray<HTMLElement>('#contact .size-1\\/12')
      const h1 = document.querySelector<HTMLElement>('#contact h1')
      if (!p || !h1 || frames.length === 0) return

      const splitP = SplitText.create(p, {
        type: 'lines, words, chars',
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
      })

      const splitH1 = SplitText.create(h1, {
        type: 'lines, words, chars',
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
      })

      gsap.set(splitP.chars, { opacity: 0, y: 20 })
      gsap.set(frames, { opacity: 0, filter: 'blur(10px)', scale: 0.96 })

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
          filter: 'blur(0px)',
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

      return () => {
        splitP.revert()
        splitH1.revert()
        observers.forEach((o) => o.kill())
      }
    },
    { dependencies: [] }
  )

  return (
    <section
      id="contact"
      data-section="contact"
      className="grid grid-cols-2 min-h-screen flex items-center relative z-70 justify-center gap-3 px-6"
    >
      <div className='h-full bottom-0 start-0 flex flex-col justify-between z-20'>
        <div className='w-4/6 bg-white h-2/3 p-10'>
          <p className="text-start max-w-4xl xl:text-5xl">
            You bring the vision, I’ll own the build. From architecture to launch, turning your
            project into a live service that holds, scales, and ships.
          </p>
        </div>
        <h1 className="text-start m-10 max-w-7xl xl:text-9xl" style={{ WebkitTextStroke: '2px white' }}>Let’s Work Together</h1>
      </div>
      <div className="flex flex-wrap h-full p-10 content-start gap-3">
        {fills.map((fill, i) => (
          <CyberFrame
            key={i}
            className="size-1/12 hover:scale-75"
            chamferX={40}
            chamferY={30}
            strokeWidth={0}
            stroke="transparent"
            fill={fill}
          />
        ))}
      </div>
    </section>
  )
}
