import { useState } from 'react'

import cityImg from '@/assets/img/city.webp'
import download1Img from '@/assets/img/download-1.webp'
import downloadImg from '@/assets/img/download.webp'
import shinjukuImg from '@/assets/img/shinjuku-train.webp'
import { CyberImage } from '@/components/ui/cyber-image'

const experiences = [
  {
    description:
      'I have experience in web development, software engineering, and data analysis. I have experience in web development, software engineering, and data analysis.',
    image: shinjukuImg,
  },
  {
    description:
      'Full-stack development with Django and React, building scalable APIs and interactive user interfaces for modern web applications.',
    image: cityImg,
  },
  {
    description:
      'Data analysis and visualization, building dashboards and automated reporting pipelines to extract insights from complex datasets.',
    image: download1Img,
  },
]

export function Experience() {
  const [activeIndex, setActiveIndex] = useState(0)

  const experience = experiences[activeIndex]

  return (
    <section id="experience" data-section="experience" className="relative min-h-screen bg-black">
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="relative w-full h-120 overflow-hidden">
          <img src={experience.image} alt="" className="w-full h-full object-cover opacity-30" />

          <h1
            className="absolute inset-0 flex items-center justify-center text-transparent xl:text-[200px]"
            style={{
              WebkitTextStroke: '3px var(--muted-foreground)',
            }}
          >
            Experience
          </h1>
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-50 px-4">
        <div className="text-start max-w-300">
          <p className="text-4xl text-white">{experience.description}</p>
          <p className="text-xl text-accent mt-5">{experience.title}</p>
          <p className="text-lg text-muted-foreground mt-2">{experience.period}</p>
        </div>

        <div className="w-2/3 flex justify-end">
          <CyberImage
            src={experience.image}
            alt={experience.title}
            strokeWidth={0}
            stroke="transparent"
            frameClassName="w-50 h-40"
          />
        </div>
      </div>
    </section>
  )
}
