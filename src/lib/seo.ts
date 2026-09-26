import { APP_NAME } from '@/lib/constants'

export const SITE_NAME = import.meta.env.VITE_APP_NAME || APP_NAME
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || 'https://saifayman23.github.io/portfolio/v2'
).replace(/\/+$/, '')

export const DEFAULT_TITLE = `${SITE_NAME} · Full-Stack Engineer`
export const DEFAULT_DESCRIPTION =
  'Full-stack engineer building production-grade products end to end. Django APIs, real-time systems, and React interfaces.'

export function getOgImage(): string {
  return `${SITE_URL}/og.png`
}
