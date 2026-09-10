# Architecture Guidelines — Persistent Jet World

> Single source for how the portfolio stays smooth, maintainable, and cinematic. Companion to `SPEC.md`. Phase 0 must satisfy this before any Hero work.

---

## 0. Mental Model — One World, Not Six Scenes

```
                    ┌─────────────────────────┐
                    │     React Application   │
                    │  Sections / UI / Text   │
                    │  Navigation / Effects   │
                    └────────────┬────────────┘
                                 │ scroll state
                    ┌────────────▼────────────┐
                    │   Central Scene State   │
                    │ section / progress /    │
                    │ velocity / transition   │
                    └────────────┬────────────┘
                    ┌────────────▼────────────┐
                    │     ONE R3F CANVAS      │
                    │ Jet / Runway / Clouds / │
                    │ Particles / Wind / Orbs │
                    └─────────────────────────┘
```

One continuous world: **Runway → Takeoff → Flight → Projects → Orbits → Landing**. Jet never unmounts.

---

## 1. One Persistent Canvas

```tsx
<App>
  <Scene />          // <Canvas><PortfolioScene /></Canvas> mounted ONCE
  <PortfolioUI />    // DOM sections
</App>
```

Canvas stays mounted for entire journey. Jet travels, not recreated per section.

> Implementation: `MainLayout.tsx` hosts `<JetCanvas fixed />` (`fixed inset-0 -z-10`), `Home` only provides scroll triggers. Current `MainLayout:8` + `JetCanvas:26 fixed` follows this.

---

## 2. Sections Don't Control Three.js Directly

Bad:

```tsx
<ExperienceSection> // manipulate jet/camera/clouds
```

Good:

```
Scroll → ScrollController → Normalized Portfolio Progress → SceneController → Jet/Camera/Clouds/Particles
```

Sections only emit: *"We're in Experience, 65% through it."* Scene decides visuals. Decouples DOM from 3D.

---

## 3. Normalized Journey Timeline — Config, Not Magic Numbers

Whole journey `0.00 → 1.00`:

```
Hero 0.00→0.14 | About 0.14→0.28 | Experience 0.28→0.48 | Projects 0.48→0.67 | Tools 0.67→0.82 | Hobbies 0.82→0.92 | Contact 0.92→1.00
```

Stored in `config/sections.ts` / `config/journey.ts`, not scattered. Changing lengths = config edit.

> Current: `SECTIONS` ids exist, ranges TODO — add `JOURNEY_RANGES` next.

```ts
// config/journey.ts
export const JOURNEY_RANGES = {
  hero: [0.00, 0.14],
  about: [0.14, 0.28],
  experience: [0.28, 0.48],
  projects: [0.48, 0.67],
  tools: [0.67, 0.82],
  hobbies: [0.82, 0.92],
  contact: [0.92, 1.00],
} as const
```

---

## 4. Scroll-Driven vs Triggered — Never Mix

- **Scroll-driven (continuous):** jet/camera/clouds/wind/project slide/orbit expand/runway — responds to `journeyProgress`.
- **Triggered (once):** title `scrambled → red blur → sharp` — fires on section activation.

```
Scroll
 ├── continuous progress ──→ scene movement
 └── section activation ───→ title animation
```

`ScrambleTitle.tsx:33` uses `IntersectionObserver 0.55`, not scroll scrub — correct. Keep it.

---

## 5. Proper Render Loop — No `addEventListener('scroll')`

```
Browser scroll → target progress → smooth lerp → useFrame() → update Three.js → render
```

Not `window.addEventListener("scroll", jet.position.x+=)`. Gives cinematic interpolation.

> Current: `lib/smoothScroll.ts:8` Lenis `lerp:0.08` + `gsap.ticker + ScrollTrigger.update`, `hooks/useJetScroll.ts:18` `scrub:1.1` + `rAF float` inside `gsap.context` — follows this, but migrate to `useFrame` for per-frame Three.js updates (keep React out of hot path, §9).

---

## 6. DOM vs Three.js Responsibilities

- **Three.js:** jet, runway, clouds, particles, wind, orbits, lighting, camera, shadows
- **HTML/CSS:** name, titles, paragraphs, experience/project data, tool labels, meter, buttons, contact

