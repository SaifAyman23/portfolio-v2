import { cva, type VariantProps } from 'class-variance-authority'

export const inputVariants = cva(
  [
    'w-full rounded-none bg-transparent shadow-none ring-0',
    'text-sm text-foreground placeholder:font-universa placeholder:text-muted-foreground',
    'outline-none focus:outline-none focus-visible:outline-none active:outline-none border-b-3 border-accent',
    'ring-0 focus:ring-0 focus-visible:ring-0 active:ring-0',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    'aria-invalid:border-destructive',
  ],
  {
    variants: {
      variant: {
        default: 'px-4 py-2.5 h-10',
        textarea: 'px-4 py-3 resize-none',
        file: [
          'file:mr-3 file:py-1 file:px-3',
          'file:rounded-lg file:border-0',
          'file:bg-primary/10 file:text-primary file:text-xs file:font-medium',
          'file:cursor-pointer file:transition-colors',
          'hover:file:bg-primary/20',
          'px-3 py-2 h-10 cursor-pointer',
        ].join(' '),
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export type InputVariants = VariantProps<typeof inputVariants>
