import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { JapaneseText } from '@/components/ui/japanese-text'
import { prefersReducedMotion } from '@/lib/motion'

const inputClasses = 'placeholder:text-2xl xl:text-2xl font-universa py-10'

export function Contact() {
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const splitText = SplitText.create('#contact h1', {
        type: 'lines, words, chars',
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
      })

      const splitJapText = SplitText.create('#contact-japanese-text', {
        type: 'lines, words, chars',
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#contact',
          start: 'top top',
          end: '+=2500',
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      })

      gsap.set('#button', {
        opacity: 0,
        filter: 'blur(10px)',
        x: 100,
      })

      tl.from(splitText.chars, {
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.2,
        stagger: 1,
      })
        .from(['#contact input, #contact textarea'], {
          opacity: 0,
          filter: 'blur(10px)',
          x: 100,
          duration: 1,
          stagger: 0.2,
        })
        .to('#button', {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'none',
        })
        .from(splitJapText.chars, {
          opacity: 0,
          filter: 'blur(10px)',
          stagger: 1,
          duration: 2,
        })
    },
    { dependencies: [] }
  )

  return (
    <section
      id="contact"
      data-section="contact"
      className="flex min-h-screen flex-col items-center justify-center gap-3 px-6"
    >
      <div className="grid grid-cols-9 gap-5">
        <div className="col-span-5 flex justify-center flex-col gap-5 px-10">
          <h1 className="text-start xl:text-8xl">Let’s Work Together</h1>

          <div>
            <Input type="text" placeholder="Full Name" className={inputClasses} />
            <Input type="email" placeholder="Email" className={inputClasses} />
            <Input
              type="text"
              variant="textarea"
              placeholder="Tell me about your project"
              className={inputClasses}
            />
          </div>

          <Button
            className="text-3xl px-10 py-7 mt-5 w-fit text-white"
            strokeWidth={0}
            id="button"
            fill="var(--accent)"
          >
            Take Off
          </Button>
        </div>
        <div className="col-span-4 my-auto text-center">
          <JapaneseText
            id="contact-japanese-text"
            text="未来"
            className="text-[350px] font-inter font-bold [writing-mode:vertical-rl]"
            color="var(--accent)"
            border
          />
        </div>
      </div>
    </section>
  )
}
