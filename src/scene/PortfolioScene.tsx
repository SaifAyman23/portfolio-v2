import { PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'

import { Clouds } from './Clouds'
import { Jet } from './Jet'
import { SceneLighting } from './lighting/SceneLighting'
import { Runway } from './Runway'
import { WindLines } from './WindLines'

import { getJetTarget } from '@/systems/jet-controller/jetTargets'
import { useJourneyProgress } from '@/systems/scroll/useJourneyProgress'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function PortfolioScene({ jetProps }: { jetProps?: React.ComponentProps<typeof Jet> }) {
  const jetRef = useRef<THREE.Group>(null)
  const progress = useJourneyProgress()
  const target = useRef({ position: new THREE.Vector3(), rotation: new THREE.Euler() })

  useFrame((_, delta) => {
    const jet = jetRef.current
    if (!jet) return

    const { position, rotation } = getJetTarget(progress)
    target.current.position.set(...position)
    target.current.rotation.set(...rotation)

    const lerpFactor = 1 - Math.pow(0.0001, delta)
    jet.position.lerp(target.current.position, lerpFactor)
    jet.rotation.x = lerp(jet.rotation.x, target.current.rotation.x, lerpFactor)
    jet.rotation.y = lerp(jet.rotation.y, target.current.rotation.y, lerpFactor)
    jet.rotation.z = lerp(jet.rotation.z, target.current.rotation.z, lerpFactor)

    jet.position.y += Math.sin(performance.now() * 0.001) * 0.0005
  })

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.2, 6]} fov={38} />
      <SceneLighting />
      <Suspense fallback={null}>
        <Jet ref={jetRef} {...jetProps} />
        <Runway />
        <Clouds />
        <WindLines />
      </Suspense>
    </>
  )
}
