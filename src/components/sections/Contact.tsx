import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { JapaneseText } from "../ui/japanese-text";

const inputClasses = "placeholder:text-2xl xl:text-2xl font-universa py-10"

export function Contact() {
  return (
    <section
      id="contact"
      data-section="contact"
      className="flex min-h-screen flex-col items-center justify-center gap-3 px-6"
    >
      <div className="grid grid-cols-9 gap-5">

        <div className="col-span-5 flex justify-center flex-col gap-5 px-10">
          <h1 className="text-start\ xl:text-8xl">Let’s Work Together</h1>

          <div className="">
            <Input type="text" placeholder="Full Name" className={inputClasses} />
            <Input type="email" placeholder="Email" className={inputClasses} />
            <Input type="text" variant={"textarea"} placeholder="Tell me about your project" className={inputClasses} />
          </div>

          <Button className="text-3xl px-10 py-7 mt-5 w-fit text-white" strokeWidth={0} fill={"var(--accent)"}>Take Off</Button>
        </div>
        <div className="col-span-4 my-auto text-center">
          <JapaneseText text="未来" className="text-[350px] font-inter font-bold stroke-accent [writing-mode:vertical-rl]" color="var(--accent)" border />
        </div>

      </div>

    </section>
  )
}
