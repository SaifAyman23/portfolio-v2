import { useEffect, useRef, useState } from 'react'

import { useMediaQuery } from '@/hooks/useMediaQuery'

// import { SECTIONS } from '@/config/sections'

const VIRTUAL_WIDTH = 2268
const VIRTUAL_HEIGHT = 972
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
  const frameRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [size, setSize] = useState({ width: VIRTUAL_WIDTH, height: VIRTUAL_HEIGHT })
  const [, setSectionId] = useState('hero')
  const breakpoint = useMediaQuery()
  const isMobile = breakpoint === 'xs' || breakpoint === 'sm'
  const [reduced] = useState(isMobile)

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const measure = () => {
      const width = Math.max(
        1,
        Math.min(el.clientWidth, (el.clientHeight * VIRTUAL_WIDTH) / VIRTUAL_HEIGHT)
      )
      const height = Math.max(1, (width * VIRTUAL_HEIGHT) / VIRTUAL_WIDTH)
      setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

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
  const scale = size.width / VIRTUAL_WIDTH

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white">
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4 sm:p-8">
        {/* <div className="flex h-full flex-col items-center justify-between overflow-hidden py-10 sm:hidden">
          <p className="font-ticking text-md tracking-[0.3em] text-white/60">Level</p>
          <p className="font-cyberform text-[96px] leading-none text-white">{level}</p>
          <p className="mt-2 font-ticking text-md tracking-[0.2em] text-accent">{label}</p>
        </div> */}
        <div ref={frameRef} className="flex h-full w-full min-h-0 items-center justify-center">
          <div
            className={`relative overflow-hidden rounded-2xl ${isMobile ? 'h-full w-full' : 'shrink-0'}`}
            style={isMobile ? undefined : { width: size.width, height: size.height }}
          >
            <iframe
              ref={iframeRef}
              title="Saif Eldin Ayman portfolio desktop preview"
              src={reduced ? `${SITE_URL}?reduce_motion=true` : SITE_URL}
              width={isMobile ? undefined : VIRTUAL_WIDTH}
              height={isMobile ? undefined : VIRTUAL_HEIGHT}
              className={isMobile ? 'absolute inset-0 h-full w-full' : 'absolute top-0 left-0'}
              style={
                isMobile
                  ? { border: 0 }
                  : { border: 0, transform: `scale(${scale})`, transformOrigin: 'top left' }
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
