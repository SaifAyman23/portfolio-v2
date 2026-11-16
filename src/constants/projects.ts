import binSadanImg from '@/assets/img/projects/Bin Sadan.webp'
import careerlyImg from '@/assets/img/projects/Careerly.webp'
import goImg from '@/assets/img/projects/Go.webp'
import powerZoneImg from '@/assets/img/projects/Power Zone.webp'
import streamoreImg from '@/assets/img/projects/Streamore.webp'

export const GALLERY_SIZE = 4

const galleryModules = import.meta.glob<string>('/src/assets/img/projects/gallery/*/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

const collator = new Intl.Collator(undefined, { numeric: true })

/**
 * Screenshots for `slug`, read from src/assets/img/projects/gallery/<slug>/
 * (1.webp … 4.webp). Missing slots fall back to the project's cover so the
 * hover grid always renders four tiles. Projects with `galleryEnabled: false`
 * skip the hover gallery entirely.
 */
export function getProjectGallery(slug: string, cover: string): string[] {
  const urls = Object.entries(galleryModules)
    .filter(([path]) => path.includes(`/gallery/${slug}/`))
    .sort(([a], [b]) => collator.compare(a, b))
    .map(([, url]) => url)
    .slice(0, GALLERY_SIZE)

  return Array.from({ length: GALLERY_SIZE }, (_, index) => urls[index] ?? cover)
}

type ProjectEntry = {
  slug: string
  title: string
  period: string
  image: string
  galleryEnabled?: boolean
  description: string
  stack: string[]
}

const entries: ProjectEntry[] = [
  {
    slug: 'go',
    title: 'GO Delivery Platform',
    period: 'July 2025 – Present',
    image: goImg,
    description:
      'Multi-store delivery platform with customer ordering flows, RBAC access control, real-time notifications, and merchant-ready integration architecture.',
    stack: ['Django', 'Django REST Framework', 'React', 'Redis', 'RBAC'],
  },
  {
    slug: 'careerly',
    title: 'Careerly',
    period: 'December 2025 – June 2026',
    image: careerlyImg,
    description:
      'AI-powered career platform aggregating jobs from 4 sources with CV analysis, resume tailoring, application tracking, and personalized recommendations.',
    stack: ['Django', 'React', 'TypeScript', 'TanStack Query', 'AI'],
  },
  {
    slug: 'bin-saedan',
    title: 'Bin Saedan Smart ERP',
    period: 'December 2025 – April 2026',
    image: binSadanImg,
    description:
      'Smart ERP for enterprise workflows: REST APIs, database architecture, RBAC access, workflow automation, mapped well end to end with client operations.',
    stack: ['Django', 'React', 'PostgreSQL', 'RBAC'],
  },
  {
    slug: 'streamore',
    title: 'Streamore',
    period: 'April 2025 – July 2026',
    image: streamoreImg,
    galleryEnabled: false,
    description:
      'Live streaming platform on LiveKit and RTMP broadcasting to 5 platforms simultaneously, with multiple layouts, overlays, private WebSocket chat rooms.',
    stack: ['LiveKit', 'RTMP', 'React', 'WebSockets'],
  },
  {
    slug: 'power-zone',
    title: 'Power Zone Dashboard',
    period: 'September 2024',
    image: powerZoneImg,
    galleryEnabled: false,
    description:
      'Fitness dashboard for workouts, nutrition, and progress tracking, with coach views, RBAC permissions, optimized APIs, and real-time WebSocket updates.',
    stack: ['React', 'Django', 'WebSockets'],
  },
]

export const projects = entries.map((entry) => ({
  ...entry,
  galleryEnabled: entry.galleryEnabled ?? true,
  gallery: entry.galleryEnabled === false ? [] : getProjectGallery(entry.slug, entry.image),
}))

export type Project = (typeof projects)[number]
