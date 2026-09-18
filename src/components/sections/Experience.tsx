import bg from "@/assets/img/shinjuku-train.webp"
import { CyberImage } from "../ui/cyber-image"

export function Experience() {
  return (
    <section
      id="experience"
      className="relative min-h-screen bg-black"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="relative w-full h-120 overflow-hidden">
          <img
            src={bg}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />

          <h1
            className="absolute inset-0 flex items-center justify-center text-transparent xl:text-[200px]"
            style={{
              WebkitTextStroke: "3px var(--muted-foreground)",
            }}
          >
            Experience
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-50 px-4">

        <div className="text-start max-w-300">
          <p className="text-4xl text-white">
            I have experience in web development, software engineering, and data
            analysis. I have experience in web development, software engineering, and data
            analysis.
          </p>
        </div>

        <div className="w-2/3 flex justify-end">
          <CyberImage src={bg} alt="some image" strokeWidth={0} stroke="transparent" frameClassName="w-50 h-40" />
        </div>
      </div>
    </section>
  )
}
