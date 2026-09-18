import { CyberImage } from "../ui/cyber-image";
import { JapaneseText } from "../ui/japanese-text";

export function About() {
  return (
    <section
      id="about"
      data-section="about"
      className="bg-black grid grid-cols-6 min-h-screen flex-col items-center justify-center gap-3 px-6"
    >
      <div className="col-span-2 flex ">
        <h1
         className="text-[330px] font-inter break-keep font-bold rotate-90 stroke-accent text-transparent"
         style={{ WebkitTextStroke: `3px var(--accent)` }}>
          進化
        </h1>
      </div>
      <div className="flex col-span-4 flex-col mb-20 z-10 gap-10">

        <h1 className="text-start text-white xl:text-9xl">About</h1>

        <div className="flex flex-col gap-10">
          <div className="flex w-full items-center gap-20">
            <div>
              <p className="text-white max-w-2xl xl:text-2xl">
              Two years of building the whole stack. ERPs, delivery platforms, AI tools, live-streaming infra. Django under the hood, React where it counts, real-time by default.
              </p>
            </div>
            <div className="w-50">
              <CyberImage src="/images/saifeldin.jpg" alt="Saif Eldin" width={200} height={200} />
            </div>
          </div>
          <div className="flex w-full items-center gap-20">
            <div className="w-50">
              <CyberImage src="/images/saifeldin.jpg" alt="Saif Eldin" width={200} height={200} />
            </div>
            <div>
              <p className="text-white max-w-2xl xl:text-2xl">
              Two years of building the whole stack. ERPs, delivery platforms, AI tools, live-streaming infra. Django under the hood, React where it counts, real-time by default.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
