import { useGLTF } from '@react-three/drei'
import { forwardRef, useEffect } from 'react'
import * as THREE from 'three'

export const Jet = forwardRef<THREE.Group, React.ComponentProps<'group'>>(function Jet(props, ref) {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/jet.glb`)

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()

    box.getSize(size)

    const maxDim = Math.max(size.x, size.y, size.z)

    if (maxDim > 0) {
      scene.scale.setScalar(8.5 / maxDim)
    }

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (!mesh.isMesh) return
      const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[]
      const mats = Array.isArray(mat) ? mat : [mat]
      for (const m of mats) {
        if (!m) continue
        m.roughness = 1
        m.metalness = 0
        m.envMapIntensity = 0
        m.needsUpdate = true
      }
    })
  }, [scene])

  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  )
})
