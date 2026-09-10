export const TOOL_CATEGORIES = [
  {
    id: 'backend',
    label: 'Backend',
    items: ['Django', 'DRF', 'PostgreSQL', 'Redis', 'Celery', 'Docker'],
    color: '#E10600',
  },
  {
    id: 'frontend',
    label: 'Frontend',
    items: ['React', 'TypeScript', 'Tailwind', 'Vite', 'TanStack Query', 'Zustand'],
    color: '#111111',
  },
  {
    id: 'tools',
    label: 'Tools',
    items: ['Git', 'Linux', 'Figma', 'Postman', 'LiveKit', 'WebSockets'],
    color: '#6b7280',
  },
] as const

export type ToolCategory = (typeof TOOL_CATEGORIES)[number]
