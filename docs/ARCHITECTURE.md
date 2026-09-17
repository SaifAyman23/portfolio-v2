# Architecture — 最強 Portfolio

> Single source of truth for how this site is built. Aesthetic: white + black + red (`#B50000`, darker `#8B0606`), modern cyber-Japanese. Motion: GSAP everywhere, **one persistent jet**.

---

## 0. Big picture

```
App.tsx                      registers GSAP plugins once
  └─ Home.tsx                owns section state (useSectionTracker, called once)
       ├─ TopBar             reads { active, direction } — indicator only
       ├─ sections/*         six section components, each owns its own animation
       └─ (jet layer)        ONE persistent jet, reads progress, never remounts
```

Data flows one way: scroll → tracker → indicator + sections + jet. Sections never talk to each other, and nothing but the jet layer touches the jet.

---

## 1. GSAP ownership (strict)

- **Registration lives in exactly one place: `src/App.tsx`.**
  `gsap.registerPlugin(ScrollTrigger)` at module scope. No component, hook, or util registers plugins — ever. If a new plugin is needed (e.g. ScrollSmoother), it goes in `App.tsx` next to the existing line.
- **Lenis is already wired** (`src/lib/smoothScroll.ts`): `lenis.on('scroll', ScrollTrigger.update)` driven by `gsap.ticker`. Every ScrollTrigger in the app rides this — no per-component scroll listeners.

## 2. Per-section animation rules

Each section gets wildly different motion, so each section owns a self-contained timeline:

1. **Scope everything with `gsap.context`.** All selectors and triggers for a section live inside one `gsap.context(() => {...}, rootRef)`, reverted in the effect cleanup. Use `useLayoutEffect` (or `useGSAP` from `@gsap/react`, which is StrictMode-safe by default).
2. **One trigger per concern.** Entrance reveal, scrubbed parallax, and exit are separate `ScrollTrigger`s with explicit `start`/`end` — never one mega-trigger doing three jobs.
3. **Scrub belongs to the jet; reveals belong to sections.** Continuous scroll-linked motion (`scrub: true`) is for the jet layer. Section content uses `toggleActions: 'play none none reverse'` so enter/leave animations reverse cleanly on scroll-up.
4. **`invalidateOnRefresh: true`** on anything measuring layout (pins, xPercent moves) so resize/refresh recalculates instead of breaking.
5. **Reduced motion first.** Guard timelines with `matchMedia('(prefers-reduced-motion: reduce)')` — jump to end states. The global CSS kill-switch in `index.css` is the backstop, not the plan.
6. **Kill on unmount.** Every effect returns its context's `revert()`. No orphaned triggers — they leak scroll handlers and double-fire in StrictMode dev.

## 3. Section contract (`src/components/sections/`)

- One component per section: `Hero`, `About`, `Experience`, `Projects`, `Tools`, `Contact`. (`Hobbies` is user-defined later — its placeholder lives inline in `Home.tsx` so tracking stays complete.)
- Each renders `<section id="<id>" data-section="<id>">` — the `id` must match `src/config/sections.ts`, because the tracker finds sections by `document.getElementById`.
- Sections own **only their own DOM**. They publish nothing; the tracker observes them.
- Section titles are plain `h1`/`h2` (fonts come from CSS). Entrance motion is per-section GSAP, following the rules in §2.
- Import sections through the barrel (`@/components/sections`), never by deep path.

## 4. Shared state: the tracker

- `useSectionTracker()` is called **once**, in `Home.tsx`, with no arguments (defaults to all `SECTION_IDS`).
- It returns `{ active, direction, progressRef }`:
  - `active` + `direction` are React state → the `TopBar` indicator.
  - `progressRef` is a mutation-only ref (`Record<SectionId, number>`, 0→1 per section) → the jet reads it in its render loop. Refs, not state, so 60fps updates never re-render React.
- Never call the hook inside a section — that duplicates one ScrollTrigger per call site.

## 5. The one jet (target design)

- Exactly **one** jet instance for the whole page, in a persistent fixed layer behind content. It never unmounts, never re-instantiates per section.
- The jet layer subscribes to `progressRef` (and `active` for discrete pose changes) and maps journey progress → jet pose each frame. Sections drive it **indirectly** by being scrolled through — no section imports, controls, or animates the jet.
- Jet styling (colors, scale) lives in config (`src/config/jet.ts` when it returns); pose logic lives in the jet layer, not in sections.

## 6. UI building blocks (`src/components/ui/`)

- Chrome comes from `CyberFrame` (chamfered vector border, animatable paths via `data-slot` + refs). `Tag`, `Button`, and `CyberImage` are all frame-based — the frame is the border/background, so inner elements stay transparent (`border-0 bg-transparent`).
- `stroke={false}` on `CyberFrame` renders fill-only. Frame color follows text via `stroke="currentColor"` where appropriate.
- Japanese display text uses `JapaneseText` (Inter + filled/outlined layer pair). Headings default to fonts via CSS: `h1` Cyberform, `h2–h6` Ticking, body Universa — plus `font-cyberform` / `font-ticking` / `font-universa` utilities for free use.

## 7. Current tree (post-cleanup)

```
src/
  App.tsx                  GSAP registration + routes
  main.tsx                 providers, skeleton fadeout
  MainLayout.tsx           skip-link + <Outlet>
  pages/Home.tsx           tracker owner: TopBar + sections
  components/
    TopBar.tsx             section indicator (reads active/direction)
    SeoUpdater.tsx         per-route title/meta
    sections/              Hero About Experience Projects Tools Contact + barrel
    ui/                    primitives (button, input, card, …) + cyber set
  config/sections.ts       section ids/labels (tracker source of truth)
  hooks/useSectionTracker.ts  scroll → { active, direction, progressRef }
  lib/                     constants, seo, smoothScroll (Lenis), queryClient, utils
```

Removed as dead: `motion`-based ui files (broken imports, unused), `config/jet|journey` (scene deleted with them), auth `ROUTES`/`ROUTE_SEO` entries, `OAUTH_PROVIDERS`, broken barrel re-exports.
