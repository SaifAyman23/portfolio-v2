export function Runway() {
  return (
    <group position={[0, -0.9, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#e5e5e5" roughness={0.85} metalness={0.05} />
      </mesh>
      {Array.from({ length: 7 }).map((_, i) => (
        <group key={i}>
          {Array.from({ length: 7 }).map((__, j) => (
            <mesh key={j} position={[-6 + j * 2, 0.01, -6 + i * 2]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.85, 1.85]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>
      ))}
      <gridHelper args={[14, 14, '#E10600', '#e5e5e5']} position={[0, 0.02, 0]} />
    </group>
  )
}
