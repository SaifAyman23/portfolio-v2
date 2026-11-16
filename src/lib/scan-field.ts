export const SCAN_CELL_SIZE = 32
export const SCAN_CELL_GAP = 4
export const SCAN_FILL_MS = 560
export const SCAN_DRAIN_MS = 600

const FILL_FEATHER = 0.3
const FILL_SPREAD = 1.6
const FILL_JITTER = 0.35
const PEAK_DENSITY = 0.98
const MASK_FEATHER = 0.35
const MASK_SPREAD = 1 + MASK_FEATHER
const BLACK_SHARE = 0.42
const WHITE_SHARE = 0.3

export type ScanGrid = {
  cols: number
  rows: number
  cell: number
}

export function smoothstep(edge0: number, edge1: number, value: number) {
  const t = Math.min(Math.max((value - edge0) / (edge1 - edge0), 0), 1)
  return t * t * (3 - 2 * t)
}

export function scanEase(progress: number) {
  const t = Math.min(Math.max(progress, 0), 1)
  return t * t * (3 - 2 * t)
}

export function createScanGrid(width: number, height: number, cell = SCAN_CELL_SIZE): ScanGrid {
  return {
    cols: Math.max(Math.ceil(width / cell), 0),
    rows: Math.max(Math.ceil(height / cell), 0),
    cell,
  }
}

/** Radial distance of every cell from the centre: 0 in the middle, 1 in the corners. */
export function scanDistances({ cols, rows }: ScanGrid): Float32Array {
  const distances = new Float32Array(cols * rows)
  const halfCols = cols / 2
  const halfRows = rows / 2

  for (let row = 0; row < rows; row++) {
    const dy = (row + 0.5 - halfRows) / halfRows
    for (let col = 0; col < cols; col++) {
      const dx = (col + 0.5 - halfCols) / halfCols
      distances[row * cols + col] = Math.min(Math.hypot(dx, dy) / Math.SQRT2, 1)
    }
  }

  return distances
}

/**
 * Alpha of the black overlay at `distance` while the scan is at `progress`.
 * Fades in from the middle to the edges, holds fully black at the midpoint,
 * then fades back out from the edges — the image swap underneath is never
 * visible.
 */
export function scanMask(distance: number, progress: number) {
  if (progress <= 0.5) {
    return smoothstep(0, MASK_FEATHER, (progress / 0.5) * MASK_SPREAD - distance)
  }
  return 1 - smoothstep(0, MASK_FEATHER, ((progress - 0.5) / 0.5) * MASK_SPREAD - distance)
}

/**
 * Target visibility of a cell at `distance` while the scan is at `progress`.
 * `roll` (per-cell random, 0–1) staggers when each square turns on, so the
 * mosaic cascades. Cells fill from the centre and cover the whole frame by
 * the midpoint, then drain centre-out — sitting on top of the black overlay.
 */
export function scanDensity(distance: number, progress: number, roll = 0) {
  const edge = (u: number) => u * FILL_SPREAD - distance - roll * FILL_JITTER

  if (progress <= 0.5) {
    return PEAK_DENSITY * smoothstep(0, FILL_FEATHER, edge(progress / 0.5))
  }
  return PEAK_DENSITY * (1 - smoothstep(0, FILL_FEATHER, edge((progress - 0.5) / 0.5)))
}

/** Random per-cell palette pick: 0 = dark cell, 1 = white, 2 = accent. */
export function rerollScan(rolls: Float32Array, palette: Uint8Array) {
  for (let i = 0; i < rolls.length; i++) {
    rolls[i] = Math.random()
    const pick = Math.random()
    palette[i] = pick < BLACK_SHARE ? 0 : pick < BLACK_SHARE + WHITE_SHARE ? 1 : 2
  }
}
