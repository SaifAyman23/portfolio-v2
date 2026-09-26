# PROBLEMS — needs-fixing list

> Audited 2026-09-22 against `AGENTS.md` + `docs/{Performance,SEO,Accessibility,BestPractices}.md`.
> Owner order 2026-09-24: `src/components/sections/` reverted to original — section timelines,
> targets and styling are byte-identical to `712d9b5`. Nothing in sections/* may be touched
> without explicit permission (animations AND styling).
> Gate status now: `typecheck` ✅ · `lint` ✅ · `format:check` ❌ (this file only) ·
> `test` 9/12 ❌ (3 known failures documented below, all inside reverted section code) ·
> Chromium headless: hero renders, zero console errors.

---

## P0 — gate / correctness

1. ✅ **Prettier drift** — `npm run format` applied. (AGENTS.md §17)
2. ✅ **`console.log` removed** — `TopBar.tsx` (outside sections, kept). (AGENTS.md §3.8)
3. ✅ **GSAP registration unified** — `Observer` moved into `App.tsx:14`; per-section
   `registerPlugin` calls deleted. **Reverted with sections** — `About`/`Hero` re-register locally
   again. Harmless duplicate, but ARCHITECTURE §1 wants it centralized. Needs permission to touch.
4. ✅ **Footer morph link** — `rel="noopener noreferrer"` added. **Reverted with sections**
   (link is back without `rel`). Needs permission to touch.
5. ⚠️ **Duplicate `.row-img-1` targets** — fix reverted with sections (both rows share the class
   again). Needs permission to touch. (correctness)
6. ⚠️ **`useGSAP` unscoped** — `rootRef`/`scope` reverted with sections. Needs permission to touch.
   (`docs/ARCHITECTURE.md` §2)
7. ⚠️ **Missing `invalidateOnRefresh`** — reverted with sections. Needs permission to touch.
   (`docs/ARCHITECTURE.md` §2)

---

## P1 — performance / SEO / a11y

8. ✅ **`index.html` meta** — production canonical/OG/Twitter + JSON-LD (outside sections, kept).
   (AGENTS.md §10, SEO §3/§4)
9. ✅ **OG image** — owner-supplied `public/og.png` (1200×630) wired into `og:image` /
   `twitter:image` (+ dims) and `getOgImage()`; JSON-LD `logo` stays `logo.ico`. (SEO §4)
10. ✅ **Empty `id={''}`** — removed from Hero `JapaneseText`. **Reverted with sections** (empty id
    is back). Needs permission to touch. (BestPractices §1)
11. ✅ **Single `<h1>`** — demotions + `leading-[1.1]` pins reverted with sections (all `h1`s back).
    Needs permission to touch. (SEO §6, Accessibility §1.4)
12. ✅ **Decorative alts + lazy covers** — reverted with sections (`alt="background image"` back,
    covers eager again). Needs permission to touch. (Accessibility §4.1, Performance §4)
13. ✅ **`AboutRow.tsx` deleted again** — removed in `8d06b04` with the other unused files;
    `sections/index.ts` never exported it. (SPEC §5)
14. ✅ **Jet canvas pauses + WebGL gate** — `JetScene.tsx` visibility freeze + `lib/webgl.ts` probe
    (outside sections, kept). Chromium proved the crash: no-GL device white-screened before the
    gate; hero renders after. (Performance §3.5)
15. ✅ **Heavy libs split** — `JetScene`/`PixelBlast` `lazy()` chunks (outside sections, kept).
    Bundle is LIGHTER, not heavier (fresh `vite build` 2026-09-26): `index` 261 KB (was 501 KB),
    CSS 44 KB (was 63 KB), `vendor-react` 11 KB (was 40 KB), `vendor-query`/`vendor-radix` chunks
    gone — 18 files, 10 deps, 37 packages removed. (Performance §3)
16. ✅ **Motion toggle documented** — JSDoc in `lib/motion.ts` (kept). (Accessibility §2)

---

## P2 — hygiene / coverage

17. ⚠️ **Section axe scans red (3)** — `Hero`/`Footer` (`nested-interactive`: `HeroInfo` nests `<a>`
    in `<Button>`) and `Tools` (`svg-img-alt`: radar icon) fail because the fixes lived in reverted
    section files. `ui/button.tsx` `href` support survives but is unused until `HeroInfo` adopts it.
    Fix needs permission to touch `HeroInfo.tsx` + `Tools.tsx`. (BestPractices §6, AGENTS.md §14)
18. ✅ **`public/models` pruned** — 5 unreferenced screenshots (~3.7 MB) deleted (kept). (Performance §3)

---

## Chromium smoke test (Playwright chromium-1243, `vite preview`, 1728×1000)

- Reverted build: hero renders fully (TopBar, title, blurbs, scale-8 jet, PixelBlast dots),
  **zero console errors**. Scroll-through of Experience/Projects showed correct pinned states.
- "Heavier" feeling is not bundle weight (see §15 numbers) — if animations misbehave locally,
  restart the dev server + hard refresh: HMR leaves stale pinned ScrollTriggers alive, which
  fight the new ones (jank). Production builds are unaffected.

---

## Verified good (do not regress)

- `vite.config.ts` `base: '/portfolio/v2/'` + `%BASE_URL%` icons in `dist`;
  model URL `/portfolio/v2/models/jet.glb` in bundle; `v2/` tree on `origin/gh-pages`.
- Smart tracker: per-section progress 0–100, `active` via `isActive`.
- No routing (`App` renders `MainLayout`+`Home` directly; static `SeoUpdater`; no react-query
  provider; 18 files + 10 deps removed: router, query, framer-motion, radix tabs/slot, etc.).
- `CyberImage` lazy by default; paragraph splits back to your original char splitting
  (word-wrap variant reverted with sections — needs permission to re-apply).
