import { useEffect, useRef, useState } from 'react'

import { SECTIONS } from '@/config/sections'

const VIRTUAL_WIDTH = 1536
const VIRTUAL_HEIGHT = 864
const SITE_URL = 'https://saifayman23.github.io/portfolio/v2/'

const LEVEL_BY_SECTION: Record<string, string> = {
  hero: '0',
  about: '1',
  experience: '2',
  projects: '3',
  tools: '4',
  contact: '5',
  footer: '★',
}

const SECTION_IDS = ['hero', 'about', 'experience', 'projects', 'tools', 'contact', 'footer']

export function MobileScreen() {
  const frameRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [scale, setScale] = useState(0)
  const [sectionId, setSectionId] = useState('hero')

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const measure = () => setScale(el.clientWidth / VIRTUAL_WIDTH)
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

  const label = SECTIONS.find((section) => section.id === sectionId)?.label ?? sectionId
  const level = LEVEL_BY_SECTION[sectionId] ?? '0'

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white sm:hidden z-99999">
      <div
        className="absolute top-1/2 left-1/2 flex h-full items-center justify-between gap-4 p-4"
        style={{
          width: '100dvh',
          height: '100dvw',
          transform: 'translate(-50%, -50%) rotate(90deg)',
        }}
      >
        <div className="flex flex-1 w-max h-full shrink-0 flex-col justify-between items-center py-5">
          <p className="font-ticking text-md tracking-[0.3em] text-white/60">Level</p>
          <p className="font-cyberform text-[190px] leading-none text-white">{level}</p>
          <p className="mt-2 font-ticking text-md tracking-[0.2em] text-accent">{label}</p>
        </div>
        <div
          ref={frameRef}
          className="relative aspect-video h-full shrink-0 overflow-hidden rounded-2xl"
        >
          <iframe
            ref={iframeRef}
            title="Saif Eldin Ayman portfolio desktop preview"
            src={SITE_URL}
            width={VIRTUAL_WIDTH}
            height={VIRTUAL_HEIGHT}
            className="absolute inset-0 z-99999"
            style={{ border: 0, transform: `scale(${scale})`, transformOrigin: 'top left' }}
          />
        </div>
      </div>
    </div>
  )
}
