import { Button } from "../ui/button";
import { JapaneseText } from "../ui/japanese-text"
import PixelBlast from '@/components/PixelBlast';
import { email, github, linkedin, resume } from '@/constants/info';

type InfoProps = {
  className?: string;
  fill?: string;
  stroke?: string;
}

export const Info = ({ className, stroke, fill }: InfoProps) => {
  return (
    <div className={className}>
      <Button className="xl:text-lg px-8" strokeWidth={3} stroke={stroke ?? "black"} fill={fill ?? "white"}>
        <a href={email} target="_blank" rel="noopener noreferrer">Email</a>
      </Button>

      <Button className="xl:text-lg px-8" strokeWidth={3} stroke={stroke ?? "black"} fill={fill ?? "white"}>
        <a href={github} target="_blank" rel="noopener noreferrer">GitHub</a>
      </Button>

      <Button className="xl:text-lg px-8" strokeWidth={3} stroke={stroke ?? "black"} fill={fill ?? "white"}>
        <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </Button>

      <Button className="xl:text-lg px-8" strokeWidth={3} stroke={stroke ?? "black"} fill={fill ?? "white"}>
        <a href={resume} target="_blank" rel="noopener noreferrer">Resume</a>
      </Button>
    </div>
  )
}

export function Hero() {
  return (
    <section
      id="hero"
      data-section="hero"
      className="flex min-h-screen relative flex-col items-center justify-center gap-3 px-6"
    > 
      <Info className={`flex xl:absolute text-foreground -start-50 xl:rotate-90 gap-2 z-10`}/>
      <div className="w-full h-full absolute z-0 opacity-30">
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

      <div className="flex flex-col mb-20 z-10">
        <JapaneseText
          text="サイフ"
          className="font-bold text-accent text-5xl ms-15 -mb-5"
        />

        <h1 className="text-center xl:text-9xl">Saif Eldin</h1>

        <div className="text-end font-ticking relative">
          <h2 className="absolute -end-20 xl:text-3xl text-accent">
            Full-Stack Engineer
          </h2>
        </div>
      </div>

      <div className="grid h-[50vh] grid-cols-8 xl:px-60 gap-3">
        <div className="text-start col-span-2">
          <p className="">
            I am a Full-Stack Engineer with a passion for building scalable and
            efficient web applications. I have experience in both front-end and
            back-end development, and I enjoy working on projects that challenge
            me to learn new technologies and improve my skills.
          </p>
        </div>
        <div className="text-center col-span-4">
          <JapaneseText
            text="ケン"
            border
            className="font-bold text-foreground text-[250px] [writing-mode:vertical-rl]"
          />
        </div>
        <div className="text-start col-span-2 h-full flex flex-col justify-end">
          <p className="">
            I am a Full-Stack Engineer with a passion for building scalable and
            efficient web applications. I have experience in both front-end and
            back-end development, and I enjoy working on projects that challenge
            me to learn new technologies and improve my skills.
          </p>
        </div>
      </div>

    </section>
  )
}
