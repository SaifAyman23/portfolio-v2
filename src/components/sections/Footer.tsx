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

export function Footer() {
  const [expanded, setExpanded] = useState(false)
  const btnRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLButtonElement>(null)

  useGSAP(
    () => {
      if (!btnRef.current) return
      gsap.to(btnRef.current, {
        // never wider than the screen (16px margin on each side)
        width: expanded ? Math.min(360, window.innerWidth - 32) : 56,
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

  useGSAP(() => {
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
      aria: 'none',
    })

    const splitName = SplitText.create(name, {
      type: 'chars',
      aria: 'none',
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
  }, [])

  return (
    <section
      id="footer"
      data-section="footer"
      className="relative flex h-svh flex-col items-center justify-center gap-3 overflow-hidden lg:h-screen"
    >
      <div className="absolute inset-0 z-10">
        <img
          src={bg}
          className="h-full w-full object-cover"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>

      {/*
        Japanese text.
        Small screens: written vertically (サ / イ / フ stacked) so it fills the tall screen;
        sized by whichever is smaller, the width or a third of the height.
        lg and up: original horizontal 590px text.
      */}
      <div className="z-20 flex h-full w-full items-center justify-center bg-red-900 mix-blend-multiply">
        <JapaneseText
          id="footer-japanese"
          text={'サイフ'}
          className="text-[length:min(60vw,22svh)] font-bold text-blue-700 max-lg:leading-none max-lg:[writing-mode:vertical-rl] lg:text-[590px]"
        />
      </div>

      <div
        className="blurred-overlay absolute inset-0 z-20 backdrop-blur-xl"
        style={{
          maskImage:
            'radial-gradient(ellipse 60% 45% at center, transparent 15%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.6) 65%, black 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 45% at center, transparent 15%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.6) 80%, black 100%)',
        }}
      />

      {/* Name: two lines (Saif / Eldin) on small screens, one line on lg+ */}
      <div className="absolute z-20 flex h-full w-full items-center justify-center px-4 lg:px-0">
        <h1 className="name font-ticking text-center text-white max-lg:text-[30vw] max-lg:leading-[0.9] lg:text-[300px]">
          Saif <br className="lg:hidden" />
          Eldin
        </h1>
      </div>

      <HeroInfo
        dataSlot={'footer-info'}
        className="info bottom-20 z-60 flex gap-2 *:text-white max-xl:absolute max-xl:inset-x-4 max-xl:bottom-24 max-xl:flex-wrap max-xl:justify-center xl:absolute"
        fill="black"
      />

      <CyberFrame
        ref={btnRef}
        className="absolute right-4 bottom-6 z-50 overflow-hidden sm:right-10"
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
          aria-expanded={expanded}
          onClick={() => setExpanded(true)}
          className="absolute inset-0 flex cursor-pointer items-center justify-center text-white"
        >
          <GiCyberEye className="size-5" />
        </button>
        <div
          ref={contentRef}
          className="absolute inset-0 flex items-center justify-between gap-3 px-4"
        >
          <p className="text-xs whitespace-nowrap text-white sm:text-sm">
            Not your aesthetic? What about{' '}
            <a
              href="https://saifayman23.github.io/portfolio/"
              target="_blank"
              rel="noopener noreferrer"
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
