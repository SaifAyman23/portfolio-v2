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
  children,
  ...props
}: React.ComponentProps<'button'> &
  ButtonVariants & {
    asChild?: boolean
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

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), 'relative', className)}
      {...props}
    >
      <CyberFrame
        data-slot="button-frame"
        className="absolute inset-0"
        contentClassName="flex h-full w-full items-center justify-center p-0"
        stroke="currentColor"
        strokeWidth={2}
      >
        {children}
      </CyberFrame>
      <span data-slot="button-spacer" className="invisible" aria-hidden="true">
        {children}
      </span>
    </button>
  )
}

export { Button }
export type { ButtonVariants }
