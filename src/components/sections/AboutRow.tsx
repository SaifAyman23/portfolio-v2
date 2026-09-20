import { CyberImage } from '@/components/ui/cyber-image'

const portrait = { src: '/images/saifeldin.jpg', alt: 'Saif Eldin' }

const blurb =
  'Two years of building the whole stack. ERPs, delivery platforms, AI tools, live-streaming infra. Django under the hood, React where it counts, real-time by default.'

export function AboutRow({ flip = false }: { flip?: boolean }) {
  const text = <p className="max-w-2xl row-text text-white xl:text-2xl">{blurb}</p>
  const image = (
    <div className="w-50">
      <CyberImage src={portrait.src} alt={portrait.alt} width={200} height={200} />
    </div>
  )

  return (
    <div className="flex w-full items-center gap-20">
      {flip ? (
        <>
          {image}
          {text}
        </>
      ) : (
        <>
          {text}
          {image}
        </>
      )}
    </div>
  )
}
