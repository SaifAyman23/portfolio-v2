export const CYBER_FRAME_VIEWBOX = { width: 263, height: 294 } as const

export function buildCyberFramePath(
  width = CYBER_FRAME_VIEWBOX.width,
  height = CYBER_FRAME_VIEWBOX.height,
  chamferX = 70,
  chamferY = 38,
  inset = 2
) {
  const left = inset
  const top = inset
  const right = width - inset
  const bottom = height - inset
  return [
    `M ${left + chamferX} ${top}`,
    `L ${right} ${top}`,
    `L ${right} ${bottom - chamferY}`,
    `L ${right - chamferX} ${bottom}`,
    `L ${left} ${bottom}`,
    `L ${left} ${top + chamferY}`,
    'Z',
  ].join(' ')
}

export const CYBER_FRAME_PATH = buildCyberFramePath()

export function cyberFrameClip(chamferX = 18, chamferY = 18) {
  return `polygon(${chamferX}px 0, 100% 0, 100% calc(100% - ${chamferY}px), calc(100% - ${chamferX}px) 100%, 0 100%, 0 ${chamferY}px)`
}
