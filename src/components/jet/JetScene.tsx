import { useGSAP } from '@gsap/react'
import { PerspectiveCamera } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { Suspense, useEffect, useRef, type RefObject } from 'react'
import * as THREE from 'three'

import { Jet } from './Jet'

import type { SectionId } from '@/config/sections'

type Pose = {
  position: [number, number, number]
  rotation: [number, number, number]
}

type SectionPoses = {
  /** Where the jet flies in from as this section becomes active. */
  enter: Pose
  /** The section's authoritative resting pose while it's being read. */
  stay: Pose
  /** Where it heads as the section is about to end. */
  leave: Pose
}

/*
 * All per-section jet behaviour lives here. Want a different entrance,
 * resting spot, or exit? Edit these numbers — nothing else changes.
 *
 * Hero has no scroll-driven entrance (enter === stay): its arrival is
 * the one-off intro flight below instead.
 */
const SECTION_POSES: Record<SectionId, SectionPoses> = {
  hero: {
    enter: { position: [0.5, 0.6, -10.5], rotation: [0.8, 0.8, 0] },
    stay: { position: [0.5, 0.6, -10.5], rotation: [0.8, 0.8, 0] },
    leave: { position: [60, 60, -10.5], rotation: [0.8, 0.8, 0] },
  },
  about: {
    enter: { position: [-7.5, 8, -5], rotation: [0, -1, 5] },
    stay: { position: [-7.5, 1.3, -5], rotation: [0, -1, 5] },
    leave: { position: [-7.5, -20, -5], rotation: [0, -1, 5] },
  },
  experience: {
    enter: { position: [-5, -8, -10.5], rotation: [0.8, 0.8, 0] },
    stay: { position: [0.5, 0.6, -10.5], rotation: [0.5, 0, 0.1] },
    leave: { position: [6, 0.6, -10.5], rotation: [0.8, 0.8, 0] },
  },
  projects: {
    enter: { position: [0, 8, -3.2], rotation: [0, 0, 0] },
    stay: { position: [0, 1.3, -3.2], rotation: [0, 0, 0] },
    leave: { position: [4, 1.3, -3.2], rotation: [0, 0, 0] },
  },
  tools: {
    enter: { position: [-1.6, -8, -1], rotation: [0, 0.25, -0.2] },
    stay: { position: [-1.6, 0.2, -1], rotation: [0, 0.25, -0.2] },
    leave: { position: [1.5, 0.2, -1], rotation: [0, 0.25, -0.2] },
  },
  contact: {
    enter: { position: [0, 8, 0.5], rotation: [0, 0, 0] },
    stay: { position: [0, -0.4, 0.5], rotation: [0, 0, 0] },
    leave: { position: [2.5, -0.4, 0.5], rotation: [0, 0, 0] },
  },
  footer: {
    enter: { position: [0.5, 0.6, -10.5], rotation: [0.8, 0.8, 0] },
    stay: { position: [0.5, 0.6, -10.5], rotation: [0.8, 0.8, 0] },
    leave: { position: [6, 0.6, -10.5], rotation: [0.8, 0.8, 0] },
  },
}

/** Hero's one-off, time-based arrival — far off-screen start point. */
const INTRO_START: Pose = { position: [-30, -30, 0], rotation: [0.5, 0, -1.5] }

/** Below this progress we're entering; above this, we're leaving. */
const ENTER_END = 0.3
const LEAVE_START = 0.7

/**
 * How tightly the jet tracks the scroll-derived target each frame.
 * 0 = glued 1:1 to scroll, identical feel to the old `scrub: true`
 * timeline (zero lag). Raise a little (8–14) only to file off jitter
 * from a rough scroll input — much past that and it starts to feel
 * like the jet is chasing the page instead of riding it.
 */
const SMOOTHING = 6

function smoothstep(t: number) {
  const c = Math.min(Math.max(t, 0), 1)
  return c * c * (3 - 2 * c)
}

function blend(a: Pose, b: Pose, t: number): Pose {
  const lerp3 = (from: Pose['position'], to: Pose['position']) =>
    from.map((v, i) => THREE.MathUtils.lerp(v, to[i], t)) as Pose['position']

  return { position: lerp3(a.position, b.position), rotation: lerp3(a.rotation, b.rotation) }
}

