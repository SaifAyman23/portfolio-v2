import { JOURNEY_RANGES } from '@/config/journey'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function getJetTarget(progress: number) {
  if (progress < JOURNEY_RANGES.hero[1]) {
    const t = progress / 0.14
    const takeoffT = Math.min(Math.max((t - 0.08) / 0.92, 0), 1)
    const eased = 1 - Math.pow(1 - takeoffT, 3)
    return {
      position: [lerp(0, 0.08, eased), lerp(-0.62, 0.85, eased), lerp(0.85, 0.65, eased)] as [
        number,
        number,
        number,
      ],
      rotation: [lerp(0.03, -0.12, eased), lerp(-0.04, -0.06, eased), lerp(0, 0.01, eased)] as [
        number,
        number,
        number,
      ],
      scale: lerp(1.28, 0.68, eased),
      camera: [lerp(0, 0.12, eased), lerp(1.35, 1.18, eased), lerp(4.85, 4.45, eased)] as [
        number,
        number,
        number,
      ],
    }
  }
  if (progress < JOURNEY_RANGES.about[1]) {
    const t = (progress - 0.14) / 0.14
    const enter = Math.min(t / 0.42, 1)
    const enterEased = 1 - Math.pow(1 - enter, 3)
    const cruise = Math.min(Math.max((t - 0.42) / 0.3, 0), 1)
    const exit = Math.min(Math.max((t - 0.72) / 0.28, 0), 1)
    const easedExit = 1 - Math.pow(1 - exit, 3)
    return {
      position: [
        lerp(lerp(-0.72, -0.52, enterEased), lerp(-0.52, -0.48, cruise), 0) +
          lerp(0, 0.35, easedExit),
        lerp(lerp(-1.25, 0.08, enterEased), lerp(0.08, 0.14, cruise), 0) + lerp(0, 1.15, easedExit),
        lerp(lerp(0.75, 0.55, enterEased), lerp(0.55, 0.48, cruise), 0) + lerp(0, -0.55, easedExit),
      ] as [number, number, number],
      rotation: [
        lerp(lerp(0.12, 0.02, enterEased), 0.02, cruise) + lerp(0, -0.14, easedExit),
        lerp(lerp(0.32, 0.28, enterEased), 0.28, cruise) + lerp(0, -0.12, easedExit),
        lerp(lerp(0.06, 0, enterEased), 0, cruise) + lerp(0, 0.06, easedExit),
      ] as [number, number, number],
      scale: lerp(lerp(0.98, 0.82, enterEased), 0.82, cruise) + lerp(0, -0.14, easedExit),
      camera: [lerp(-0.22, -0.28, t), lerp(1.32, 1.12, t), lerp(4.95, 4.75, t)] as [
        number,
        number,
        number,
      ],
    }
  }
  if (progress < JOURNEY_RANGES.experience[1]) {
    const t = (progress - 0.28) / 0.2
    const cover = Math.min(t / 0.18, 1)
    const flight = Math.min(Math.max((t - 0.18) / 0.62, 0), 1)
    const easedFlight = 1 - Math.pow(1 - flight, 2.2)
    return {
      position: [
        lerp(lerp(0.12, 0.08, cover), lerp(0.08, -0.15, easedFlight), flight > 0 ? 1 : 0),
        lerp(lerp(-1.35, -0.25, cover), lerp(-0.25, 1.35, easedFlight), flight > 0 ? 1 : 0),
        lerp(lerp(0.65, 0.55, cover), lerp(0.55, -1.45, easedFlight), flight > 0 ? 1 : 0),
      ] as [number, number, number],
      rotation: [
        lerp(lerp(0.22, 0.04, cover), lerp(0.04, -0.18, easedFlight), flight > 0 ? 1 : 0),
        lerp(lerp(-0.02, 0.06, cover), lerp(0.06, 0.02, easedFlight), flight > 0 ? 1 : 0),
        lerp(0, 0, cover),
      ] as [number, number, number],
      scale: lerp(lerp(1.42, 0.95, cover), lerp(0.95, 0.42, easedFlight), flight > 0 ? 1 : 0),
      camera: [lerp(0, -0.08, t), lerp(1.25, 1.05, t), lerp(4.95, 4.35, t)] as [
        number,
        number,
        number,
      ],
    }
  }
  if (progress < JOURNEY_RANGES.projects[1]) {
    return {
      position: [-0.72, -0.58, 0.72] as [number, number, number],
      rotation: [0.05, 1.57, 0] as [number, number, number],
      scale: 0.78,
      camera: [-0.28, 0.95, 4.65] as [number, number, number],
    }
  }
  if (progress < JOURNEY_RANGES.tools[1]) {
    const t = (progress - 0.67) / 0.15
    const enter = Math.min(t / 0.28, 1)
    const exit = Math.min(Math.max((t - 0.72) / 0.28, 0), 1)
    return {
      position: [
        lerp(lerp(0, 0, enter), lerp(0, 0, exit), exit > 0 ? 1 : 0) + 0,
        lerp(lerp(1.15, 0.15, enter), lerp(0.15, -0.55, exit), exit > 0 ? 1 : 0),
        0.42,
      ] as [number, number, number],
      rotation: [0, lerp(0, 0, enter), 0] as [number, number, number],
      scale: lerp(lerp(0.62, 0.82, enter), lerp(0.82, 0.62, exit), exit > 0 ? 1 : 0),
      camera: [0, lerp(1.25, 1.18, enter), lerp(5.2, 4.75, enter)] as [number, number, number],
    }
  }
  if (progress < JOURNEY_RANGES.hobbies[1]) {
    return {
      position: [0, 0.2, 0] as [number, number, number],
      rotation: [0, 0.1, 0] as [number, number, number],
      scale: 0.6,
      camera: [0, 1.2, 6] as [number, number, number],
    }
  }
  const t = (progress - 0.92) / 0.08
  const land = 1 - Math.pow(1 - t, 2.2)
  return {
    position: [lerp(1.15, -0.68, land), lerp(0.55, -0.62, land), lerp(0.35, 0.78, land)] as [
      number,
      number,
      number,
    ],
    rotation: [lerp(-0.08, 0.04, land), lerp(0.32, -0.04, land), lerp(0.06, 0, land)] as [
      number,
      number,
      number,
    ],
    scale: lerp(0.72, 1.12, land),
    camera: [lerp(0.35, -0.22, land), lerp(1.15, 1.35, land), lerp(4.85, 5.05, land)] as [
      number,
      number,
      number,
    ],
  }
}
