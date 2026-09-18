import { AboutRow } from './AboutRow'

export function About() {
  return (
    <section
      id="about"
      data-section="about"
      className="grid min-h-screen grid-cols-6 flex-col items-center justify-center gap-3 bg-black px-6"
    >
      <div className="col-span-2 flex">
        <h1
          className="rotate-90 break-keep text-[330px] font-bold text-transparent font-inter"
          style={{ WebkitTextStroke: `3px var(--accent)` }}
        >
          進化
        </h1>
      </div>
      <div className="z-10 col-span-4 mb-20 flex flex-col gap-10">
        <h1 className="text-start text-white xl:text-9xl">About</h1>

        <div className="flex flex-col gap-10">
          <AboutRow />
          <AboutRow flip />
        </div>
      </div>
    </section>
  )
}
