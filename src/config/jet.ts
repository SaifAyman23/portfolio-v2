export const JET = {
  modelPath: `${import.meta.env.BASE_URL}models/jet.glb`,
  colors: {
    body: '#ffffff',
    accent: '#E10600',
    emissive: '#FF1A14',
    metal: '#111111',
    cockpit: '#1a2b5a',
  },
  scale: 1,
  shadow: {
    enabled: true,
    opacity: 0.35,
  },
  animation: {
    floatAmplitude: 0.08,
    floatSpeed: 1.2,
  },
} as const

export type JetColors = typeof JET.colors
