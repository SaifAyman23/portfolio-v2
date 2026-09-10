# Portfolio — Master Specification (Cyber-Tokyo Jet)

> **Mindmap / source of truth for the rebuild.** This document defines **what we are building**. The last section lists **what I need from you** before Phase 0.
>
> Single 3D protagonist: **the jet**. Everything else is scroll-driven systems, reusable components, and 2D cyber-Tokyo language.

---

## 0. Core Concept

* Single 3D jet — visual protagonist.
* Scroll controls: jet position / scale / rotation, camera, particles, environment, section content, transitions.
* **Section titles are different:** entry-triggered, not scroll-driven.

### Two types of motion

| Type | Behavior |
| --- | --- |
| **Scroll-driven** | Continuous with `scrollProgress` — jet, camera, clouds, wind, content, orbits, transitions |
| **Entry-triggered** | Plays once when section hits activation point — scrambled → red blur → sharp foreground title |

**Titles are section names:** `ABOUT` / `EXPERIENCE` / `PROJECTS` / `TOOLS` / `HOBBIES` / `CONTACT`

> Reusable title system: same engine, per-section direction/effects via props. Never tie title animation directly to scroll.

---

## 1. Visual Identity

* **Palette:** White + Black + Red. Page background = **White**.
* **No dark mode.**
* **Exception:** `Experience` = black nighttime environment with cyber-Tokyo atmosphere.

---

## 2. Cyber-Tokyo Aesthetic

Inspiration: neon Tokyo + futuristic tech + cyber UI + Japanese visual language + game-like interaction.

**Avoid clichés:** no random buildings / 3D city / holograms everywhere / excessive neon.

**Aesthetic comes from:** typography, red/black/white contrast, Japanese graphic treatment, HUD UI, scan effects, particles, motion, chamfered shapes, atmospheric effects, distortion, micro-interactions.

---

## 3. 3D Restrictions — Critical

**Only 3D allowed:**

* Jet
* Runway / platform
* Surfaces genuinely required for jet
* Very simple geometry for an effect

**Forbidden:**

* ❌ Buildings / skyline / cars / characters / 3D signs / floating 3D objects / decorative models

Tokyo is 2D design + effects, not 3D construction.

---

## 4. Shape Language

No plain rounded rectangles. Use **morphed / chamfered / angular** borders — but **no sharp edges**. Softened, engineered geometry.

Reusable shape system (e.g. `<CyberPanel chamfer="...">`), not hand-drawn borders per component.

---

## 5. Architecture Philosophy

* **Reusable:** section title, cyber panel, image frame, experience/project item, tool orbit, particles, jet controller — all reusable.
* **Data-driven:** `experiences.map()`, `projects.map()`, `tools.map()` — never `<Experience1/><Experience2/>`.
* **Configurable:** colors, fonts, timings, section config, jet settings, border geometry, title animation — centralized, no magic values.
* **Documented:** every major system notes what it does / where it lives / what controls it / how to modify / data consumed / assumptions.

---

## 6. Persistent Section Indicator

Top-of-screen meter:

```
01 ABOUT ─── 02 EXPERIENCE ─── 03 PROJECTS ─── 04 TOOLS ─── 05 HOBBIES ─── 06 CONTACT
```

* Always visible, animates between sections, fits cyber aesthetic, smooth. Reusable, decoupled from section logic.

---

## 7. Sections

### SECTION 0 — HERO — Establish World

**Hierarchy:** `SAIF AYMAN` (dominant) → `FULL-STACK SOFTWARE ENGINEER` → brief intro. Ladder typography.

**Jet:** on futuristic runway — square tiles, thin borders, contact shadow, depth. Feels grounded.

**Scroll exit:** jet takes off → hero content blurs → disappears → particles → clear transition to About.

---

### SECTION 1 — ABOUT

* **Title `ABOUT`:** right → center, scrambled red blur → sharp. Holds center, then moves up / shrinks to make room for content.
* **Jet:** only right half, below → left side (deliberate crop).
* **Exit:** text blurs → disappears, jet → top + particles → to Experience.

---

### SECTION 2 — EXPERIENCE — First Flight Sequence (Black Night)

* **Title `EXPERIENCE`:** from below, standard animation → jet rises from bottom, large enough to **cover title** (cinematic).
* **Flight:** large/close → smaller → toward horizon; camera flies with jet.
* **Infinite effects (recycled):** clouds `A→B→C→reposition→A`, wind lines — infinite feel without infinite objects. Perf critical.
* **Content:** tiny/blurred far → approach → clear → pass viewer, slightly rotated. Layout data-driven:

  ```ts
  layout: "text-image" | "image-text"  // data decides order, not markup
  ```

  Images use same chamfered cyber shape. Hold period: enter → readable → dwell → exit. Data in `experiences[]`. Architecture allows N items (currently 2).
* **Exit:** jet accelerates → horizon + particles/clouds/blur → into Projects.

---

### SECTION 3 — PROJECTS — Blur Morph

* Starts **inside Experience blur** — no hard cut. Jet/textures already present.
* **Title `PROJECTS`:** standard animation + special exit effect (designed in phase), then projects dominate.
* **Project = `IMAGE + TEXT + TAGS`**

  ```ts
  { image, text, tags: string[] }
  ```

  Tags font = centrally configurable, single source of truth.
