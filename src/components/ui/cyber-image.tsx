import { CyberFrame } from './cyber-frame'

import { cn } from '@/lib/utils'

export type CyberImageProps = {
  src: string
  alt: string
  width?: number
  height?: number
  loading?: 'eager' | 'lazy'
  decoding?: 'async' | 'sync' | 'auto'
  fetchPriority?: 'high' | 'low' | 'auto'
  srcSet?: string
  sizes?: string
  frameClassName?: string
  contentClassName?: string
  imgClassName?: string
  stroke?: string | false
  strokeWidth?: number
  fill?: string
  imgRef?: React.Ref<HTMLImageElement>
}

export function CyberImage({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  srcSet,
  sizes,
  frameClassName,
  contentClassName,
  imgClassName,
  stroke,
  strokeWidth,
  fill,
  imgRef,
}: CyberImageProps) {
  return (
    <CyberFrame
      data-slot="cyber-image"
      className={frameClassName}
      contentClassName={cn('p-2', contentClassName)}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
    >
      <img
        ref={imgRef}
        data-slot="cyber-image-img"
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        srcSet={srcSet}
        sizes={sizes}
        className={cn('block h-auto w-full', imgClassName)}
      />
    </CyberFrame>
  )
}
