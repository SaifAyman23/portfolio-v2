import { JOURNEY_RANGES } from '@/config/journey'

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function getJetTarget(progress: number) {
  if (progress < JOURNEY_RANGES.hero[1]) {
    const t = progress / 0.14
    return {
      position: [lerp(0, 0.4, t), lerp(-0.4, -0.1, t), lerp(0, 0.2, t)] as [number, number, number],
      rotation: [lerp(0.12, 0.06, t), lerp(-0.25, -0.12, t), lerp(0, -0.04, t)] as [
        number,
        number,
        number,
      ],
    }
  }
  if (progress < JOURNEY_RANGES.about[1]) {
    const t = (progress - 0.14) / 0.14
    return {
      position: [lerp(0.4, -0.5, t), lerp(-0.1, 0.3, t), lerp(0.2, -0.2, t)] as [number, number, number],
      rotation: [lerp(0.06, -0.04, t), lerp(-0.12, 0.22, t), lerp(-0.04, 0.06, t)] as [
        number,
        number,
        number,
      ],
    }
  }
  if (progress < JOURNEY_RANGES.experience[1]) {
    const t = (progress - 0.28) / 0.2
    return {
      position: [lerp(-0.5, 0.2, t), lerp(0.3, 0.8, t), lerp(-0.2, -1.2, t)] as [number, number, number],
      rotation: [lerp(-0.04, -0.12, t), lerp(0.22, 0.08, t), lerp(0.06, 0, t)] as [number, number, number],
    }
  }
  if (progress < JOURNEY_RANGES.projects[1]) {
    const t = (progress - 0.48) / 0.19
    return {
      position: [lerp(0.2, -0.3, t), lerp(0.8, 0.1, t), lerp(-1.2, 0.4, t)] as [number, number, number],
      rotation: [lerp(-0.12, 0.08, t), lerp(0.08, -0.15, t), lerp(0, -0.03, t)] as [number, number, number],
    }
  }
  if (progress < JOURNEY_RANGES.tools[1]) {
    const t = (progress - 0.67) / 0.15
    return {
      position: [lerp(-0.3, 0, t), lerp(0.1, 0.4, t), lerp(0.4, 0, t)] as [number, number, number],
      rotation: [lerp(0.08, 0, t), lerp(-0.15, 0, t), lerp(-0.03, 0, t)] as [number, number, number],
    }
  }
  if (progress < JOURNEY_RANGES.hobbies[1]) {
    return {
      position: [0, 0.2, 0] as [number, number, number],
      rotation: [0, 0.1, 0] as [number, number, number],
    }
  }
  const t = (progress - 0.92) / 0.08
  return {
    position: [lerp(0, -0.8, t), lerp(0.2, -0.35, t), lerp(0, 0.1, t)] as [number, number, number],
    rotation: [lerp(0, 0.08, t), lerp(0.1, -0.2, t), lerp(0, 0.04, t)] as [number, number, number],
  }
}
