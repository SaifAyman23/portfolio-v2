import { Button } from '@/components/ui/button'
import { email, github, linkedin, resume } from '@/constants/info'

const links = [
  { label: 'Email', href: `mailto:${email}` },
  { label: 'GitHub', href: github },
  { label: 'LinkedIn', href: linkedin },
  { label: 'Resume', href: resume },
]

export function HeroInfo({
  className,
  stroke = 'black',
  strokeWidth = 3,
  fill = 'white',
}: {
  className?: string
  stroke?: string
  strokeWidth?: number
  fill?: string
}) {
  return (
    <div className={className}>
      {links.map((link) => {
        const external = !link.href.startsWith('mailto:')
        return (
          <Button
            key={link.label}
            className="px-8 xl:text-lg"
            stroke={stroke}
            strokeWidth={strokeWidth}
            fill={fill}
          >
            <a
              href={link.href}
              {...(external ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {})}
            >
              {link.label}
            </a>
          </Button>
        )
      })}
    </div>
  )
}
