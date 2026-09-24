# Architecture — 最強 Portfolio

> Single source of truth for how this site is built. Aesthetic: white + black + red (`#B50000`, darker `#8B0606`), modern cyber-Japanese. Motion: GSAP + Lenis, **one persistent jet**, data-driven sections.

---

## 0. Big picture

```
App.tsx                      registers GSAP plugins once — gsap.registerPlugin(ScrollTrigger, SplitText)
  └─ Home.tsx                owns section state (useSectionTracker, called once)
       ├─ TopBar             reads { active, direction } — indicator only
       ├─ ScrollBar          custom scrollbar (motion-aware)
       ├─ sections/*         Hero / About / Experience / Projects / Tools / Contact / Footer — each owns its own timeline
       └─ (jet layer)        ONE persistent jet, reads progressRef, never remounts
```

Data flows one way: **scroll → tracker → indicator + sections + jet**. Sections never talk to each other, and nothing but the jet layer touches the jet.

---

## 1. GSAP ownership (strict)

- **Registration lives in exactly one place: `src/App.tsx:14`.**
  `gsap.registerPlugin(ScrollTrigger, SplitText)` at module scope. No section, hook, or util registers plugins — ever. If a new plugin is needed (e.g. `ScrollSmoother`, `Flip`), add it in `App.tsx` next to the existing line.
- **Lenis is wired in `src/lib/smoothScroll.ts:5`.** `lenis.on('scroll', ScrollTrigger.update)` driven by `gsap.ticker` (`smoothScroll.ts:17`). Every `ScrollTrigger` rides this — no per-component scroll listeners.
- **Prefer `useGSAP` from `@gsap/react`** over `useEffect`/`useLayoutEffect`. Pass `scope` where possible (`{ scope: rootRef }`).

## 2. Motion system (`src/lib/motion.ts:1`)

Single toggle for the whole site — intentionally trivial:

```ts
// src/lib/motion.ts:3
export let reduceMotion: boolean | null = null // null = follow OS, true = force reduced, false = force motion

export function prefersReducedMotion(): boolean // reads reduceMotion or matchMedia
export function setReducedMotion(v: boolean | null) // set + notify
export function toggleReducedMotion(): boolean // flip
```

- **Usage:** `if (prefersReducedMotion()) return` at the top of every `useGSAP` timeline (`Hero.tsx:17`, `About.tsx:14`, `Experience.tsx:34`, etc.). `Hero.tsx:310` gates WebGL: `{!prefersReducedMotion() && <PixelBlast />}`.
- **To force:** edit `motion.ts:3` to `true`/`false` and reload, or call `setReducedMotion(false)` / `toggleReducedMotion()` from console. No hook, no subscription — global early-return is the plan, `index.css:486 @media (prefers-reduced-motion: reduce)` is the backstop.
- **Extending:** add `useReducedMotion()` hook here if you need reactive UI (returns `useSyncExternalStore` on `reduceMotion` + `matchMedia` `change` event). Keep the variable as the single source of truth.

## 3. Per-section animation rules

Each section owns a self-contained timeline — same engine, different choreography:

1. **Guard first.** `if (prefersReducedMotion()) return` — jump to end states. Do this before any `SplitText` or `gsap.set`.
2. **SplitText unified.** Always `SplitText.create(target, { type: 'chars' })` (or `type: 'lines, words, chars'` with `linesClass`/`wordsClass`/`charsClass`). Never `new SplitText`. Revert in cleanup: `return () => { split.revert() }` (`Hero.tsx:267`, `Projects.tsx:411`).
3. **Set then to.** `gsap.set(target, { opacity:0, filter:'blur(10px)' })` before `tl.to(target, { opacity:1, filter:'blur(0px)' })`. Avoid `tl.from` on the same target that already has a `gsap.set`.
4. **One trigger per concern.** Entrance, scrubbed pin, exit are separate `ScrollTrigger`s with explicit `start`/`end`. Never one mega-trigger doing three jobs.
5. **`invalidateOnRefresh: true`** on anything measuring layout (pins, `xPercent`) so resize/refresh recalculates.
6. **Kill on unmount.** Every `useGSAP` returns `ctx.revert()` or `split.revert()` — no orphaned triggers (StrictMode double-fire).

Global constraints: animate `transform` (`x`, `y`, `scale`, `xPercent`) + `autoAlpha`/`filter:blur` only (`gsap-performance` skill); never `width`/`height`/`top`.

## 4. Section contract (`src/components/sections/`)

- One component per section: `Hero`, `About`, `Experience`, `Projects`, `Tools`, `Contact`, `Footer`. (`Hobbies` placeholder lives inline in `Home.tsx` so tracking stays complete.)
- Each renders `<section id="<id>" data-section="<id>">` — `id` must match `src/config/sections.ts:4` (`SECTION_IDS`), because `useSectionTracker` finds sections by `document.getElementById` (`ARCHITECTURE.md §4`).
- Sections own **only their own DOM**. They publish nothing; the tracker observes them.
- Import sections through the barrel (`@/components/sections/index.ts:1`), never by deep path.
- Data-driven where possible: `experiences.map()` (`Experience.tsx:10`), `projects.map()` (`Projects.tsx:14`), `tools` orbits. Add an entry → it renders.

### Adding a new section

