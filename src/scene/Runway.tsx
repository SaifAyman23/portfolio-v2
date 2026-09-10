export function Runway() {
  return (
    <group position={[0, -0.88, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#efefef" roughness={0.88} metalness={0.02} />
      </mesh>
      {Array.from({ length: 7 }).map((_, i) => (
        <group key={i}>
          {Array.from({ length: 7 }).map((__, j) => (
            <group key={j} position={[-6 + j * 2, 0.02, -6 + i * 2]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[1.85, 1.85]} />
                <meshStandardMaterial color="#ffffff" roughness={0.82} metalness={0.03} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
                <planeGeometry args={[1.85, 1.85]} />
                <meshBasicMaterial color="#111111" transparent opacity={0.045} wireframe />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      <gridHelper args={[14, 14, '#E10600', '#e8e8e8']} position={[0, 0.025, 0]} />
    </group>
  )
}
