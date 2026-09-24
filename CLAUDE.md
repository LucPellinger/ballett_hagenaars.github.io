# CLAUDE.md

Context for Claude (Claude Code / Cowork) working in this repository.

## Project

Website of **Ballettschule Hagenaars** (ballet school in Haßloch, Germany; owner Maricel
Pellinger-Hagenaars). Multi-page PWA, deployed to GitHub Pages from the `prod` branch.
Audience: parents, children, adult students – many on phones. Primary language **German**,
English secondary.

## Stack

React 19 · Vite 8 · TypeScript strict (`noUncheckedIndexedAccess`) · React Router 7 (`react-router`)
· CSS Modules + design tokens · Vitest + Testing Library · ESLint (typescript-eslint, jsx-a11y strict)
· vite-plugin-pwa · **Yarn 4 via Corepack** (never npm/pnpm; `nodeLinker: node-modules`).

## Commands

```bash
yarn dev            # http://localhost:5173
yarn check          # typecheck + lint + test + placeholder report – run after every change
yarn build          # tsc -b && vite build
yarn test           # vitest run
yarn content:check  # list placeholder content
yarn ticket:new "Title" --type feat | yarn ticket:move <id> <status> | yarn board
```

## Architecture

- `src/content/` – **single source of truth for all user-visible content** (typed by `types.ts`,
  aggregated in `index.ts`, validated by `content.test.ts`). Components never contain copy.
  UI strings (labels, aria texts) go to `content/ui.ts`.
- `Localized<T> = { de: T; en?: T }`; resolve with `const { t } = useLanguage(); t(value)`.
- `src/components/{layout,ui,features}/<Name>/` – one folder per component:
  `Name.tsx`, `Name.module.css`, `index.ts`, optional `Name.test.tsx`. Re-export from the group `index.ts`.
  - `layout/` app shell, `ui/` generic building blocks, `features/` domain components.
- `src/pages/` – one page per route; composes content + components; renders `<PageMeta>` and exactly one `<h1>`
  (via `<Hero>` or `<PageHeader>`).
- Routes: URLs in `content/navigation.ts`, component mapping in `src/routes.tsx` (lazy-loaded).
- Theme: `data-theme` on `<html>`, tokens in `src/styles/tokens.css`. Set pre-paint in `index.html`.
- Base path is configurable (`BASE_PATH` env) – always use router `<Link>`/`SmartLink` and imported assets,
  never hard-coded absolute URLs to `/assets/...`.
- GitHub Pages SPA fallback: generated `404.html` → `?redirect=` → restored in `main.tsx`.

## Rules

1. **Accessibility is a requirement**, not polish: semantic HTML, one `h1` per page, logical heading
   order, `alt` on every image (Localized), visible focus, 44 px tap targets, `aria-pressed`/`aria-expanded`
   on toggles, respect `prefers-reduced-motion`. New colours must meet WCAG AA in **both** themes.
2. **Mobile first**; check ~390 px and ≥ 1280 px.
3. Every new user-visible string needs `de` (and ideally `en`).
4. Use tokens (`var(--…)`), no raw hex values in component CSS.
5. No new runtime dependencies without asking. No external fonts, trackers, embeds (GDPR).
6. Keep the poster aesthetic: oversized tight grotesk headlines (`--fs-poster`, `--tracking-poster`),
   grainy red surfaces (`--poster-*`, `--grain`), black & white photos.
7. Placeholder/sample data must carry `status: 'placeholder'` or a `PLACEHOLDER` comment.
8. Add/extend tests for logic and content integrity; `yarn check` must pass before you finish.

## Git conventions (enforced by hooks + CI)

- Branches: `main`, `dev` (default, integration), `prod` (live). Work branches:
  `<type>/<ticket-id>-<slug>`, e.g. `feat/13-gallery-lightbox`. PRs target `dev`; hotfixes target `prod`.
- Commits: `feat(#13): add lightbox`, `fix: …`, `hotfix(#22): …`, `content(#3): …`, `chore: …`, `docs: …`.
- Tickets: `tickets/NNN-slug.md` (front matter `status: backlog|todo|in-progress|review|done`);
  update with `yarn ticket:move`, which regenerates `BOARD.md`. Never edit BOARD.md by hand.
- Don't push to `main`/`prod` or run `promote.sh` unless explicitly asked.

See CONTRIBUTING.md for the full workflow and docs/CONTENT_GUIDE.md for content editing.
