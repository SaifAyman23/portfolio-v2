import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

import { JOURNEY_RANGES } from '@/config/journey'
import { TOOL_CATEGORIES } from '@/config/tools'
import { useJourneyProgress } from '@/systems/scroll/useJourneyProgress'

const RADII = [1.35, 1.85, 2.35]
const TILTS = [0.22, -0.18, 0.12]

export function ToolOrbits() {
  const progress = useJourneyProgress()
  const t = Math.min(
    Math.max(
      (progress - JOURNEY_RANGES.tools[0]) / (JOURNEY_RANGES.tools[1] - JOURNEY_RANGES.tools[0]),
      0
    ),
    1
  )
  const groupRef = useRef<THREE.Group>(null)
  const orbitRefs = useRef<THREE.Group[]>([])

  const show = t > 0.08 && t < 0.88
  const formProgress = Math.min(t / 0.42, 1)
  const exitProgress = Math.min(Math.max((t - 0.72) / 0.16, 0), 1)

  useFrame((_, delta) => {
    if (!show) return
    orbitRefs.current.forEach((g, i) => {
      if (!g) return
      const speed = 0.35 + i * 0.12
      const dir = i % 2 === 0 ? 1 : -1
      g.rotation.y += delta * speed * dir
    })
    if (groupRef.current) {
      groupRef.current.scale.setScalar(1 + exitProgress * 1.6)
    }
  })

  const opacity = show ? (1 - exitProgress) * 0.9 : 0

  if (!show && t <= 0.08) return null

  return (
    <group ref={groupRef} visible={show || t > 0.08}>
      {TOOL_CATEGORIES.map((cat, oi) => {
        const orbitForm = Math.min(Math.max((formProgress - oi * 0.18) / 0.34, 0), 1)
        const r = RADII[oi] ?? 1.5
        const tilt = TILTS[oi] ?? 0
        return (
          <group
            key={cat.id}
            ref={(el) => {
              if (el) orbitRefs.current[oi] = el
            }}
            rotation={[tilt, 0, 0]}
            scale={orbitForm}
          >
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[r - 0.015, r + 0.015, 64]} />
              <meshBasicMaterial color={cat.color} transparent opacity={opacity * 0.55} side={2} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[r - 0.002, r + 0.002, 64]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.18} side={2} />
            </mesh>
            {cat.items.slice(0, 5).map((_, ei) => {
              const angle = (ei / 5) * Math.PI * 2
              const x = Math.cos(angle) * r
              const z = Math.sin(angle) * r
              return (
                <mesh key={ei} position={[x, 0, z]}>
                  <sphereGeometry args={[0.055, 12, 12]} />
                  <meshStandardMaterial
                    color={
                      cat.id === 'backend'
                        ? '#E10600'
                        : cat.id === 'frontend'
                          ? '#111111'
                          : '#6b7280'
                    }
                    emissive={cat.id === 'backend' ? '#FF1A14' : '#000000'}
                    emissiveIntensity={cat.id === 'backend' ? 0.6 : 0}
                  />
                </mesh>
              )
            })}
          </group>
        )
      })}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#E10600" transparent opacity={opacity * 0.18} />
      </mesh>
    </group>
  )
}
