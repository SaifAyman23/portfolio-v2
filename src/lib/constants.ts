export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Saif Eldin Ayman'
export const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export const CONTACT = {
  email: import.meta.env.VITE_CONTACT_EMAIL || '',
  github: import.meta.env.VITE_GITHUB_URL || '',
  linkedin: import.meta.env.VITE_LINKEDIN_URL || '',
} as const
