import { Slot } from 'radix-ui'
import * as React from 'react'

import { buttonVariants, type ButtonVariants } from './button-variants'
import { CyberFrame } from './cyber-frame'

import { cn } from '@/lib/utils'

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  stroke,
  strokeWidth,
  fill,
  children,
  href,
  target,
  rel,
  ...props
}: React.ComponentProps<'button'> &
  ButtonVariants & {
    asChild?: boolean
    stroke?: string
    strokeWidth?: number
    fill?: string
    href?: string
    target?: React.HTMLAttributeAnchorTarget
    rel?: string
  }) {
  if (asChild) {
    return (
      <Slot.Root
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }

  const frame = (
    <>
      <CyberFrame
        data-slot="button-frame"
        className="absolute inset-0"
        contentClassName="flex h-full w-full items-center justify-center font-ticking parent"
        stroke={stroke ?? '#FFFFFF'}
        fill={fill ?? 'transparent'}
        strokeWidth={strokeWidth ?? 1}
      >
        {children}
      </CyberFrame>
      <span data-slot="button-spacer" className="invisible" aria-hidden="true" inert>
        {children}
      </span>
    </>
  )

  if (href !== undefined) {
    return (
      <a
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size }), 'relative', className)}
        href={href}
        target={target}
        rel={rel}
      >
        {frame}
      </a>
    )
  }

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), 'relative', className)}
      {...props}
    >
      {frame}
    </button>
  )
}

export { Button }
export type { ButtonVariants }
