import { forwardRef } from 'react'
import type * as THREE from 'three'

import { JetModel } from '@/components/jet/JetModel'

type JetProps = React.ComponentProps<typeof JetModel>

export const Jet = forwardRef<THREE.Group, JetProps>(function Jet(props, ref) {
  return (
    <group ref={ref}>
      <JetModel {...props} />
    </group>
  )
})
