import { cn } from '@/lib/utils'

type CyberPanelProps = {
  children: React.ReactNode
  className?: string
  chamfer?: number
  variant?: 'default' | 'red' | 'outline'
}

export function CyberPanel({
  children,
  className,
  chamfer = 18,
  variant = 'default',
}: CyberPanelProps) {
  const clip = `polygon(${chamfer}px 0, 100% 0, 100% calc(100% - ${chamfer}px), calc(100% - ${chamfer}px) 100%, 0 100%, 0 ${chamfer}px)`

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ clipPath: clip, borderRadius: 2 }}
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[2px]',
          variant === 'red' && 'bg-red',
          variant === 'default' && 'bg-white border border-border',
          variant === 'outline' && 'border border-red bg-white'
        )}
        style={{ clipPath: clip }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