1. Create `src/components/sections/MySection.tsx` — follow the template:
   ```tsx
   import { useGSAP } from '@gsap/react'
   import { gsap } from 'gsap'
   import { SplitText } from 'gsap/SplitText'
   import { prefersReducedMotion } from '@/lib/motion'
   // gsap.registerPlugin lives only in App.tsx

   export function MySection() {
     useGSAP(() => {
       if (prefersReducedMotion()) return
       const split = SplitText.create('.my-title', { type: 'chars' })
       gsap.set('.my-title', { opacity: 0, filter: 'blur(10px)' })
       const tl = gsap.timeline({
         scrollTrigger: {
           trigger: '#my-section',
           start: 'top top',
           end: '+=200%',
           scrub: true,
           pin: true,
           anticipatePin: 1,
         },
       })
       tl.to('.my-title', { opacity: 1, filter: 'blur(0px)', duration: 1 })
       return () => split.revert()
     }, [])
     return (
       <section id="my-section" data-section="my-section">
         ...
       </section>
     )
   }
   ```
2. Export it in `src/components/sections/index.ts`.
3. Add `{ id: 'my-section', label: 'MY SECTION' }` to `src/config/sections.ts`.
4. Mount it in `src/pages/Home.tsx:15`.
5. Add SEO entry in `src/lib/seo.ts` if it has a route.

## 5. Shared state: the tracker

- `useSectionTracker()` is called **once**, in `Home.tsx:19`, with no arguments (defaults to all `SECTION_IDS`).
- Returns `{ active, direction, progressRef }`:
  - `active` + `direction` → React state → `TopBar` indicator.
  - `progressRef` → mutation-only ref (`Record<SectionId, number>` 0→1) → jet reads it at 60fps without re-rendering React.
- Never call the hook inside a section — that duplicates one `ScrollTrigger` per call site.

## 6. The one jet (target design)

- Exactly **one** jet instance in a persistent fixed layer behind content. Never unmounts, never re-instantiates per section.
- Jet layer subscribes to `progressRef` (+ `active` for discrete poses) and maps journey progress → pose each frame. Sections drive it **indirectly** by being scrolled through — no section imports or animates the jet.
- Jet styling (colors, scale) lives in `src/config/jet.ts` when it returns; pose logic lives in the jet layer.

## 7. UI building blocks (`src/components/ui/`)

- Chrome from `CyberFrame` (`ui/cyber-frame.tsx:37` — `data-slot="cyber-frame"`). `Tag`, `Button`, `CyberImage` are frame-based — frame is border/background, inner stays `border-0 bg-transparent`.
- `JapaneseText` (`ui/japanese-text.tsx:22`) — Inter + filled/outlined pair, `id` prop forwards to wrapper span.
- Primitives (`button`, `input`, `card`, `select`, `checkbox`, `skeleton`, `tabs`, etc.) are shadcn/ui + `radix-ui` — kept even if unused; they are the design system.
- Headings default to CSS fonts: `h1` Cyberform, `h2–h6` Ticking, body Universa — `font-cyberform` / `font-ticking` / `font-universa` utilities.

### Adding a new UI primitive

1. Create `src/components/ui/my-thing.tsx` with `data-slot="my-thing"` and `cn()` styling.
2. Re-export in barrel if needed.
3. Never use raw `<button>`/`<input>` when a primitive exists (per `AGENTS.md §3.4`).

## 8. Current tree (post-cleanup)

```
src/
  App.tsx                  GSAP registration (ScrollTrigger, SplitText) + routes
  main.tsx                 providers, Lenis init, skeleton fadeout
  MainLayout.tsx           skip-link + <Outlet>
  pages/Home.tsx           tracker owner: TopBar + ScrollBar + sections
  components/
    TopBar.tsx             section indicator (reads active/direction)
    ScrollBar.tsx          custom scrollbar (motion-aware)
    SeoUpdater.tsx         per-route title/meta
    PixelBlast.tsx         WebGL hero background (gated by prefersReducedMotion)
    sections/              Hero / About / AboutRow (orphaned) / Experience / Projects / Tools / Contact / Footer + barrel
    ui/                    primitives + cyber set (CyberFrame, CyberImage, JapaneseText, Tag, Button, ...)
    jet/                   Jet / JetScene (currently disabled in App.tsx:25)
  config/sections.ts       section ids/labels (tracker source of truth)
  hooks/useSectionTracker.ts  scroll → { active, direction, progressRef }
  lib/                     constants, seo, smoothScroll (Lenis), queryClient, utils, motion (reduceMotion toggle)
```

Dead kept intentionally: `ui/*` primitives, `hooks/useDebounce`, `hooks/useIsMobile` — design system reserve. Dead to remove next: `sections/AboutRow.tsx` (orphaned after About inlined).

## 9. Extending this doc

Add new top-level sections as `## 10.`, `## 11.`, etc. Keep `## 0–8` stable — they are the contract. For each new system answer: **What it is → where it lives → what controls it → what data it receives → how to customize it.** Example: “Add `Hobbies` → lives in `sections/Hobbies.tsx`, controlled by `progressRef.hobbies`, data from `config/hobbies.ts`, customize via `lib/motion.ts` toggle.”

---

Removed as dead (historical): `motion`-based ui files (broken imports), `config/jet|journey` (scene deleted), auth `ROUTES`/`ROUTE_SEO` entries.