Better typography/a11y, no text in Canvas.

---

## 7. Jet Is Persistent Object

```
                    ┌──────────────┐
                    │ Persistent JET│
                    └──────┬───────┘
        ┌──────────┬───────┼──────────┬───────────┐
        ↓          ↓       ↓          ↓           ↓
      Hero      About Experience Projects      Tools
```

One `THREE.Group` ref, transforms change with journey. Not `HeroJet`/`AboutJet` etc. `JetModel.tsx:16` `scene.clone(true)` + `jetRef` in `JetCanvas.tsx:26` follows this.

---

## 8. Recycle Effects — Pool, Don't Create

Bad: `scroll → create cloud → create cloud ...` (memory leak).

Good:

```
Cloud pool [1][2][3][4][5][6] → move → when exits → reposition behind camera
```

Same for wind/particles. Infinite illusion, fixed memory. Implement in `scene/Clouds.tsx` / `WindLines.tsx` with instancing.

---

## 9. Keep React Out of Hot Path

Don't `setJetPosition` every frame (React re-renders). Use refs + `useFrame`:

```tsx
const jet = useRef<THREE.Group>(null);
useFrame(() => { jet.current.position.x = ... });
```

React = structure/state, Three.js = per-frame motion.

> Current `useJetScroll` mutates `jet.position` via GSAP (ok, not React state), but move final loop to `useFrame` for interpolation.

---

## 10. Modular Scene — No 2000-Line File

```
scene/
├── PortfolioScene.tsx
├── Jet.tsx
├── Runway.tsx
├── Clouds.tsx
├── WindLines.tsx
├── Particles.tsx
├── ToolOrbits.tsx
└── lighting/

sections/
├── Hero.tsx
├── About.tsx
├── Experience.tsx
├── Projects.tsx
├── Tools.tsx
├── Hobbies.tsx
└── Contact.tsx

systems/
├── scroll/
├── section-tracker/
├── jet-controller/
├── title-animation/
└── performance/

config/
├── theme.ts
├── sections.ts
├── journey.ts
├── experiences.ts
├── projects.ts
├── tools.ts
└── timings.ts
```

---

## 11. One Scene Controller, Delegated

```
PortfolioSceneController
  ├── JetController
  ├── EnvironmentController
  ├── ExperienceController
  ├── ProjectController
  └── OrbitController
```

Not 7 independent controllers, not one giant function.

---

## 12. Optimize Early — Cheap Wins

Do: one Canvas, one jet, reuse geometries/materials, recycle pools, reasonable poly count, compressed textures, don't render invisible, avoid React state per frame, instancing, subtle post-processing.

Don't: 500 React particle components, `new Geometry()` per frame, `new Material()` per frame, mount/unmount Canvas, 4K textures for tiny objects, huge GLB, excessive bloom, 10 animation libs fighting.

---

## 13. Don't Make Everything Scroll-Linked — Feel Travel, Not Drag

Scroll → title activation → title plays → jet enters → covers title → flies to horizon → content approaches → dwell → next. User scrolls but feels *traveling*, not *dragging frames*. Dwell time matters.

---

## Target Foundation — What We Build Before Hero

```
React
├── UI Layer (sections)
├── Shared UI (SectionTitle/CyberFrame/SectionMeter)
├── Journey System (ScrollController/SectionTracker/JourneyProgress)
├── Animation Systems (Title/Jet/Particle/Cloud/Wind)
└── ONE R3F Canvas → PortfolioScene (Jet/Runway/Environment/Clouds/Wind/Particles/Orbits)
```

**Principle:** One canvas. One persistent world. One central journey state. Modular systems. React for UI. Three.js for motion.

> Status: Phase 0 implements `ONE Canvas` (`MainLayout:JetCanvas fixed`), `ScrollController` (Lenis+ScrollTrigger), `SectionTracker` (`useSectionTracker`), `TitleAnimation` (`ScrambleTitle`), `Jet` (white body, `useJetScroll`). Next: `config/journey.ts` ranges + `systems/journeyProgress` normalized 0→1 + `useFrame` loop + modular `scene/*` split.

---

*Keep this file as enforcement. Every new controller must state: What it is → Where it lives → What controls it → What data it receives → How to customize it.*
