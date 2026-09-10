export const PROJECTS = [
  {
    id: 'go',
    title: 'GO Delivery',
    eyebrow: '2026 · Platform',
    description:
      'Multi-store delivery platform. Customer workflows, order management, RBAC, real-time notifications. Architecture ready for merchants.',
    tags: ['Django', 'React', 'Redis', 'RBAC'],
  },
  {
    id: 'careerly',
    title: 'Careerly',
    eyebrow: '2026 · AI Platform',
    description:
      'AI career platform. Aggregates jobs from 4 sources, analyzes CVs, tailors resumes with AI, tracks applications.',
    tags: ['Django', 'DRF', 'React', 'AI'],
  },
  {
    id: 'bin-sadan',
    title: 'Bin Saedan Smart ERP',
    eyebrow: '2025 · Enterprise',
    description:
      'Smart ERP for enterprise workflows. REST APIs, database architecture, role-based access, workflow automation built with client.',
    tags: ['Django', 'PostgreSQL', 'React'],
  },
  {
    id: 'streamore',
    title: 'Streamore',
    eyebrow: '2025 · Real-time',
    description:
      'Live streaming on LiveKit + RTMP. Broadcast to 5 platforms at once with layouts, overlays, WebSocket private chat.',
    tags: ['LiveKit', 'RTMP', 'WebSockets'],
  },
  {
    id: 'power-zone',
    title: 'Power Zone Dashboard',
    eyebrow: '2024 · Microservice',
    description:
      'Fitness dashboard for workouts, nutrition, progress. Coach views, RBAC, optimized APIs, WebSocket realtime.',
    tags: ['React', 'Django', 'WebSockets'],
  },
] as const

export type Project = (typeof PROJECTS)[number]
