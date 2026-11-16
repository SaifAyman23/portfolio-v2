import { describe, expect, it } from 'vitest'

import {
  SCAN_CELL_SIZE,
  createScanGrid,
  rerollScan,
  scanDensity,
  scanDistances,
  scanEase,
  scanMask,
} from '@/lib/scan-field'

describe('scan mask', () => {
  it('is transparent at both ends of the scan', () => {
    expect(scanMask(0, 0)).toBe(0)
    expect(scanMask(0.5, 0)).toBe(0)
    expect(scanMask(1, 0)).toBe(0)
    expect(scanMask(0, 1)).toBe(0)
    expect(scanMask(0.5, 1)).toBe(0)
    expect(scanMask(1, 1)).toBe(0)
  })

  it('covers the whole frame at mid-scan', () => {
    expect(scanMask(0, 0.5)).toBe(1)
    expect(scanMask(0.5, 0.5)).toBe(1)
    expect(scanMask(1, 0.5)).toBe(1)
  })

  it('fades from the middle to the edges on the way in', () => {
    expect(scanMask(0, 0.35)).toBeGreaterThan(scanMask(0.9, 0.35))
  })

  it('fades back out from the edges on the way out', () => {
    expect(scanMask(0.9, 0.65)).toBeGreaterThan(scanMask(0, 0.65))
  })

  it('fills monotonically and drains monotonically', () => {
    const fill = [0, 0.1, 0.2, 0.3, 0.4, 0.5].map((p) => scanMask(0.7, p))
    for (let i = 1; i < fill.length; i++) expect(fill[i]).toBeGreaterThanOrEqual(fill[i - 1])
    const drain = [0.5, 0.6, 0.7, 0.8, 0.9, 1].map((p) => scanMask(0.7, p))
    for (let i = 1; i < drain.length; i++) expect(drain[i]).toBeLessThanOrEqual(drain[i - 1])
  })
})

describe('scan field', () => {
  const grid = createScanGrid(672, 400)
  const distances = scanDistances(grid)

  const litAt = (progress: number) =>
    distances.reduce((sum, d) => sum + scanDensity(d, scanEase(progress)), 0)

  it('builds a grid of fixed-size cells', () => {
    expect(grid.cell).toBe(SCAN_CELL_SIZE)
    expect(distances).toHaveLength(grid.cols * grid.rows)
  })

  it('starts and ends with no squares', () => {
    expect(litAt(0)).toBe(0)
    expect(litAt(1)).toBeLessThan(1)
  })

  it('grows then shrinks the number of squares', () => {
    const samples = Array.from({ length: 11 }, (_, i) => litAt(i / 10))
    const peak = Math.max(...samples)
    const peakIndex = samples.indexOf(peak)

    expect(peakIndex).toBeGreaterThan(1)
    expect(peakIndex).toBeLessThan(samples.length - 2)
    expect(peak).toBeGreaterThan(samples[0])
    expect(peak).toBeGreaterThan(samples[samples.length - 1])
  })

  it('lights the centre before the edges', () => {
    const centre = scanDensity(0.1, scanEase(0.3))
    const edge = scanDensity(0.9, scanEase(0.3))
    expect(centre).toBeGreaterThan(edge)
  })

  it('keeps the outermost cells dark at both ends of the scan', () => {
    expect(scanDensity(1, scanEase(0))).toBe(0)
    expect(scanDensity(1, scanEase(1))).toBe(0)
    expect(scanDensity(1, scanEase(0.7))).toBeGreaterThan(scanDensity(1, scanEase(0.8)))
    expect(scanDensity(1, scanEase(0.85))).toBe(0)
  })

  it('covers the whole frame at mid-scan', () => {
    expect(scanDensity(1, scanEase(0.5))).toBeGreaterThan(0.8)
    expect(scanDensity(0.5, scanEase(0.5))).toBeGreaterThan(0.8)
    expect(scanDensity(0, scanEase(0.5))).toBeGreaterThan(0.8)
  })

  it('rolls only palette indexes 0-2', () => {
    const rolls = new Float32Array(500)
    const palette = new Uint8Array(500)
    rerollScan(rolls, palette)
    expect(Math.max(...palette)).toBeLessThanOrEqual(2)
    expect(new Set(palette).size).toBe(3)
  })
})
