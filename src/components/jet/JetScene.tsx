import { useGSAP } from '@gsap/react'
import { PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Suspense, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'

import { Jet } from './Jet'

import type { SectionId } from '@/config/sections'

gsap.registerPlugin(ScrollTrigger)

const POSES: Record<
  SectionId,
  {
    position: [number, number, number]
    rotation: [number, number, number]
  }
> = {
  hero: {
    position: [0.5, 0.6, -10.5],
    rotation: [0.8, 0.8, 0],
  },

  about: {
    position: [0, 0.6, -10.5],
    rotation: [5, 5, 0],
  },

  experience: {
    position: [2.2, 1.1, -2.2],
    rotation: [-0.1, -0.4, 0.15],
  },

  projects: {
    position: [0, 1.3, -3.2],
    rotation: [0, 0, 0],
  },

  tools: {
    position: [-1.6, 0.2, -1],
    rotation: [0, 0.25, -0.2],
  },

  contact: {
    position: [0, -0.4, 0.5],
    rotation: [0, 0, 0],
  },

  footer: {
    position: [0, -0.4, 0.5],
    rotation: [0, 0, 0],
  },
}

function JetController({
  progressRef,
}: {
  progressRef: MutableRefObject<Record<SectionId, number>>
}) {
  const jetRef = useRef<THREE.Group | null>(null)

  useGSAP(() => {
    const jet = jetRef.current

    if (!jet) return

    const ids = Object.keys(POSES) as SectionId[]

    /*
     * Start at the Hero pose.
     */
    jet.position.set(...POSES.hero.position)
    jet.rotation.set(...POSES.hero.rotation)

    gsap.from(jet.position, {
      x: -30,
      y: -30,
      z: 0,
      duration: 2,
      delay: 4,
    })
    gsap.from(jet.rotation, {
        x: 0.5,
        y: 0,
        z: -1.5,
        duration: 2,
        delay: 4,
    })

    /*
     * Each section gets its own ScrollTrigger.
     *
     * While that section is between 10% from the top
     * and 10% from the bottom, GSAP scrubs the jet
     * from the previous pose to the current pose.
     *
     * Sections render inside lazy-loaded Home, which can resolve
     * AFTER this effect runs — so legs are built the moment each
     * section element appears instead of being skipped when missing.
     */
    const pending = new Set(ids.slice(1))
    const legTimelines: gsap.core.Timeline[] = []
    let observer: MutationObserver | null = null

    const buildLeg = (id: SectionId, index: number) => {
      const section = document.getElementById(id)
      if (!section || !pending.has(id)) return
      pending.delete(id)

      const previousId = ids[index - 1]
      const from = POSES[previousId]
      const to = POSES[id]

      legTimelines.push(
        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 10%',
              end: 'bottom 10%',
              scrub: true,

              onUpdate: (self) => {
                progressRef.current[id] = self.progress
              },
            },
          })
          .fromTo(
            jet.position,
            {
              x: from.position[0],
              y: from.position[1],
              z: from.position[2],
            },
            {
              x: to.position[0],
              y: to.position[1],
              z: to.position[2],
              ease: 'none',
              immediateRender: false,
            },
            0
          )
          .fromTo(
            jet.rotation,
            {
              x: from.rotation[0],
              y: from.rotation[1],
              z: from.rotation[2],
            },
            {
              x: to.rotation[0],
              y: to.rotation[1],
              z: to.rotation[2],
              ease: 'none',
              immediateRender: false,
            },
            0
          )
      )
      if (pending.size === 0) observer?.disconnect()
    }

    ids.forEach((id, index) => {
      if (index === 0) return
      buildLeg(id, index)
    })
    observer = new MutationObserver(() => {
      ids.forEach((id, index) => {
        if (index === 0) return
        buildLeg(id, index)
      })
    })
    if (pending.size > 0) observer.observe(document.body, { childList: true, subtree: true })

    ScrollTrigger.refresh()

    return () => {
      observer?.disconnect()
      observer = null
      legTimelines.forEach((timeline) => timeline.kill())
    }
  })

  return (
    <group ref={jetRef} position={POSES.hero.position} rotation={POSES.hero.rotation}>
      <Suspense fallback={null}>
        <Jet />
      </Suspense>
    </group>
  )
}

export function JetScene({
  progressRef,
}: {
  progressRef: MutableRefObject<Record<SectionId, number>>
}) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true }} frameloop="always">
        <PerspectiveCamera makeDefault fov={38} position={[0, 1.2, 6]} />

        <directionalLight position={[0, 0.8, 7]} intensity={4.8} />

        <hemisphereLight args={['#ffffff', '#8B0606', 0.7]} />

        <ambientLight intensity={0.25} />

        <JetController progressRef={progressRef} />
      </Canvas>
    </div>
  )
}
