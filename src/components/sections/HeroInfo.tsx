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
  dataSlot,
}: {
  className?: string
  stroke?: string
  strokeWidth?: number
  fill?: string
  dataSlot?: string
}) {
  return (
    <div className={className} data-slot={dataSlot}>
      {links.map((link) => {
        const external = !link.href.startsWith('mailto:')
        return (
          <Button
            key={link.label}
            className="px-8 xl:text-lg"
            stroke={stroke}
            strokeWidth={strokeWidth}
            fill={fill}
            href={link.href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
          >
            {link.label}
          </Button>
        )
      })}
    </div>
  )
}
