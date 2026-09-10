# Saif Eldin Ayman

Full-stack engineer. This is my portfolio — the work, the thinking behind it, and the code that ships it.

Production-grade products end to end: Django APIs and real-time systems underneath, React interfaces and a real-time WebGL shader up front. Fast by default, accessible by standard, SEO-solid by design.

---

## Stack

| Layer        | Tech                                       |
| ------------ | ------------------------------------------ |
| Framework    | React 19 + TypeScript (strict)             |
| Bundler      | Vite 7 — HMR, code splitting               |
| Styling      | Tailwind CSS v4 + CSS variable tokens      |
| UI           | Radix UI primitives via shadcn/ui          |
| Motion       | `motion` (Framer Motion v12), GSAP         |
| Shaders / FX | `ogl` (WebGL/GLSL) — hero only             |
| State        | Zustand (client) · TanStack Query (server) |
| HTTP         | Axios with auth interceptors               |
| Routing      | React Router v7, fully lazy-loaded         |
| Testing      | Vitest + RTL + axe-core a11y scans         |

## Local Setup

```bash
git clone <repository-url>
cd portfolio
npm install
npm run dev
```

Open `http://localhost:5173`. Node 20+, npm 10+.

## Scripts

| Command             | What it does                                 |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Dev server with HMR                          |
| `npm run build`     | Production build → `dist/`                   |
| `npm run preview`   | Preview the production build locally         |
| `npm run check`     | Full gate: typecheck + lint + format + tests |
| `npm run typecheck` | `tsc -b --noEmit`                            |
| `npm run lint`      | ESLint (flat config)                         |
| `npm run format`    | Prettier write across the repo               |

## Architecture

- **Thin pages, real components** — pages orchestrate; UI lives in `components/<domain>/` with barrel exports
- **Design tokens** — every color/radius/shadow is a CSS variable exposed as a Tailwind utility
- **Every state designed** — loading, empty, error, success
- **Motion with discipline** — GPU-friendly transforms/opacity, disabled under `prefers-reduced-motion`
- **Accessibility as baseline** — skip links, `:focus-visible`, semantic HTML, axe-core tests in CI

Full conventions live in [AGENTS.md](./AGENTS.md).

## Quality Gates

CI runs on every push and PR:

```
typecheck → lint → format:check → tests → build
```

Red pipeline means no merge. Performance targets follow the Web Vitals playbook in AGENTS.md Part C (LCP < 2.5s, CLS ≈ 0, INP < 200ms).

## Environment

Copy `.env.example` to `.env`:

| Variable             | Purpose                              |
| -------------------- | ------------------------------------ |
| `VITE_API_URL`       | Backend API base URL                 |
| `VITE_APP_NAME`      | Display name                         |
| `VITE_SITE_URL`      | Canonical URL (SEO, sitemap, robots) |
| `VITE_CONTACT_EMAIL` | Email shown in hero contact bar      |
| `VITE_GITHUB_URL`    | GitHub profile link                  |
| `VITE_LINKEDIN_URL`  | LinkedIn profile link                |

Never commit populated `.env` files.

## Deploy

Static SPA build in `dist/`. Ships cleanly to Vercel (`vercel.json` included), Netlify, or Cloudflare Pages. Docker dev setup included (`Dockerfile.dev`, `docker-compose.yml`). Configure the host to rewrite all paths to `index.html`.

---

Saif Eldin Ayman — React · TypeScript · Django · Real-time Systems
