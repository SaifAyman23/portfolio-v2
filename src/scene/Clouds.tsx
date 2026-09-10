/* eslint-disable react-hooks/purity */
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const POOL_SIZE = 6
const SPEED = 0.6

export function Clouds() {
  const groupRef = useRef<THREE.Group>(null)
  const clouds = useMemo(
    () =>
      Array.from({ length: POOL_SIZE }, (_, i) => ({
        x: (Math.random() - 0.5) * 10,
        y: 2 + Math.random() * 2,
        z: -2 - i * 3 - Math.random() * 2,
        scale: 0.7 + Math.random() * 0.6,
      })),
    []
  )

  useFrame((_, delta) => {
    const g = groupRef.current
    if (!g) return
    for (const child of g.children as THREE.Mesh[]) {
      child.position.z += delta * SPEED
      if (child.position.z > 4) {
        child.position.z = -18 - Math.random() * 4
        child.position.x = (Math.random() - 0.5) * 10
      }
    }
  })

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, c.z]} scale={c.scale}>
          <sphereGeometry args={[0.6, 8, 8]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.55} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}
