import { Button } from '@/components/ui/button'
import { email, github, linkedin, resume } from '@/constants/info'
import { useMediaQuery } from '@/hooks'


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

  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <div className={className} data-slot={dataSlot}>
      {links.map((link) => {
        const external = !link.href.startsWith('mailto:')
        return (
          <Button
            key={link.label}
            className="px-5 py-2 sm:px-8 text-sm md:text-lg"
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
