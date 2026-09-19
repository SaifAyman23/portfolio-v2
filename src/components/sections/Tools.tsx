import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useId, useRef, useState } from 'react'
import { BiLogoPostgresql } from 'react-icons/bi'
import {
  SiCelery,
  SiDjango,
  SiDocker,
  SiFigma,
  SiFirebase,
  SiFramer,
  SiGit,
  SiGithub,
  SiJavascript,
  SiMysql,
  SiPostman,
  SiPython,
  SiReact,
  SiReactquery,
  SiRedis,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from 'react-icons/si'

import { CyberFrame } from '@/components/ui/cyber-frame'
import { cn } from '@/lib/utils'

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

function wedgePath(cx: number, cy: number, r: number, startDeg: number, spanDeg: number) {
  const [x1, y1] = polar(cx, cy, r, startDeg)
  const [x2, y2] = polar(cx, cy, r, startDeg + spanDeg)
  return `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${spanDeg > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`
}

export type RadarProps = {
  size?: number
  rings?: Array<{ r: number; color: string }>
  sweepSpan?: number
  sweepFrom?: string
  sweepTo?: string
  crossColor?: string
  strokeWidth?: number
  showIcon?: boolean
  children?: React.ReactNode
  className?: string
}

export function Radar({
  size = 320,
  rings = [
    { r: 144.5, color: 'black' },
    { r: 103.5, color: 'var(--accent)' },
    { r: 59.5, color: 'black' },
    { r: 19.5, color: 'var(--accent)' },
  ],
  sweepSpan = 55,
  sweepFrom = '#FF8484',
  sweepTo = 'white',
  crossColor = 'black',
  strokeWidth = 3,
  showIcon = false,
  children,
  className,
}: RadarProps) {
  const gradientId = useId()
  const cx = 191
  const cy = 191

  return (
    <div
      data-slot="radar"
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 382 382" fill="none" className="block h-full w-full">
        <g data-slot="radar-sweep">
          <path
            d={wedgePath(cx, cy, rings[0]?.r ?? 144.5, 15, sweepSpan)}
            fill={`url(#${gradientId})`}
          />
        </g>
        <g data-slot="radar-rings">
          {rings.map((ring, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={ring.r}
              stroke={ring.color}
              strokeWidth={strokeWidth}
            />
          ))}
        </g>
        <g data-slot="radar-cross" stroke={crossColor} strokeWidth={strokeWidth}>
          <line x1={cx + 0.5} y1="46" x2={cx + 0.5} y2="336" />
          <line x1="45" y1={cy - 1.5} x2="337" y2={cy - 1.5} />
        </g>
        <defs>
          <linearGradient
            id={gradientId}
            x1={cx + 50}
            y1={cy - 137}
            x2={cx}
            y2={cy}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={sweepFrom} />
            <stop offset="1" stopColor={sweepTo} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {(showIcon || children !== undefined) && (
        <div
          data-slot="radar-icon"
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
        >
          {children ?? <span className="block h-3 w-3 rounded-full bg-accent" />}
        </div>
      )}
    </div>
  )
}

export type TickRingProps = {
  size?: number
  ticks?: number
  color?: string
  strokeWidth?: number
  radius?: number
  tickLength?: number
  className?: string
}

export function TickRing({
  size = 280,
  ticks = 72,
  color = '#8F8F8F',
  strokeWidth = 1.5,
  radius = 99,
  tickLength = 9,
  className,
}: TickRingProps) {
  const center = 100
  const lines = Array.from({ length: ticks }, (_, i) => {
    const [x1, y1] = polar(center, center, radius - tickLength, (i * 360) / ticks)
    const [x2, y2] = polar(center, center, radius, (i * 360) / ticks)
    return { x1, y1, x2, y2 }
  })

  return (
    <svg
      data-slot="tick-ring"
      viewBox="0 0 200 200"
      fill="none"
      className={cn('block', className)}
      style={{ width: size, height: size }}
    >
      <g data-slot="tick-ring-ticks" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
        {lines.map((line, i) => (
          <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
        ))}
      </g>
    </svg>
  )
}

export type RulerBarProps = {
  width?: number
  majors?: number[]
  minorStep?: number
  minorStart?: number
  baselineY?: number
  majorColor?: string
  minorColor?: string
  strokeWidth?: number
  label?: string
  labelClassName?: string
  className?: string
}

export function RulerBar({
  width = 679,
  majors = [22.5, 657.5],
  minorStep = 40,
  minorStart = 57.5,
  baselineY = 29.5,
  majorColor = 'black',
  minorColor = 'var(--accent)',
  strokeWidth = 3,
  label,
  labelClassName,
  className,
}: RulerBarProps) {
  const minors: number[] = []
  for (let x = minorStart; x <= width - minorStart; x += minorStep) minors.push(x)

  return (
    <div data-slot="ruler-bar" className={cn('w-full', className)}>
      <svg viewBox={`0 0 ${width} 60`} fill="none" className="block h-auto w-full">
        <line
          data-slot="ruler-bar-baseline"
          y1={baselineY}
          x2={width}
          y2={baselineY}
          stroke="black"
          strokeWidth={strokeWidth}
        />
        <g data-slot="ruler-bar-minors" stroke={minorColor} strokeWidth={strokeWidth}>
          {minors.map((x) => (
            <line key={x} x1={x} y1={baselineY} x2={x} y2={13} />
          ))}
        </g>
        <g data-slot="ruler-bar-majors" stroke={majorColor} strokeWidth={strokeWidth}>
          {majors.map((x) => (
            <line key={x} x1={x} y1={baselineY} x2={x} y2={0} />
          ))}
        </g>
      </svg>
      {label !== undefined && (
        <p
          data-slot="ruler-bar-label"
          className={cn('text-center tracking-[0.2em] text-xl text-accent', labelClassName)}
        >
          {label}
        </p>
      )}
    </div>
  )
}

export type CoolMeterProps = {
  height?: number
  segments?: number
  active?: number
  gap?: number
  litColor?: string
  dimColor?: string
  dimOpacity?: number
  frameColor?: string
  strokeWidth?: number
  topLabel?: string
  topLabelClassName?: string
  bottomLabel?: string
  bottomLabelClassName?: string
  className?: string
}

export function CoolMeter({
  height = 420,
  segments = 16,
  active = 5,
  gap = 5,
  litColor = '#8B0606',
  dimColor = '#8F8F8F',
  dimOpacity = 0.25,
  frameColor = 'black',
  strokeWidth = 5,
  topLabel,
  topLabelClassName,
  bottomLabel,
  bottomLabelClassName,
  className,
}: CoolMeterProps) {
  const frameX = 36.5
  const frameY = 48.5
  const frameWidth = 57
  const frameHeight = 363
  const innerTop = frameY + strokeWidth
  const innerBottom = frameY + frameHeight - strokeWidth
  const safeSegments = Math.max(segments, 1)
  const safeActive = Math.min(Math.max(active, 0), safeSegments)
  const blockHeight = (innerBottom - innerTop - (safeSegments - 1) * gap) / safeSegments
  const segX = frameX + 7.5
  const segWidth = frameWidth - 15
  const litFrom = safeSegments - safeActive

  return (
    <div data-slot="cool-meter" className={cn('flex flex-col items-center', className)}>
      {topLabel !== undefined && (
        <p
          data-slot="cool-meter-top-label"
          className={cn('mb-1 text-center text-xl tracking-[0.2em] text-accent', topLabelClassName)}
        >
          {topLabel}
        </p>
      )}
      <svg viewBox="0 0 145 470" fill="none" className="block w-auto" style={{ height }}>
        <rect
          data-slot="cool-meter-frame"
          x={frameX}
          y={frameY}
          width={frameWidth}
          height={frameHeight}
          stroke={frameColor}
          strokeWidth={strokeWidth}
        />
        <g data-slot="cool-meter-segments">
          {Array.from({ length: safeSegments }, (_, i) => {
            const lit = i >= litFrom
            return (
              <rect
                key={i}
                data-slot={lit ? 'cool-meter-segment-lit' : 'cool-meter-segment-dim'}
                x={segX}
                y={innerTop + i * (blockHeight + gap)}
                width={segWidth}
                height={blockHeight}
                fill={lit ? litColor : dimColor}
                opacity={lit ? 1 : dimOpacity}
              />
            )
          })}
        </g>
      </svg>
      {bottomLabel !== undefined && (
        <p
          data-slot="cool-meter-bottom-label"
          className={cn(
            'mt-1 text-center text-xl tracking-[0.2em] text-accent',
            bottomLabelClassName
          )}
        >
          {bottomLabel}
        </p>
      )}
    </div>
  )
}

export function Tools() {
  const rootRef = useRef<HTMLElement>(null)

  const skills = {
    backend: {
      title: 'Backend',
      skills: [
        { title: 'Python', icon: <SiPython className="size-35 text-blue-600 drop-shadow-2xl" /> },
        { title: 'Django', icon: <SiDjango className="size-35 text-green-800" /> },
        { title: 'PostgreSQL', icon: <BiLogoPostgresql className="size-35 text-sky-700" /> },
        { title: 'MySQL', icon: <SiMysql className="size-35 text-blue-700" /> },
        { title: 'Redis', icon: <SiRedis className="size-35 text-red-700" /> },
        { title: 'Celery', icon: <SiCelery className="size-35 text-lime-600" /> },
        { title: 'Firebase', icon: <SiFirebase className="size-35 text-amber-600" /> },
      ],
    },
    frontend: {
      title: 'Frontend',
      skills: [
        { title: 'React', icon: <SiReact className="size-35 text-sky-400" /> },
        { title: 'TypeScript', icon: <SiTypescript className="size-35 text-blue-600" /> },
        { title: 'JavaScript', icon: <SiJavascript className="size-35 text-yellow-500" /> },
        { title: 'Tailwind', icon: <SiTailwindcss className="size-35 text-cyan-500" /> },
        { title: 'TanStack Query', icon: <SiReactquery className="size-35 text-pink-600" /> },
        { title: 'Framer Motion', icon: <SiFramer className="size-35 text-fuchsia-500" /> },
      ],
    },
    tools: {
      title: 'Tools',
      skills: [
        { title: 'Git', icon: <SiGit className="size-35 text-orange-600" /> },
        { title: 'GitHub', icon: <SiGithub className="size-35 text-black" /> },
        { title: 'Docker', icon: <SiDocker className="size-35 text-sky-600" /> },
        { title: 'Vercel', icon: <SiVercel className="size-35 text-black" /> },
        { title: 'Figma', icon: <SiFigma className="size-35 text-violet-500" /> },
        { title: 'Postman', icon: <SiPostman className="size-35 text-orange-500" /> },
      ],
    },
  }

  const skillSets = [skills.backend, skills.frontend, skills.tools] as const
  const [activeSkillSet, setActiveSkillSet] = useState(skillSets[0])
  const [activeSkill, setActiveSkill] = useState(skillSets[0].skills[0])

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.from(
        '[data-slot="radar"], [data-slot="tick-ring"], [data-slot="ruler-bar"], [data-slot="cool-meter"]',
        {
          autoAlpha: 0,
          y: 24,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: rootRef.current, start: 'top 70%', once: true },
        }
      )
      gsap.to('[data-slot="radar-sweep"]', {
        rotation: 360,
        svgOrigin: '191 191',
        duration: 6,
        ease: 'none',
        repeat: -1,
      })
      gsap.to('[data-slot="tick-ring-ticks"]', {
        rotation: -360,
        svgOrigin: '100 100',
        duration: 60,
        ease: 'none',
        repeat: -1,
      })

      gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '+=250%',
          scrub: true,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress
            const nextIndex = Math.min(
              Math.floor(progress * skillSets.length),
              skillSets.length - 1
            )
            const nextSet = skillSets[nextIndex]
            setActiveSkillSet((prev) => (prev === nextSet ? prev : nextSet))
          },
        },
      })
    },
    { scope: rootRef }
  )

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.from('[data-slot="skills-panel"]', {
        autoAlpha: 0,
        y: 18,
        filter: 'blur(6px)',
        duration: 0.45,
        ease: 'power3.out',
        stagger: 0.1,
      })
      gsap.from('[data-slot="skills-panel"] [data-slot="skill-btn"]', {
        autoAlpha: 0,
        y: 14,
        filter: 'blur(6px)',
        duration: 0.4,
        ease: 'power3.out',
        stagger: 0.05,
      })
      gsap.fromTo(
        '[data-slot="radar-icon"]',
        { autoAlpha: 0, scale: 0.75, filter: 'blur(6px)' },
        { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.32, ease: 'power3.out' }
      )
    },
    { dependencies: [activeSkillSet], scope: rootRef }
  )

  return (
    <section
      ref={rootRef}
      id="tools"
      data-section="tools"
      className="flex h-screen flex-col items-center justify-center gap-8 px-6 py-10"
    >
      <div className="grid h-full w-full gap-10 md:grid-cols-12">
        <div className="relative z-[9999] col-span-3 flex flex-col items-center justify-between py-10 [isolation:isolate]">
          <CyberFrame
            data-slot="skills-panel"
            className="w-3/6 relative"
            strokeWidth={3}
            stroke="black"
          >
            <div className="flex flex-col items-center gap-2">
              {activeSkillSet.skills.map((skill) => (
                <button
                  key={skill.title}
                  data-slot="skill-btn"
                  type="button"
                  className="flex cursor-pointer items-center gap-3 font-universa text-lg"
                  onClick={() => setActiveSkill(skill)}
                >
                  <span>{skill.title}</span>
                </button>
              ))}
            </div>
            <div className="absolute top-10 -end-12 rotate-90">
              <p className="text-accent">{activeSkillSet.title}</p>
            </div>
          </CyberFrame>
          <Radar showIcon={true} children={activeSkill.icon} />
        </div>
        <div className="col-span-6 flex flex-col items-center justify-center">
          <div className="h-5/6 relative w-full flex justify-center items-end mb-10">
            <TickRing size={600} />
            <div className="absolute end-20">
              <p className="text-accent text-xl">
                1.2 km <br /> tot acq
              </p>
            </div>
          </div>
          <div className="mx-auto flex items-end h-1/6 w-2/3">
            <RulerBar label="320 kts" />
          </div>
        </div>
        <div className="col-span-3 flex justify-center items-center">
          <CoolMeter active={5} bottomLabel="Cool-Ometer" topLabel="Too Cool" />
        </div>
      </div>
    </section>
  )
}
