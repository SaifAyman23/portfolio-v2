import { Canvas } from '@react-three/fiber'

import type { JetModel } from '@/components/jet/JetModel'
import { PortfolioScene } from '@/scene/PortfolioScene'

export function JetCanvas({
  className,
  jetProps,
  fixed = false,
}: {
  className?: string
  jetProps?: React.ComponentProps<typeof JetModel>
  fixed?: boolean
}) {
  const canvas = (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <PortfolioScene jetProps={jetProps} />
    </Canvas>
  )

  if (fixed) {
    return (
      <div className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen" aria-hidden>
        {canvas}
      </div>
    )
  }

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      {canvas}
    </div>
  )
}
