export const SECTIONS = [
  { id: 'hero', label: 'HERO', title: 'SAIF AYMAN' },
  { id: 'about', label: 'ABOUT', title: 'ABOUT' },
  { id: 'experience', label: 'EXPERIENCE', title: 'EXPERIENCE' },
  { id: 'projects', label: 'PROJECTS', title: 'PROJECTS' },
  { id: 'tools', label: 'TOOLS', title: 'TOOLS' },
  { id: 'hobbies', label: 'HOBBIES', title: 'HOBBIES' },
  { id: 'contact', label: 'CONTACT', title: 'CONTACT' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

export const SECTION_IDS = SECTIONS.map((s) => s.id) as SectionId[]
