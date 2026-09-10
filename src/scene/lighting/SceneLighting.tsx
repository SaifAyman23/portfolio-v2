import { ContactShadows, Environment } from '@react-three/drei'

export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 6, 3]} intensity={2.2} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-3, 2, -2]} intensity={0.6} color="#E10600" />
      <ContactShadows position={[0, -0.88, 0]} opacity={0.35} scale={10} blur={2.2} far={4} />
      <Environment preset="studio" />
    </>
  )
}
