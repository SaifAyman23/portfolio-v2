import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { X } from 'lucide-react'
import { useRef, useState } from 'react'
import { GiCyberEye } from 'react-icons/gi'

import { HeroInfo } from './HeroInfo'

import bg from '@/assets/img/download-1.webp'
import { CyberFrame } from '@/components/ui/cyber-frame'
import { JapaneseText } from '@/components/ui/japanese-text'
import { prefersReducedMotion } from '@/lib/motion'

export function Footer() {
  const [expanded, setExpanded] = useState(false)
  const btnRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLButtonElement>(null)

  useGSAP(
    () => {
      if (!btnRef.current) return
      if (prefersReducedMotion()) {
        gsap.set(btnRef.current, {
          width: expanded ? 360 : 56,
        })
        if (iconRef.current)
          gsap.set(iconRef.current, { scale: expanded ? 0 : 1, autoAlpha: expanded ? 0 : 1 })
        if (contentRef.current)
          gsap.set(contentRef.current, { autoAlpha: expanded ? 1 : 0, x: expanded ? 0 : -8 })
        return
      }
      gsap.to(btnRef.current, {
        width: expanded ? 360 : 56,
        duration: 0.6,
        ease: 'expo.inOut',
        overwrite: 'auto',
      })
      if (iconRef.current) {
        gsap.to(iconRef.current, {
          scale: expanded ? 0 : 1,
          autoAlpha: expanded ? 0 : 1,
          duration: 0.25,
          ease: 'power2.inOut',
          overwrite: 'auto',
        })
      }
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          autoAlpha: expanded ? 1 : 0,
          x: expanded ? 0 : -8,
          duration: 0.35,
          delay: expanded ? 0.15 : 0,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }
    },
    { dependencies: [expanded] }
  )

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const japanese = document.querySelector('#footer-japanese')
      const name = document.querySelector('.name')
      const overlay = document.querySelector('.blurred-overlay')
      const info = document.querySelector('[data-slot="footer-info"]')

      if (!japanese || !name || !info) {
        return
      }

      const infoItems = Array.from(info.children)

      const splitJap = SplitText.create(japanese, {
        type: 'chars',
      })

      const splitName = SplitText.create(name, {
        type: 'chars',
      })

      gsap.set(infoItems, {
        opacity: 0,
        y: 20,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          toggleActions: 'play none none reverse',
          trigger: '#footer',
          start: 'top 5%',
          end: 'bottom bottom',
          // scrub: true,
        },
      })

      tl.from(overlay, {
        opacity: 0,
        stagger: {
          amount: 1,
          from: 'center',
        },
      })

      tl.from(splitJap.chars, {
        opacity: 0,
        y: 16,
        stagger: {
          amount: 0.2,
          from: 'center',
        },
        duration: 0.2,
      })

      tl.from(splitName.chars, {
        opacity: 0,
        y: 16,
        stagger: {
          amount: 0.4,
          from: 'start',
        },
        duration: 0.5,
        delay: 0.5,
        ease: 'steps(1)',
      })

      tl.to(infoItems, {
        opacity: 1,
        stagger: 0.2,
        y: 0,
        duration: 0.2,
      })

    return () => {
      splitJap.revert()
      splitName.revert()
    }
    },
    []
  )

  return (
    <section
      id="footer"
      data-section="footer"
      className="flex h-screen flex-col items-center relative justify-center overflow-hidden gap-3"
    >
      <div className="absolute w-full z-10">
        <img src={bg} className="w-full object-cover" alt="background image" />
      </div>
      <div className="w-full z-20 h-full flex items-center justify-center bg-red-900 mix-blend-multiply">
        <JapaneseText
          id="footer-japanese"
          text={'サイフ'}
          className="text-blue-800 text-[590px] font-bold"
        />
      </div>
      <div
        className="absolute blurred-overlay inset-0 z-20 backdrop-blur-xl"
        style={{
          maskImage:
            'radial-gradient(ellipse 60% 45% at center, transparent 15%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.6) 65%, black 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 45% at center, transparent 15%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.6) 80%, black 100%)',
        }}
      />
      <div className="w-full z-20 h-full flex items-center justify-center absolute">
        <h1 className="text-[300px] name font-ticking text-white">Saif Eldin</h1>
      </div>

      <HeroInfo
        dataSlot={'footer-info'}
        className="flex gap-2 info *:text-white bottom-20 z-60 xl:absolute"
        fill="black"
      />

      <CyberFrame
        ref={btnRef}
        className="absolute bottom-6 right-10 z-50 overflow-hidden"
        style={{ width: 56, height: 56 }}
        fill="black"
        stroke="transparent"
        strokeWidth={0}
        chamferX={12}
        chamferY={12}
        contentClassName="flex h-full w-full items-center justify-center p-0"
      >
        <button
          ref={iconRef}
          type="button"
          aria-label="Open alternative aesthetic"
          onClick={() => setExpanded(true)}
          className="absolute inset-0 flex cursor-pointer items-center justify-center text-white"
        >
          <GiCyberEye className="size-5" />
        </button>
        <div
          ref={contentRef}
          className="absolute inset-0 flex items-center justify-between gap-3 px-4"
        >
          <p className="whitespace-nowrap text-sm text-white">
            Not your aesthetic? What about{' '}
            <a
              href="https://saifayman23.github.io/portfolio/"
              target="_blank"
              className="underline decoration-white underline-offset-4"
            >
              this
            </a>
            .
          </p>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setExpanded(false)}
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-black"
          >
            <X className="size-4" />
          </button>
        </div>
      </CyberFrame>
    </section>
  )
}
