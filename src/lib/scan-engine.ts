import {
  SCAN_CELL_GAP,
  SCAN_CELL_SIZE,
  SCAN_DRAIN_MS,
  SCAN_FILL_MS,
  createScanGrid,
  rerollScan,
  scanDensity,
  scanDistances,
  scanEase,
  scanMask,
} from '@/lib/scan-field'

export type ScanColors = readonly [string, string, string]

export type ScanEngineOptions = {
  colors: ScanColors
  reducedMotion: boolean
  cellSize?: number
  maxDpr?: number
  onMidpoint?: (entering: boolean) => void
}

export type ScanEngine = {
  setActive: (active: boolean) => void
  resize: (width: number, height: number) => void
  destroy: () => void
}

const MAX_FRAME_MS = 50
const FADE_RATE_MS = 70
const SHIMMER_AMPLITUDE = 0.12
const SHIMMER_SPEED = 0.011
const VISIBLE_EPSILON = 0.005
const MID = 0.5
const MASK_SAMPLES = 24

export function createScanEngine(
  canvas: HTMLCanvasElement,
  { colors, reducedMotion, cellSize = SCAN_CELL_SIZE, maxDpr = 1.75, onMidpoint }: ScanEngineOptions
): ScanEngine {
  let context: CanvasRenderingContext2D | null = null
  let grid = createScanGrid(0, 0, cellSize)
  let distances: Float32Array = new Float32Array(0)
  let rolls: Float32Array = new Float32Array(0)
  let intensity: Float32Array = new Float32Array(0)
  let phase: Float32Array = new Float32Array(0)
  let palette: Uint8Array = new Uint8Array(0)
  let width = 0
  let height = 0
  let dpr = 1
  let progress = 0
  let target = 0
  let frame = 0
  let lastTick = 0

  function getContext() {
    context ??= canvas.getContext('2d')
    return context
  }

  function drawMask(ctx: CanvasRenderingContext2D, eased: number) {
    const cx = width / 2
    const cy = height / 2
    const radius = Math.hypot(width, height) / 2
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.12)

    for (let i = 0; i <= MASK_SAMPLES; i++) {
      const d = i / MASK_SAMPLES
      gradient.addColorStop(d, `rgba(0, 0, 0, ${scanMask(d, eased)})`)
    }

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  function drawCells(now: number) {
    const ctx = getContext()
    if (!ctx) return

    const { cols, cell } = grid
    const side = cell - SCAN_CELL_GAP

    for (let i = 0; i < distances.length; i++) {
      const fade = intensity[i]
      if (fade <= VISIBLE_EPSILON) continue

      const shimmer =
        1 - SHIMMER_AMPLITUDE + SHIMMER_AMPLITUDE * Math.sin(now * SHIMMER_SPEED + phase[i])
      ctx.globalAlpha = Math.min(1, fade * shimmer)
      ctx.fillStyle = colors[palette[i]]
      ctx.fillRect((i % cols) * cell, Math.floor(i / cols) * cell, side, side)
    }

    ctx.globalAlpha = 1
  }

  function draw(now: number) {
    const ctx = getContext()
    if (!ctx) return

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)

    const eased = scanEase(progress)
    drawMask(ctx, eased)
    if (progress <= 0 || progress >= 1) return
    drawCells(now)
  }

  function fadeCells(delta: number, eased: number) {
    const fade = 1 - Math.exp(-delta / FADE_RATE_MS)
    let peak = 0

    for (let i = 0; i < distances.length; i++) {
      const goal = scanDensity(distances[i], eased, rolls[i])
      const next = intensity[i] + (goal - intensity[i]) * fade
      intensity[i] = next < VISIBLE_EPSILON && goal < VISIBLE_EPSILON ? 0 : next
      if (intensity[i] > peak) peak = intensity[i]
    }

    return peak
  }

  function tick(now: number) {
    const delta = Math.min(now - lastTick, MAX_FRAME_MS)
    lastTick = now

    const entering = target > progress

    if (delta > 0) {
      const before = progress

      if (entering) {
        progress =
          progress < MID
            ? Math.min(MID, progress + delta / SCAN_FILL_MS)
            : Math.min(target, progress + delta / SCAN_DRAIN_MS)
      } else {
        progress =
          progress > MID
            ? Math.max(MID, progress - delta / SCAN_FILL_MS)
            : Math.max(target, progress - delta / SCAN_DRAIN_MS)
      }

      if (progress === MID && before !== MID) onMidpoint?.(target > MID)
    }

    const peak = fadeCells(delta, scanEase(progress))
    draw(now)

    if (progress === target && peak <= VISIBLE_EPSILON) {
      const ctx = getContext()
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, width, height)
      }
      frame = 0
      return
    }

    frame = requestAnimationFrame(tick)
  }

  function startLoop() {
    if (frame === 0) {
      lastTick = performance.now()
      frame = requestAnimationFrame(tick)
    }
  }

  return {
    setActive(active) {
      target = active ? 1 : 0

      if (reducedMotion) {
        progress = target
        intensity = new Float32Array(distances.length)
        onMidpoint?.(target === 1)
        if (frame !== 0) cancelAnimationFrame(frame)
        frame = 0
        const ctx = getContext()
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          ctx.clearRect(0, 0, width, height)
        }
        return
      }

      startLoop()
    },

    resize(nextWidth, nextHeight) {
      width = nextWidth
      height = nextHeight
      grid = createScanGrid(width, height, cellSize)
      distances = scanDistances(grid)
      rolls = new Float32Array(distances.length)
      intensity = new Float32Array(distances.length)
      phase = new Float32Array(distances.length)
      palette = new Uint8Array(distances.length)
      rerollScan(rolls, palette)
      for (let i = 0; i < phase.length; i++) phase[i] = Math.random() * Math.PI * 2

      dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      if (frame !== 0) draw(performance.now())
    },

    destroy() {
      cancelAnimationFrame(frame)
      frame = 0
    },
  }
}
