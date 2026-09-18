import { HeroInfo } from './HeroInfo'

import bg from '@/assets/img/download-1.webp'
import { JapaneseText } from '@/components/ui/japanese-text'

export function Footer() {
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
        <JapaneseText text={'サイフ'} className="text-blue-800 text-[590px] font-bold" />
      </div>
      <div
        className="absolute inset-0 z-20 backdrop-blur-xl"
        style={{
          maskImage:
            'radial-gradient(ellipse 60% 45% at center, transparent 15%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.6) 65%, black 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 45% at center, transparent 15%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.6) 80%, black 100%)',
        }}
      />
      <div className="w-full z-20 h-full flex items-center justify-center absolute">
        <h1 className="text-[300px] font-ticking text-white">Saif Eldin</h1>
      </div>

      <HeroInfo className="flex gap-2 *:text-white bottom-20 z-30 xl:absolute" fill="black" />
    </section>
  )
}
