import { Zap, ZapOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// import { SECTIONS } from '@/config/sections'

const SITE_URL = 'https://saifayman23.github.io/portfolio/v2/82aef4670d91c655bab1e9f5f3e3f536/'

// const LEVEL_BY_SECTION: Record<string, string> = {
//   hero: '0',
//   about: '1',
//   experience: '2',
//   projects: '3',
//   tools: '4',
//   contact: '5',
//   footer: '✕',
// }

const SECTION_IDS = ['hero', 'about', 'experience', 'projects', 'tools', 'contact', 'footer']

export function MobileScreen() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [, setSectionId] = useState('hero')
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  )

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const compute = () => {
      try {
        const doc = iframe.contentDocument
        const win = iframe.contentWindow
        if (!doc || !win) return
        const line = win.innerHeight * 0.4
        let current = 'hero'
        for (const id of SECTION_IDS) {
          const section = doc.getElementById(id)
          if (!section) continue
          if (section.getBoundingClientRect().top <= line) current = id
        }
        setSectionId(current)
      } catch {
        /* cross-origin iframe: keep last known section */
      }
    }

    const attach = () => {
      try {
        iframe.contentWindow?.addEventListener('scroll', compute, { passive: true })
      } catch {
        /* cross-origin iframe: keep last known section */
      }
    }

    const onLoad = () => {
      attach()
      compute()
    }
    iframe.addEventListener('load', onLoad)
    compute()
    const id = window.setInterval(compute, 1500)
    return () => {
      window.clearInterval(id)
      iframe.removeEventListener('load', onLoad)
      try {
        iframe.contentWindow?.removeEventListener('scroll', compute)
      } catch {
        /* cross-origin iframe: nothing to detach */
      }
    }
  }, [])

  // const label = SECTIONS.find((section) => section.id === sectionId)?.label ?? sectionId
  // const level = LEVEL_BY_SECTION[sectionId] ?? '0'

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white">
      <div className="absolute top-1/2 left-1/2 grid h-[100dvw] w-[100dvh] -translate-x-1/2 -translate-y-1/2 rotate-90 grid-cols-1 items-center justify-center gap-4 p-4 sm:static sm:h-full sm:w-full sm:translate-x-0 sm:translate-y-0 sm:rotate-0 sm:p-8">
        {/* <div className="flex h-full flex-col items-center justify-between overflow-hidden py-10 sm:hidden">
          <p className="font-ticking text-md tracking-[0.3em] text-white/60">Level</p>
          <p className="font-cyberform text-[96px] leading-none text-white">{level}</p>
          <p className="mt-2 font-ticking text-md tracking-[0.2em] text-accent">{label}</p>
        </div> */}
        <div className="flex h-full w-full items-center justify-center">
          <div className="relative h-full w-full overflow-hidden rounded-2xl">
            <iframe
              ref={iframeRef}
              title="Saif Eldin Ayman portfolio desktop preview"
              src={reduced ? `${SITE_URL}?reduce_motion=true` : SITE_URL}
              className="absolute inset-0 h-full w-full"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setReduced((prev) => !prev)}
        aria-pressed={reduced}
        title="Toggle reduced motion"
        className="fixed right-4 bottom-4 z-50 hidden h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/70 text-white sm:flex"
      >
        {reduced ? <ZapOff className="size-4" /> : <Zap className="size-4" />}
      </button>
    </div>
  )
}