* **Entrance:** blurred → resolves. **Project→Project:** `P1 → blur/distortion → morph → P2` (blur is transition, not cut/fade).
* **Composition:** jet at bottom, only left half, facing right. Slight left tilt of **section/composition** (not individual pieces):

  ```
  ┌─────────────────────┐
  │      PROJECT        │
  │   IMAGE / TEXT     │
  │   [TAG][TAG]       │
  │─────────────────────│
  │               ✈    │
  └─────────────────────┘
  ```

---

### SECTION 4 — TOOLS — Orbital System

* **Title `TOOLS`:** standard entry → moves to top-left corner and stays.
* **Jet:** top → center descent.
* **Orbits:** staggered `Orbit1 → Orbit2 → Orbit3`; all formed by center arrival.

  * Categories: `Backend / Frontend / Tools`
  * Skills = electrons orbiting jet (jet is center of system). Add subtle particles / trails / pulses / red energy — supportive, not noise.
* **Exit:** title blur→gone, skills blur→gone, orbits `expand → expand →消失`, jet ↓ to Hobbies.

---

### SECTION 5 — HOBBIES — TBD

Left completely open. **You define interaction when we reach this phase.** No invention now.

---

### SECTION 6 — CONTACT — Return to Origin (Footer)

Echoes Hero but not copy. Name + brief + links.

* **Jet:** right → left, lands on platform near left. Narrative closure: `Hero: runway start → journey → Contact: landing`.

---

## 8. Hard Restrictions

* ❌ No unnecessary 3D (jet is hero)
* ❌ No 3D Tokyo city
* ❌ No sharp rectangles (chamfered but softened)
* ❌ No hardcoded content (data-driven)
* ❌ No duplicated components (reuse)
* ❌ No animation spaghetti (controlled scroll architecture)
* ❌ No monolithic component (clear responsibilities)
* ❌ No title tied to scroll (triggered vs driven — most important)

---

## 9. Development Phases

| Phase | Scope |
| --- | --- |
| **0 — Foundation** | Arch, theme/config, fonts, global styles, scroll system, section tracking, meter, cyber shape system, title animation, R3F/Three foundation, jet loading, perf foundation. **Gate before anything else.** |
| **1 — Hero** | Only Hero |
| **2 — About** | About + Hero→About transition |
| **3 — Experience** | Flight system + infinite clouds/wind + experiences + exit |
| **4 — Projects** | Blur morph + tag system + tilted composition |
| **5 — Tools** | Orbit system |
| **6 — Hobbies** | You define first |
| **7 — Contact** | Landing + closure |
| **8 — Polish** | Perf, responsive/mobile, loading, a11y, refinement, cross-browser, cleanup, docs, visual consistency |

---

## 10. What I Need From You Before Phase 0

You asked me to be explicit — here is the checklist. **We do not proceed without items 1–3; item 4 can come incrementally.**

### 1. The Jet — Most Important

- [ ] Provide `.glb` / `.gltf` jet — OR — tell me to find a free one
- Ideal: stylized/futuristic, strong silhouette, low poly, WebGL-optimized, portfolio-licensed
- Tell me: color preference? (White/black/red assumption per palette) Any existing direction?

### 2. Fonts

- [ ] Main typography?
- [ ] Title font (if different)?
- [ ] Project/tool tag font (centrally configurable)?
- If undecided: we pick placeholders now, you lock later — but tags need single source of truth from start.

### 3. Exact Colors

- [ ] Exact red — concept is White/Black/Red, but need hex (e.g. `#FF0A2B`? `#E10600`?). Placeholders OK to start, final hex before visual lock.
- [ ] Confirm: pure white `#FFFFFF` background? Off-white? Black = pure `#000000` or soft `oklch(0.14 ...)` currently in use?

### 4. Actual Content (can arrive per-phase)

- [ ] Name / Job title / Hero description
- [ ] About content
- [ ] Experience entries (currently 2 — confirm data + desired `layout` per item)
- [ ] Projects (`image + text + tags` per project — currently 5 in `src/lib/projects.ts`)
- [ ] Tools/skills by category (Backend/Frontend/Tools — need lists for 3 orbits)
- [ ] Hobbies → define at Phase 6
- [ ] Contact links (email, GitHub, LinkedIn, Resume URL — currently in `src/lib/constants.ts:CONTACT`)

### 5. Decisions to Defer

* Hobbies: intentionally blank until Phase 6.
* Any section-specific title direction tweaks — we keep engine reusable, you approve per-section overrides later.

---

## 11. Architectural Rule We Follow

For every major system we answer:

> **What it is → where it lives → what controls it → what data it receives → how to customize it.**

So later you can change:

* "Make jet red" → `config/jet.ts`
* "Swap Experience 2 to image-left" → `data/experiences.ts: layout`
* "Title 300ms faster" → `config/titleAnimation.ts`
* "Add a project" → `data/projects.ts`

...without hunting hardcoded values.

---

*Last updated: 2026-09-10 — Master spec is mindmap. Next step: you confirm/attach jet + fonts + red hex → we lock Phase 0 foundation.*
