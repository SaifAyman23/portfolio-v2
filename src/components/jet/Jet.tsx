import { useGLTF } from '@react-three/drei'
import { forwardRef, useEffect } from 'react'
import * as THREE from 'three'

export const Jet = forwardRef<THREE.Group, React.ComponentProps<'group'>>(function Jet(props, ref) {
  const { scene } = useGLTF('/models/jet.glb')

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()

    box.getSize(size)

    const maxDim = Math.max(size.x, size.y, size.z)

    if (maxDim > 0) {
      scene.scale.setScalar(4.5 / maxDim)
    }
  }, [scene])

  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  )
})