/** Pose the jet should be chasing right now, purely as a function of progress. */
function targetPose(section: SectionId, progress: number): Pose {
  const { enter, stay, leave } = SECTION_POSES[section]

  if (progress <= ENTER_END) return blend(enter, stay, smoothstep(progress / ENTER_END))
  if (progress >= LEAVE_START)
    return blend(stay, leave, smoothstep((progress - LEAVE_START) / (1 - LEAVE_START)))

  return stay
}

function JetController({
  active,
  progressRef,
}: {
  active: SectionId
  progressRef: RefObject<Record<SectionId, number>>
}) {
  const jetRef = useRef<THREE.Group | null>(null)
  const introRef = useRef<gsap.core.Timeline | null>(null)
  const introDone = useRef(false)

  useGSAP(() => {
    const jet = jetRef.current
    if (!jet) return

    const heroStay = SECTION_POSES.hero.stay

    introRef.current = gsap
      .timeline({
        delay: 4,
        onComplete: () => {
          introDone.current = true
        },
      })
      .to(jet.position, {
        x: heroStay.position[0],
        y: heroStay.position[1],
        z: heroStay.position[2],
        duration: 2,
        ease: 'power2.out',
      })
      .to(
        jet.rotation,
        {
          x: heroStay.rotation[0],
          y: heroStay.rotation[1],
          z: heroStay.rotation[2],
          duration: 2,
          ease: 'power2.out',
        },
        '<'
      )

    return () => {
      introRef.current?.kill()
    }
  }, [])

  /*
   * If the user scrolls before the intro finishes, stop racing it
   * against the real, scroll-driven pose and hand control to the
   * frame loop immediately — from wherever the jet currently sits.
   */
  useEffect(() => {
    const skipIntro = () => {
      if (introDone.current) return
      introRef.current?.kill()
      introDone.current = true
    }

    window.addEventListener('scroll', skipIntro, { passive: true, once: true })
    return () => window.removeEventListener('scroll', skipIntro)
  }, [])

  useFrame((_, delta) => {
    const jet = jetRef.current
    if (!jet || !introDone.current) return
  
    // progressRef now stores 0–100 per the tracker's contract; targetPose's
    // ENTER_END/LEAVE_START math is written for a 0–1 fraction, so normalize here.
    const progress = (progressRef.current?.[active] ?? 0) / 100
    const target = targetPose(active, progress)
  
    if (SMOOTHING <= 0) {
      jet.position.set(...target.position)
      jet.rotation.set(...target.rotation)
      return
    }
  
    jet.position.x = THREE.MathUtils.damp(jet.position.x, target.position[0], SMOOTHING, delta)
    jet.position.y = THREE.MathUtils.damp(jet.position.y, target.position[1], SMOOTHING, delta)
    jet.position.z = THREE.MathUtils.damp(jet.position.z, target.position[2], SMOOTHING, delta)
  
    jet.rotation.x = THREE.MathUtils.damp(jet.rotation.x, target.rotation[0], SMOOTHING, delta)
    jet.rotation.y = THREE.MathUtils.damp(jet.rotation.y, target.rotation[1], SMOOTHING, delta)
    jet.rotation.z = THREE.MathUtils.damp(jet.rotation.z, target.rotation[2], SMOOTHING, delta)
  })

  return (
    <group ref={jetRef} position={INTRO_START.position} rotation={INTRO_START.rotation}>
      <Suspense fallback={null}>
        <Jet />
      </Suspense>
    </group>
  )
}

export function JetScene({
  active,
  progressRef,
}: {
  active: SectionId
  progressRef: RefObject<Record<SectionId, number>>
}) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true }} frameloop="always">
        <PerspectiveCamera makeDefault fov={38} position={[0, 1.2, 6]} />
        <directionalLight position={[0, 0.8, 7]} intensity={4.8} />
        <hemisphereLight args={['#ffffff', '#8B0606', 0.7]} />
        <ambientLight intensity={0.25} />
        <JetController active={active} progressRef={progressRef} />
      </Canvas>
    </div>
  )
}
