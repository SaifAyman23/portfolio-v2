import { PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'

import { Clouds } from './Clouds'
import { Jet } from './Jet'
import { SceneLighting } from './lighting/SceneLighting'
import { Runway } from './Runway'
import { ToolOrbits } from './ToolOrbits'
import { WindLines } from './WindLines'

import { getJetTarget } from '@/systems/jet-controller/jetTargets'
import { useJourneyProgress } from '@/systems/scroll/useJourneyProgress'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function PortfolioScene({ jetProps }: { jetProps?: React.ComponentProps<typeof Jet> }) {
  const jetRef = useRef<THREE.Group>(null)
  const camRef = useRef<THREE.PerspectiveCamera>(null)
  const progress = useJourneyProgress()
  const target = useRef({
    position: new THREE.Vector3(0, -0.62, 0.85),
    rotation: new THREE.Euler(0.03, -0.04, 0),
    scale: 1.28,
    camera: new THREE.Vector3(0, 1.35, 4.85),
  })

  useFrame((state, delta) => {
    const jet = jetRef.current
    if (!jet) return

    const { position, rotation, scale, camera } = getJetTarget(progress) as {
      position: [number, number, number]
      rotation: [number, number, number]
      scale: number
      camera: [number, number, number]
    }
    target.current.position.set(...position)
    target.current.rotation.set(...rotation)
    target.current.scale = scale ?? 1
    if (camera) target.current.camera.set(...camera)

    const lerpFactor = 1 - Math.pow(0.0001, delta)
    const camLerp = lerpFactor * 0.55
    jet.position.lerp(target.current.position, lerpFactor)
    jet.rotation.x = lerp(jet.rotation.x, target.current.rotation.x, lerpFactor)
    jet.rotation.y = lerp(jet.rotation.y, target.current.rotation.y, lerpFactor)
    jet.rotation.z = lerp(jet.rotation.z, target.current.rotation.z, lerpFactor)
    jet.scale.lerp(
      new THREE.Vector3(target.current.scale, target.current.scale, target.current.scale),
      lerpFactor
    )

    jet.position.y += Math.sin(performance.now() * 0.0009) * 0.00035

    const cam = camRef.current ?? (state.camera as THREE.PerspectiveCamera)
    if (cam) {
      cam.position.lerp(target.current.camera, camLerp)
      cam.lookAt(jet.position.x * 0.28, jet.position.y * 0.32, -0.2)
    }
  })

  const isExperience = progress >= 0.28 && progress < 0.48
  const bgColor = isExperience ? '#08080a' : '#ffffff'

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <PerspectiveCamera ref={camRef} makeDefault position={[0, 1.35, 4.85]} fov={36} />
      <SceneLighting />
      <Suspense fallback={null}>
        <Jet ref={jetRef} {...jetProps} />
        {!isExperience && <Runway />}
        <Clouds />
        <WindLines />
        <ToolOrbits />
      </Suspense>
    </>
  )
}
