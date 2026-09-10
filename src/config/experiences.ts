export const EXPERIENCES = [
  {
    id: 'genius',
    company: 'Genius AI',
    role: 'Frontend Engineer',
    period: '2024 — 2025',
    description:
      'React and TypeScript in production. Shipped builds with the team, owned code reviews, and helped new interns find their footing. Learned to care about the details users never notice.',
    layout: 'text-image' as const,
    stats: ['React', 'TypeScript', 'Production'],
  },
  {
    id: 'digiations',
    company: 'Digiations',
    role: 'Full-Stack Engineer',
    period: '2025 — Present',
    description:
      'Smart ERP for enterprise workflows — backend, frontend, database design, the whole pipeline. Mapped how the business actually runs and shipped the system that runs it today.',
    layout: 'image-text' as const,
    stats: ['Django', 'PostgreSQL', 'RBAC'],
  },
] as const

export type Experience = (typeof EXPERIENCES)[number]
