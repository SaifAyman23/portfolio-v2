export const THEME = {
  colors: {
    background: '#ffffff',
    foreground: '#000000',
    red: '#E10600',
    redBright: '#FF1A14',
    muted: '#f5f5f5',
    border: '#e5e5e5',
    experienceBg: '#000000',
  },
  fonts: {
    display: "'Orbitron', sans-serif",
    body: "'Exo 2', sans-serif",
  },
  radii: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.65rem',
  },
} as const

export const RED = THEME.colors.red
export const RED_BRIGHT = THEME.colors.redBright
