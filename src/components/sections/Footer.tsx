import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

import { HeroInfo } from './HeroInfo'

import bg from '@/assets/img/download-1.webp'
import { JapaneseText } from '@/components/ui/japanese-text'
import { prefersReducedMotion } from '@/lib/motion'

export function Footer() {
  useGSAP(() => {
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
      filter: 'blur(8px)',
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        toggleActions: 'play none none reverse',
        trigger: '#footer',
        start: 'top top',
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
      filter: 'blur(10px)',
      stagger: {
        amount: 0.2,
        from: 'center',
      },
      duration: 0.2,
    })

    tl.from(splitName.chars, {
      opacity: 0,
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
      filter: 'blur(0px)',
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
    </section>
  )
}
