let cached: boolean | null = null

/**
 * Probe for a real WebGL context. R3F/postprocessing throw uncaught when
 * renderer construction fails (no GPU, blocked GL), which unmounts the
 * whole tree — so check before mounting any Canvas instead.
 */
export function isWebGLAvailable(): boolean {
  if (cached !== null) return cached
  if (typeof document === 'undefined') {
    cached = false
    return cached
  }
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')) as
      WebGLRenderingContext | WebGL2RenderingContext | null
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    cached = gl !== null
  } catch {
    cached = false
  }
  return cached
}
