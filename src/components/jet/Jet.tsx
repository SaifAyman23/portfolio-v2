import { useGLTF } from '@react-three/drei'
import { gsap } from 'gsap'
import { forwardRef, useEffect, useRef } from 'react'
import * as THREE from 'three'

const FOOTER_LOOK = {
  color: new THREE.Color('#262c38'),
  roughness: 0.2,
  metalness: 1,
  envMapIntensity: 2.0,
  emissive: new THREE.Color('#1f0d0d'),
  emissiveIntensity: 1.4,
}

const FLAT_LOOK = {
  roughness: 1,
  metalness: 0,
  envMapIntensity: 0,
  emissive: new THREE.Color('#000000'),
  emissiveIntensity: 0,
}

type OriginalMaterial = {
  color: THREE.Color
  roughness: number
  metalness: number
  envMapIntensity: number
  emissive: THREE.Color
  emissiveIntensity: number
}

export const Jet = forwardRef<THREE.Group, React.ComponentProps<'group'> & { footer?: boolean }>(
  function Jet({ footer = false, ...props }, ref) {
    const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/jet.glb`)
    const originalsRef = useRef<Map<THREE.MeshStandardMaterial, OriginalMaterial> | null>(null)

    useEffect(() => {
      scene.scale.setScalar(1)

      const box = new THREE.Box3().setFromObject(scene)
      const size = new THREE.Vector3()

      box.getSize(size)

      const maxDim = Math.max(size.x, size.y, size.z)

      scene.scale.setScalar(maxDim > 0 ? 8 / maxDim : 1)

      if (!originalsRef.current) {
        const originals = new Map<THREE.MeshStandardMaterial, OriginalMaterial>()
        scene.traverse((child) => {
          const mesh = child as THREE.Mesh
          if (!mesh.isMesh) return
          const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[]
          const mats = Array.isArray(mat) ? mat : [mat]
          for (const m of mats) {
            if (!m || originals.has(m)) continue
            originals.set(m, {
              color: m.color.clone(),
              roughness: m.roughness,
              metalness: m.metalness,
              envMapIntensity: m.envMapIntensity,
              emissive: m.emissive.clone(),
              emissiveIntensity: m.emissiveIntensity,
            })
          }
        })
        originalsRef.current = originals
      }

      const originals = originalsRef.current
      const targets = new Map<THREE.MeshStandardMaterial, OriginalMaterial>()
      scene.traverse((child) => {
        const mesh = child as THREE.Mesh
        if (!mesh.isMesh) return
        const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[]
        const mats = Array.isArray(mat) ? mat : [mat]
        for (const m of mats) {
          if (!m || targets.has(m)) continue
          const original = originals.get(m)
          m.dithering = footer
          m.needsUpdate = true
          targets.set(
            m,
            footer
              ? {
                  color: FOOTER_LOOK.color.clone(),
                  roughness: FOOTER_LOOK.roughness,
                  metalness: FOOTER_LOOK.metalness,
                  envMapIntensity: FOOTER_LOOK.envMapIntensity,
                  emissive: FOOTER_LOOK.emissive.clone(),
                  emissiveIntensity: FOOTER_LOOK.emissiveIntensity,
                }
              : {
                  color: original?.color.clone() ?? m.color.clone(),
                  roughness: FLAT_LOOK.roughness,
                  metalness: FLAT_LOOK.metalness,
                  envMapIntensity: FLAT_LOOK.envMapIntensity,
                  emissive: original?.emissive.clone() ?? FLAT_LOOK.emissive.clone(),
                  emissiveIntensity: original?.emissiveIntensity ?? FLAT_LOOK.emissiveIntensity,
                }
          )
        }
      })

      const tweens: gsap.core.Tween[] = []
      for (const [m, target] of targets) {
        tweens.push(
          gsap.to(m, {
            roughness: target.roughness,
            metalness: target.metalness,
            envMapIntensity: target.envMapIntensity,
            emissiveIntensity: target.emissiveIntensity,
            duration: 0.7,
            ease: 'power2.out',
            overwrite: 'auto',
          }),
          gsap.to(m.color, {
            r: target.color.r,
            g: target.color.g,
            b: target.color.b,
            duration: 0.7,
            ease: 'power2.out',
            overwrite: 'auto',
          }),
          gsap.to(m.emissive, {
            r: target.emissive.r,
            g: target.emissive.g,
            b: target.emissive.b,
            duration: 0.7,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        )
      }

      return () => {
        for (const tween of tweens) tween.kill()
      }
    }, [scene, footer])

    return (
      <group ref={ref} {...props}>
        <primitive object={scene} />
      </group>
    )
  }
)
