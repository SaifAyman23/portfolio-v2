import PixelBlast from '@/components/PixelBlast'
import { JapaneseText } from '@/components/ui/japanese-text'

import { HeroBlurb } from './HeroBlurb'
import { HeroInfo } from './HeroInfo'

const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function Hero() {
  return (
    <section
      id="hero"
      data-section="hero"
      className="relative flex min-h-screen flex-col items-center justify-center gap-3 px-6"
    >
      <HeroInfo className={`flex xl:absolute text-foreground -start-50 xl:rotate-90 gap-2 z-30`} />
      {!reduceMotion && (
        <div className="absolute z-0 h-full w-full opacity-30">
          <PixelBlast
            variant="circle"
            pixelSize={4}
            color="#b50000"
            patternScale={4}
            patternDensity={1}
            pixelSizeJitter={2}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid={false}
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={2}
            edgeFade={0.25}
            transparent
          />
        </div>
      )}

      <div className="z-10 mb-20 flex flex-col">
        <JapaneseText text="サイフ" className="ms-15 -mb-5 text-5xl font-bold text-accent" />

        <h1 className="text-center xl:text-9xl">Saif Eldin</h1>

        <div className="relative text-end font-ticking">
          <h2 className="absolute -end-20 text-accent xl:text-3xl">Full-Stack Engineer</h2>
        </div>
      </div>

      <div className="grid h-[50vh] grid-cols-8 gap-3 xl:px-60">
        <div className="col-span-2 text-start">
          <HeroBlurb />
        </div>
        <div className="col-span-4 text-center">
          <JapaneseText
            text="ケン"
            border
            className="text-[250px] font-bold text-foreground [writing-mode:vertical-rl]"
          />
        </div>
        <div className="col-span-2 flex h-full flex-col justify-end text-start">
          <HeroBlurb />
        </div>
      </div>
    </section>
  )
}
