/* eslint-disable react-hooks/purity */
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const COUNT = 14

export function WindLines() {
  const ref = useRef<THREE.Group>(null)
  const lines = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        x: (Math.random() - 0.5) * 8,
        y: -0.5 + Math.random() * 3,
        z: -10 - Math.random() * 12,
        len: 1.2 + Math.random() * 1.8,
      })),
    []
  )

  useFrame((_, delta) => {
    const g = ref.current
    if (!g) return
    for (const child of g.children as THREE.Mesh[]) {
      child.position.z += delta * 6
      if (child.position.z > 3) {
        child.position.z = -18
        child.position.x = (Math.random() - 0.5) * 8
      }
    }
  })

  return (
    <group ref={ref}>
      {lines.map((l, i) => (
        <mesh key={i} position={[l.x, l.y, l.z]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[l.len, 0.015]} />
          <meshBasicMaterial color="#E10600" transparent opacity={0.28} />
        </mesh>
      ))}
    </group>
  )
}
