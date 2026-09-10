import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

import { JET, type JetColors } from '@/config/jet'

type JetModelProps = {
  colors?: Partial<JetColors>
  scale?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export function JetModel({ colors, scale = JET.scale, position, rotation }: JetModelProps) {
  const { scene } = useGLTF(JET.modelPath) as unknown as { scene: THREE.Group }
  const cloned = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    const merged = { ...JET.colors, ...colors }
    const colorMap: Record<string, keyof JetColors | 'keep'> = {
      base: 'body',
      akcent: 'accent',
      'material.002': 'accent',
      black: 'metal',
      glow: 'emissive',
      material: 'keep',
    }

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[]
        const apply = (m: THREE.MeshStandardMaterial) => {
          const key = m.name?.toLowerCase() ?? ''
          const target = colorMap[key]

          if (target === 'keep') return
          if (target === 'emissive') {
            m.emissive = new THREE.Color(merged.emissive)
            m.emissiveIntensity = 1.4
            m.needsUpdate = true
            return
          }
          if (target) {
            m.color = new THREE.Color(merged[target])
            m.needsUpdate = true
            return
          }

          const name = (m.name || mesh.name || '').toLowerCase()
          if (name.includes('emiss') || name.includes('glow')) {
            m.emissive = new THREE.Color(merged.emissive)
            m.emissiveIntensity = 1.4
          } else if (name.includes('red') || name.includes('accent') || name.includes('akcent')) {
            m.color = new THREE.Color(merged.accent)
          } else if (name.includes('black') || name.includes('metal') || name.includes('dark')) {
            m.color = new THREE.Color(merged.metal)
          } else {
            m.color = new THREE.Color(merged.body)
          }
          m.needsUpdate = true
        }
        if (Array.isArray(mat)) mat.forEach(apply)
        else if (mat) apply(mat)
      }
    })

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        if ((mesh as unknown as { __outlined?: boolean }).__outlined) return
        ;(mesh as unknown as { __outlined: boolean }).__outlined = true

        const key = ((mesh.material as THREE.MeshStandardMaterial)?.name ?? '').toLowerCase()
        const isMetal = key === 'black'
        const isEmissive = key === 'glow'
        if (isEmissive) return

        const edgeColor = isMetal ? '#ffffff' : '#0a0a0a'
        const edges = new THREE.EdgesGeometry(mesh.geometry, 20)
        const lineMat = new THREE.LineBasicMaterial({
          color: new THREE.Color(edgeColor),
          transparent: true,
          opacity: isMetal ? 0.55 : 0.95,
        })
        const line = new THREE.LineSegments(edges, lineMat)
        line.renderOrder = 1
        mesh.add(line)

        if (!isMetal) {
          const redEdges = new THREE.EdgesGeometry(mesh.geometry, 35)
          const redMat = new THREE.LineBasicMaterial({
            color: new THREE.Color('#E10600'),
            transparent: true,
            opacity: 0.18,
          })
          const redLine = new THREE.LineSegments(redEdges, redMat)
          redLine.scale.set(1.001, 1.001, 1.001)
          mesh.add(redLine)
        }
      }
    })
  }, [cloned, colors])

  return <primitive object={cloned} scale={scale} position={position} rotation={rotation} />
}

useGLTF.preload(JET.modelPath)
