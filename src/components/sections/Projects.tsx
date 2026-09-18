import bg from '@/assets/img/shinjuku-train.webp'
import { CyberImage } from '@/components/ui/cyber-image'
import { JapaneseText } from '@/components/ui/japanese-text'
import { Tag } from '@/components/ui/tag'

const skills = {
  go: ['Django', 'PostgresQL', 'Redis', 'Celery', 'React'],
}

export function Projects() {
  return (
    <section
      id="projects"
      data-section="projects"
      className="flex relative min-h-screen flex-col items-center justify-center gap-10 px-6"
    >
      <div className="grid grid-cols-9 gap-5 w-full">
        <div className="relative col-span-6">
          <h1
            className="absolute start-20 top-20 -rotate-30 text-transparent xl:text-[150px]"
            style={{
              WebkitTextStroke: '3px var(--foreground)',
            }}
          >
            Projects
          </h1>

          <div className="flex justify-end pe-20">
            <CyberImage
              src={bg}
              alt="some image"
              strokeWidth={0}
              stroke="transparent"
              frameClassName="w-2xl h-100"
            />
          </div>
        </div>

        <div className="relative col-span-3 text-center">
          <JapaneseText text="最強" border className="font-bold text-accent text-[250px]" />
        </div>
      </div>

      <div className="grid grid-cols-9 gap-5 w-full">
        <div className="relative text-center flex flex-col justify-center items-center col-span-6 gap-10">
          <p className="text-3xl max-w-3xl">
            I have experience in web development, software engineering, and data analysis. I have
            experience in web development, software engineering, and data analysis.
          </p>

          <div className="flex max-w-xl flex-wrap justify-center gap-3">
            {skills.go.map((skill) => (
              <Tag key={skill} text={skill} className="text-white" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
